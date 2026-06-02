<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Replace these with your actual keys from .env
define('YOUTUBE_API_KEY', 'AIzaSyAn1T1xEZrTmv3rdoVMT4wFJ9tiiaQ9WAs');
define('YOUTUBE_CHANNEL_ID', 'UCq_qjpp_LAIrSOS2b69Ka3w');

if (empty(YOUTUBE_API_KEY) || empty(YOUTUBE_CHANNEL_ID) || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
    echo json_encode([]);
    exit;
}

$url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" . YOUTUBE_CHANNEL_ID . "&type=video&order=date&maxResults=5&key=" . YOUTUBE_API_KEY;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if (isset($data['error'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch videos']);
    exit;
}

$videos = [];
if (isset($data['items'])) {
    foreach ($data['items'] as $item) {
        $videos[] = [
            'video_id' => $item['id']['videoId'],
            'title' => $item['snippet']['title'],
            'description' => $item['snippet']['description'],
            'thumbnail_url' => $item['snippet']['thumbnails']['high']['url'] ?? $item['snippet']['thumbnails']['default']['url'] ?? null,
            'published_at' => $item['snippet']['publishedAt'],
            'watch_url' => "https://youtube.com/watch?v=" . $item['id']['videoId']
        ];
    }
}

echo json_encode($videos);
?>
