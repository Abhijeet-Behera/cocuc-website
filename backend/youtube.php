<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Disable cache during testing
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");



header("Content-Type: application/json");





if (isset($_GET['debug'])) {
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode([
        "version" => "playlist-api-v3",
        "file" => __FILE__,
        "time" => date("c")
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Keep API key server-side only.
// API key is now loaded from backend/.env instead of hardcoding it here.
$envPath = __DIR__ . '/.env';

if (!file_exists($envPath)) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Environment file not found.'
    ]);
    exit;
}

require_once __DIR__ . '/env_loader.php';
$env = loadEnv($envPath);

if (!$env || empty($env['YOUTUBE_API_KEY'])) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'YouTube API key is missing in .env file.'
    ]);
    exit;
}

define('YOUTUBE_API_KEY', $env['YOUTUBE_API_KEY']);
define('YOUTUBE_CHANNEL_ID', $env['YOUTUBE_CHANNEL_ID'] ?? '');

// Paste exact playlist IDs here
$playlists = [
    [
        'section' => 'sermon',
        'title' => 'Sermon',
        'playlist_id' => 'PLjYGidLI9l0BHAPX_OifAMN8SbslwjP2a'
    ],
    [
        'section' => 'pratoJyoti',
        'title' => 'Prato Jyoti',
        'playlist_id' => 'PLjYGidLI9l0A7siLS3N37SwexXXCY6ORj'
    ],
    [
        'section' => 'santiRoBarta',
        'title' => 'Santi ro Barta',
        'playlist_id' => 'PLjYGidLI9l0CfRcarD9FesVBbh75To9XS'
    ]
];

if (empty(YOUTUBE_API_KEY) || YOUTUBE_API_KEY === 'PASTE_YOUR_YOUTUBE_API_KEY_HERE') {
    echo json_encode([
        'error' => true,
        'message' => 'YouTube API key is missing.'
    ]);
    exit;
}
function fetchLatestVideoFromPlaylist($playlist)
{
    $apiUrl = "https://www.googleapis.com/youtube/v3/playlistItems?" . http_build_query([
        'part' => 'snippet,contentDetails',
        'playlistId' => $playlist['playlist_id'],
        'maxResults' => 50,
        'key' => YOUTUBE_API_KEY
    ], '', '&');

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);

    $response = curl_exec($ch);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($response === false || !empty($curlError)) {
        return [
            'section' => $playlist['section'],
            'playlist_title' => $playlist['title'],
            'playlist_id' => $playlist['playlist_id'],
            'error' => true,
            'message' => 'Curl error: ' . $curlError
        ];
    }

    $data = json_decode($response, true);

    if (isset($data['error'])) {
        return [
            'section' => $playlist['section'],
            'playlist_title' => $playlist['title'],
            'playlist_id' => $playlist['playlist_id'],
            'error' => true,
            'message' => $data['error']['message'] ?? 'YouTube API error'
        ];
    }

    if (!isset($data['items']) || count($data['items']) === 0) {
        return [
            'section' => $playlist['section'],
            'playlist_title' => $playlist['title'],
            'playlist_id' => $playlist['playlist_id'],
            'error' => true,
            'message' => 'No video found for this playlist.'
        ];
    }

    $videos = [];

    foreach ($data['items'] as $item) {
        if (!isset($item['contentDetails']['videoId'])) {
            continue;
        }

        $title = $item['snippet']['title'] ?? '';

        if ($title === 'Private video' || $title === 'Deleted video') {
            continue;
        }

        $videoId = $item['contentDetails']['videoId'];

        $publishedAt = $item['contentDetails']['videoPublishedAt']
            ?? $item['snippet']['publishedAt']
            ?? '';

        $thumbnail = $item['snippet']['thumbnails']['maxres']['url']
            ?? $item['snippet']['thumbnails']['high']['url']
            ?? $item['snippet']['thumbnails']['medium']['url']
            ?? $item['snippet']['thumbnails']['default']['url']
            ?? null;

        $videos[] = [
            'section' => $playlist['section'],
            'playlist_title' => $playlist['title'],
            'playlist_id' => $playlist['playlist_id'],
            'video_id' => $videoId,
            'title' => $title,
            'description' => $item['snippet']['description'] ?? '',
            'thumbnail_url' => $thumbnail,
            'published_at' => $publishedAt,
            'watch_url' => "https://www.youtube.com/watch?v=" . $videoId,
            'playlist_url' => "https://www.youtube.com/playlist?list=" . $playlist['playlist_id']
        ];
    }

    if (count($videos) === 0) {
        return [
            'section' => $playlist['section'],
            'playlist_title' => $playlist['title'],
            'playlist_id' => $playlist['playlist_id'],
            'error' => true,
            'message' => 'No public video found for this playlist.'
        ];
    }

    usort($videos, function ($a, $b) {
        return strtotime($b['published_at']) - strtotime($a['published_at']);
    });

    $latestVideo = $videos[0];
    $latestVideo['error'] = false;

    return $latestVideo;
}

$result = [];

foreach ($playlists as $playlist) {
    $result[] = fetchLatestVideoFromPlaylist($playlist);
}

echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
?>