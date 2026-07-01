<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Disable cache during testing
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$envPath = __DIR__ . '/.env';

if (!file_exists($envPath)) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Environment file not found.'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

require_once __DIR__ . '/env_loader.php';
$env = loadEnv($envPath);

/*
 * Temporary safe environment checks.
 * These logs only show LOADED or MISSING.
 * They do not expose the actual credentials.
 */
error_log(
    'GOOGLE_CLIENT_ID: ' .
    (!empty($env['GOOGLE_CLIENT_ID']) ? 'LOADED' : 'MISSING')
);

error_log(
    'GOOGLE_CLIENT_SECRET: ' .
    (!empty($env['GOOGLE_CLIENT_SECRET']) ? 'LOADED' : 'MISSING')
);

error_log(
    'YOUTUBE_REFRESH_TOKEN: ' .
    (!empty($env['YOUTUBE_REFRESH_TOKEN']) ? 'LOADED' : 'MISSING')
);

if (
    !$env ||
    empty($env['GOOGLE_CLIENT_ID']) ||
    empty($env['GOOGLE_CLIENT_SECRET']) ||
    empty($env['YOUTUBE_REFRESH_TOKEN'])
) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Google OAuth credentials or YouTube refresh token missing in .env file.'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function postRequest($url, $params)
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params, '', '&'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/x-www-form-urlencoded'
    ]);

    $response = curl_exec($ch);
    $curlError = curl_error($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    if ($response === false || !empty($curlError)) {
        return [
            'error' => true,
            'message' => 'Curl error: ' . $curlError
        ];
    }

    $data = json_decode($response, true);

    if ($data === null) {
        return [
            'error' => true,
            'message' => 'Invalid JSON response from Google.',
            'http_code' => $httpCode,
            'raw_response' => $response
        ];
    }

    if ($httpCode >= 400 || isset($data['error'])) {
        return [
            'error' => true,
            'message' => $data['error_description']
                ?? $data['error']
                ?? 'Google token request failed.',
            'http_code' => $httpCode,
            'response' => $data
        ];
    }

    return $data;
}

function getRequestWithBearer($url, $params, $accessToken)
{
    $apiUrl = $url . '?' . http_build_query($params, '', '&');

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $accessToken,
        'Accept: application/json'
    ]);

    $response = curl_exec($ch);
    $curlError = curl_error($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    if ($response === false || !empty($curlError)) {
        return [
            'error' => true,
            'message' => 'Curl error: ' . $curlError
        ];
    }

    $data = json_decode($response, true);

    if ($data === null) {
        return [
            'error' => true,
            'message' => 'Invalid JSON response from YouTube.',
            'http_code' => $httpCode,
            'raw_response' => $response
        ];
    }

    if ($httpCode >= 400 || isset($data['error'])) {
        return [
            'error' => true,
            'message' => $data['error']['message']
                ?? 'YouTube API request failed.',
            'http_code' => $httpCode,
            'response' => $data
        ];
    }

    return $data;
}

// Step 1: Generate fresh access token using refresh token
$tokenResponse = postRequest('https://oauth2.googleapis.com/token', [
    'client_id' => trim($env['GOOGLE_CLIENT_ID']),
    'client_secret' => trim($env['GOOGLE_CLIENT_SECRET']),
    'refresh_token' => trim($env['YOUTUBE_REFRESH_TOKEN']),
    'grant_type' => 'refresh_token'
]);

if (isset($tokenResponse['error'])) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Failed to refresh Google access token.',
        'details' => isset($_GET['debug']) ? $tokenResponse : null
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if (empty($tokenResponse['access_token'])) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Access token missing from Google token response.',
        'details' => isset($_GET['debug']) ? $tokenResponse : null
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$accessToken = $tokenResponse['access_token'];

// Step 2: Build the upcoming-events collection.
//
// Sources used:
// 1. liveBroadcasts.list for authenticated scheduled livestreams.
// 2. The channel uploads playlist for private/public/unlisted Premieres.
$expectedChannelId = trim($env['YOUTUBE_CHANNEL_ID'] ?? '');

if (empty($expectedChannelId)) {
    http_response_code(500);

    echo json_encode([
        'error' => true,
        'message' => 'YOUTUBE_CHANNEL_ID is missing from the .env file.'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    exit;
}

$now = time();
$eventsById = [];

/*
 * Adds an event only when:
 * - it belongs to the configured channel;
 * - it has a valid future scheduled time;
 * - it has not already started;
 * - it is public, unlisted or private.
 *
 * Events are stored by video ID to prevent duplicate cards.
 */
$addEvent = function (string $videoId, array $snippet, array $status, ?string $scheduledAt, string $source, string $lifeCycleStatus = '', ?string $actualStartTime = null) use (&$eventsById, $expectedChannelId, $now) {
    if (empty($videoId) || empty($scheduledAt)) {
        return;
    }

    $channelId = $snippet['channelId'] ?? '';

    if (
        !empty($channelId) &&
        $channelId !== $expectedChannelId
    ) {
        return;
    }

    /*
     * If YouTube reports an actual start time, the stream or Premiere
     * has already started and must not remain in Upcoming Events.
     */
    if (!empty($actualStartTime)) {
        return;
    }

    /*
     * Also exclude resources whose current state says that they are
     * already live, starting live, completed or revoked.
     */
    if (
        in_array(
            $lifeCycleStatus,
            [
                'live',
                'liveStarting',
                'complete',
                'revoked'
            ],
            true
        )
    ) {
        return;
    }

    $scheduledTimestamp = strtotime($scheduledAt);

    /*
     * The event disappears once its scheduled time arrives.
     */
    if (
        $scheduledTimestamp === false ||
        $scheduledTimestamp <= $now
    ) {
        return;
    }

    $privacyStatus = $status['privacyStatus'] ?? '';

    /*
     * Private and unlisted events are intentionally included.
     */
    if (
        !in_array(
            $privacyStatus,
            ['public', 'unlisted', 'private'],
            true
        )
    ) {
        return;
    }

    $thumbnail = $snippet['thumbnails']['maxres']['url']
        ?? $snippet['thumbnails']['standard']['url']
        ?? $snippet['thumbnails']['high']['url']
        ?? $snippet['thumbnails']['medium']['url']
        ?? $snippet['thumbnails']['default']['url']
        ?? null;

    $eventsById[$videoId] = [
        'video_id' => $videoId,
        'title' => $snippet['title'] ?? '',
        'description' => $snippet['description'] ?? '',
        'thumbnail_url' => $thumbnail,
        'scheduled_at' => $scheduledAt,
        'watch_url' => 'https://www.youtube.com/watch?v=' . $videoId,
        'privacy_status' => $privacyStatus,
        'life_cycle_status' => $lifeCycleStatus,
        'channel_id' => $channelId,
        'source' => $source
    ];
};

/*
 * Step 3: Retrieve scheduled livestreams belonging to the
 * authenticated YouTube account.
 */
$broadcastResponse = getRequestWithBearer(
    'https://www.googleapis.com/youtube/v3/liveBroadcasts',
    [
        'part' => 'id,snippet,status,contentDetails',
        'broadcastStatus' => 'upcoming',
        'broadcastType' => 'all',
        'maxResults' => 50
    ],
    $accessToken
);

if (isset($broadcastResponse['error'])) {
    http_response_code(500);

    echo json_encode([
        'error' => true,
        'message' => 'Failed to fetch upcoming live broadcasts.',
        'details' => isset($_GET['debug'])
            ? $broadcastResponse
            : null
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    exit;
}

if (
    isset($broadcastResponse['items']) &&
    is_array($broadcastResponse['items'])
) {
    foreach ($broadcastResponse['items'] as $item) {
        $snippet = $item['snippet'] ?? [];
        $status = $item['status'] ?? [];

        $addEvent(
            $item['id'] ?? '',
            $snippet,
            $status,
            $snippet['scheduledStartTime'] ?? null,
            'liveBroadcasts',
            $status['lifeCycleStatus'] ?? 'upcoming',
            $snippet['actualStartTime'] ?? null
        );
    }
}

/*
 * Step 4: Retrieve the channel uploads-playlist ID.
 */
$channelResponse = getRequestWithBearer(
    'https://www.googleapis.com/youtube/v3/channels',
    [
        'part' => 'contentDetails',
        'id' => $expectedChannelId,
        'maxResults' => 1
    ],
    $accessToken
);

if (isset($channelResponse['error'])) {
    http_response_code(500);

    echo json_encode([
        'error' => true,
        'message' => 'Failed to retrieve the YouTube channel.',
        'details' => isset($_GET['debug'])
            ? $channelResponse
            : null
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    exit;
}

$uploadsPlaylistId =
    $channelResponse['items'][0]
    ['contentDetails']
    ['relatedPlaylists']
    ['uploads']
    ?? '';

if (empty($uploadsPlaylistId)) {
    http_response_code(500);

    echo json_encode([
        'error' => true,
        'message' => 'Could not find the channel uploads playlist.'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    exit;
}

/*
 * Step 5: Retrieve up to 200 recent uploaded-video IDs.
 *
 * Scheduled private Premieres should be visible here because this
 * request is authenticated as the channel owner.
 */
$uploadedVideoIds = [];
$playlistResponses = [];
$pageToken = '';
$pageCount = 0;
$maximumPages = 4;

do {
    $playlistParams = [
        'part' => 'contentDetails',
        'playlistId' => $uploadsPlaylistId,
        'maxResults' => 50
    ];

    if (!empty($pageToken)) {
        $playlistParams['pageToken'] = $pageToken;
    }

    $playlistResponse = getRequestWithBearer(
        'https://www.googleapis.com/youtube/v3/playlistItems',
        $playlistParams,
        $accessToken
    );

    if (isset($playlistResponse['error'])) {
        http_response_code(500);

        echo json_encode([
            'error' => true,
            'message' => 'Failed to retrieve channel uploads.',
            'details' => isset($_GET['debug'])
                ? $playlistResponse
                : null
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        exit;
    }

    $playlistResponses[] = $playlistResponse;

    if (
        isset($playlistResponse['items']) &&
        is_array($playlistResponse['items'])
    ) {
        foreach ($playlistResponse['items'] as $playlistItem) {
            $videoId =
                $playlistItem['contentDetails']['videoId']
                ?? '';

            if (!empty($videoId)) {
                $uploadedVideoIds[] = $videoId;
            }
        }
    }

    $pageToken = $playlistResponse['nextPageToken'] ?? '';
    $pageCount++;
} while (
    !empty($pageToken) &&
    $pageCount < $maximumPages
);

$uploadedVideoIds = array_values(
    array_unique($uploadedVideoIds)
);

/*
 * Step 6: Retrieve full details for uploaded videos.
 *
 * videos.list accepts at most 50 IDs at a time, so the IDs are
 * processed in groups.
 */
$videoDetailResponses = [];

foreach (array_chunk($uploadedVideoIds, 50) as $videoIdChunk) {
    if (empty($videoIdChunk)) {
        continue;
    }

    $videosResponse = getRequestWithBearer(
        'https://www.googleapis.com/youtube/v3/videos',
        [
            'part' => 'snippet,status,liveStreamingDetails',
            'id' => implode(',', $videoIdChunk)
        ],
        $accessToken
    );

    if (isset($videosResponse['error'])) {
        http_response_code(500);

        echo json_encode([
            'error' => true,
            'message' => 'Failed to retrieve uploaded video details.',
            'details' => isset($_GET['debug'])
                ? $videosResponse
                : null
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        exit;
    }

    $videoDetailResponses[] = $videosResponse;

    if (
        !isset($videosResponse['items']) ||
        !is_array($videosResponse['items'])
    ) {
        continue;
    }

    foreach ($videosResponse['items'] as $item) {
        $videoId = $item['id'] ?? '';
        $snippet = $item['snippet'] ?? [];
        $status = $item['status'] ?? [];
        $liveDetails = $item['liveStreamingDetails'] ?? [];

        $liveBroadcastContent =
            $snippet['liveBroadcastContent']
            ?? 'none';

        $actualStartTime =
            $liveDetails['actualStartTime']
            ?? null;

        $actualEndTime =
            $liveDetails['actualEndTime']
            ?? null;

        /*
         * Do not show an event that has already started or finished,
         * including a livestream that started before its scheduled time.
         */
        if (
            !empty($actualStartTime) ||
            !empty($actualEndTime) ||
            $liveBroadcastContent === 'live'
        ) {
            continue;
        }

        /*
         * A Premiere or livestream should be identified as upcoming,
         * have a scheduled streaming start time, or have a future
         * private publication time.
         */
        $scheduledAt =
            $liveDetails['scheduledStartTime']
            ?? $status['publishAt']
            ?? null;

        $scheduledTimestamp = !empty($scheduledAt)
            ? strtotime($scheduledAt)
            : false;

        $hasFuturePublishTime =
            $scheduledTimestamp !== false &&
            $scheduledTimestamp > $now;

        $isPremiereOrLivestream =
            $liveBroadcastContent === 'upcoming' ||
            !empty($liveDetails['scheduledStartTime']) ||
            (
                ($status['privacyStatus'] ?? '') === 'private' &&
                !empty($status['publishAt']) &&
                $hasFuturePublishTime
            );

        if (!$isPremiereOrLivestream) {
            continue;
        }

        $addEvent(
            $videoId,
            $snippet,
            $status,
            $scheduledAt,
            'uploadsPlaylist',
            $liveBroadcastContent,
            $actualStartTime
        );
    }
}

/*
 * Step 7: Sort events by the nearest scheduled time.
 */
$events = array_values($eventsById);

usort($events, function ($a, $b) {
    return strtotime($a['scheduled_at'])
        <=> strtotime($b['scheduled_at']);
});

if (isset($_GET['debug'])) {
    echo json_encode([
        'error' => false,
        'method' => 'combined-live-broadcasts-and-private-premieres',
        'channel_id_from_env' => $expectedChannelId,
        'uploads_playlist_id' => $uploadsPlaylistId,
        'final_events_count' => count($events),
        'events' => $events,
        'raw_broadcast_response' => $broadcastResponse,
        'raw_channel_response' => $channelResponse,
        'raw_playlist_responses' => $playlistResponses,
        'raw_video_detail_responses' => $videoDetailResponses
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    exit;
}

echo json_encode(
    $events,
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
);
?>