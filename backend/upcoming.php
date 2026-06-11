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
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
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
            'message' => $data['error_description'] ?? $data['error'] ?? 'Google token request failed.',
            'http_code' => $httpCode,
            'response' => $data
        ];
    }

    return $data;
}

function getRequestWithBearer($url, $params, $accessToken)
{
    $apiUrl = $url . '?' . http_build_query($params);

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
            'message' => $data['error']['message'] ?? 'YouTube API request failed.',
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

// Step 2: Fetch upcoming live broadcasts from authenticated YouTube account
$broadcastResponse = getRequestWithBearer('https://www.googleapis.com/youtube/v3/liveBroadcasts', [
    'part' => 'id,snippet,status,contentDetails',
    'broadcastStatus' => 'upcoming',
    'broadcastType' => 'all',
    'maxResults' => 50
], $accessToken);

if (isset($broadcastResponse['error'])) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Failed to fetch upcoming live broadcasts.',
        'details' => isset($_GET['debug']) ? $broadcastResponse : null
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$events = [];
$expectedChannelId = $env['YOUTUBE_CHANNEL_ID'] ?? '';

if (isset($broadcastResponse['items']) && is_array($broadcastResponse['items'])) {
    foreach ($broadcastResponse['items'] as $item) {
        $videoId = $item['id'] ?? '';
        $snippet = $item['snippet'] ?? [];
        $status = $item['status'] ?? [];

        $scheduledAt = $snippet['scheduledStartTime'] ?? null;
        $channelId = $snippet['channelId'] ?? '';

        if (!$videoId || !$scheduledAt) {
            continue;
        }

        if (!empty($expectedChannelId) && !empty($channelId) && $channelId !== $expectedChannelId) {
            continue;
        }

        if (strtotime($scheduledAt) < time()) {
            continue;
        }

        $privacyStatus = $status['privacyStatus'] ?? '';

        if ($privacyStatus !== 'public') {
            continue;
        }

        $thumbnail = $snippet['thumbnails']['maxres']['url']
            ?? $snippet['thumbnails']['standard']['url']
            ?? $snippet['thumbnails']['high']['url']
            ?? $snippet['thumbnails']['medium']['url']
            ?? $snippet['thumbnails']['default']['url']
            ?? null;

        $events[] = [
            'video_id' => $videoId,
            'title' => $snippet['title'] ?? '',
            'description' => $snippet['description'] ?? '',
            'thumbnail_url' => $thumbnail,
            'scheduled_at' => $scheduledAt,
            'watch_url' => 'https://www.youtube.com/watch?v=' . $videoId,
            'privacy_status' => $privacyStatus,
            'life_cycle_status' => $status['lifeCycleStatus'] ?? '',
            'channel_id' => $channelId
        ];
    }
}

usort($events, function ($a, $b) {
    return strtotime($a['scheduled_at']) - strtotime($b['scheduled_at']);
});

if (isset($_GET['debug'])) {
    echo json_encode([
        'error' => false,
        'method' => 'oauth-liveBroadcasts-list',
        'channel_id_from_env' => $expectedChannelId,
        'raw_items_count' => isset($broadcastResponse['items']) ? count($broadcastResponse['items']) : 0,
        'final_events_count' => count($events),
        'events' => $events,
        'raw_broadcast_response' => $broadcastResponse
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

echo json_encode($events, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
?>