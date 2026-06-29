<?php
// cron_chatbot_knowledge.php
// This script is meant to be run via a cron job (e.g., every 3 hours).
// It fetches dynamic API data directly from external sources (Google, YouTube) to completely bypass Hostinger's loopback firewall.

require_once __DIR__ . '/db_config.php';
require_once __DIR__ . '/env.php';

$updatedCount = 0;
$statusReport = [];

// Helper: Google JWT Authentication
function getGoogleAccessToken($credentialsPath) {
    if (!file_exists($credentialsPath)) return null;
    $creds = json_decode(file_get_contents($credentialsPath), true);
    if (!$creds) return null;

    $header = json_encode(['alg' => 'RS256', 'typ' => 'JWT']);
    $now = time();
    $payload = json_encode([
        'iss' => $creds['client_email'],
        'scope' => 'https://www.googleapis.com/auth/spreadsheets.readonly',
        'aud' => $creds['token_uri'],
        'exp' => $now + 3600,
        'iat' => $now
    ]);

    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = '';
    openssl_sign($base64UrlHeader . "." . $base64UrlPayload, $signature, $creds['private_key'], OPENSSL_ALGO_SHA256);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $creds['token_uri']);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(['grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer', 'assertion' => $jwt]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    $tokenData = json_decode($response, true);
    return $tokenData['access_token'] ?? null;
}

$credentialsPath = __DIR__ . '/google-credentials.json';
$googleToken = getGoogleAccessToken($credentialsPath);

// 1. Direct Fetch: Memory Verses
$verseSheetId = $_ENV['NEXT_PUBLIC_MEMORY_VERSE_SPREADSHEET_ID'] ?? $_ENV['MEMORY_VERSE_SPREADSHEET_ID'] ?? getenv('NEXT_PUBLIC_MEMORY_VERSE_SPREADSHEET_ID') ?? getenv('MEMORY_VERSE_SPREADSHEET_ID');
$verseApiKey = $_ENV['NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY'] ?? $_ENV['GOOGLE_SHEETS_API_KEY'] ?? getenv('NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY') ?? getenv('GOOGLE_SHEETS_API_KEY');

if ($verseSheetId && $verseSheetId !== 'your_spreadsheet_id_here' && $verseApiKey && $verseApiKey !== 'your_api_key_here') {
    $url = "https://sheets.googleapis.com/v4/spreadsheets/{$verseSheetId}/values/Verses!A2:E?key={$verseApiKey}";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Accept: application/json"]);
    $response = curl_exec($ch);
    curl_close($ch);
    
    $data = json_decode($response, true);
    
    if (isset($data['values'])) {
    $rows = $data['values'] ?? [];
    
    $istOffset = 330 * 60;
    $todayTime = strtotime(gmdate("Y-m-d", time() + $istOffset));
    
    $daily = null; $weekly = null; $monthly = null;
    
    // Sort newest first
    usort($rows, function($a, $b) { return strtotime($b[1] ?? 0) - strtotime($a[1] ?? 0); });
    
    foreach ($rows as $row) {
        $rowTime = strtotime($row[1] ?? '');
        if ($rowTime === false || $rowTime > $todayTime) continue;
        
        $type = strtolower($row[2] ?? '');
        $v = ["type" => $row[2] ?? "", "reference" => $row[3] ?? "", "scripture" => $row[4] ?? ""];
        
        if ($type === 'daily' && !$daily) $daily = $v;
        if ($type === 'weekly' && !$weekly) $weekly = $v;
        if ($type === 'monthly' && !$monthly) $monthly = $v;
        if ($daily && $weekly && $monthly) break;
    }
    
    if ($daily || $weekly || $monthly) {
        $versesText = "MEMORY VERSES:\n";
        if ($daily) $versesText .= "Daily: {$daily['reference']} - {$daily['scripture']}\n";
        if ($weekly) $versesText .= "Weekly: {$weekly['reference']} - {$weekly['scripture']}\n";
        if ($monthly) $versesText .= "Monthly: {$monthly['reference']} - {$monthly['scripture']}\n";
        
        $stmt = $pdo->prepare("INSERT INTO chatbot_dynamic_knowledge (knowledge_type, content) VALUES ('verses', ?) ON DUPLICATE KEY UPDATE content = VALUES(content)");
        if ($stmt->execute([$versesText])) {
            $updatedCount++;
            $statusReport['Verses'] = 'Success';
        } else {
            $statusReport['Verses'] = 'Failed to insert DB';
        }
        }
    } else {
        $statusReport['Verses'] = 'Failed to find verses data (No values array)';
    }
} else {
    $statusReport['Verses'] = 'Missing Google Sheets API Key or Spreadsheet ID';
}

// 2. Direct Fetch: Testimonies
$testimonySheetId = $_ENV['NEXT_PUBLIC_TESTIMONIES_SHEET_ID'] ?? $_ENV['TESTIMONIES_SHEET_ID'] ?? getenv('NEXT_PUBLIC_TESTIMONIES_SHEET_ID') ?? getenv('TESTIMONIES_SHEET_ID');
if ($googleToken && $testimonySheetId) {
    $url = "https://sheets.googleapis.com/v4/spreadsheets/{$testimonySheetId}/values/Sheet1!A2:C";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $googleToken", "Accept: application/json"]);
    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);
    $rows = $data['values'] ?? [];
    $rows = array_reverse($rows); // Latest first
    
    if (count($rows) > 0) {
        $testimonyText = "TESTIMONIES:\n";
        foreach (array_slice($rows, 0, 3) as $row) { // Take top 3
            if (count($row) >= 3) {
                $title = $row[1];
                $body = substr($row[2], 0, 300) . "...";
                $testimonyText .= "Testimony: {$title} - {$body}\n";
            }
        }
        $stmt = $pdo->prepare("INSERT INTO chatbot_dynamic_knowledge (knowledge_type, content) VALUES ('testimonies', ?) ON DUPLICATE KEY UPDATE content = VALUES(content)");
        if ($stmt->execute([$testimonyText])) {
            $updatedCount++;
            $statusReport['Testimonies'] = 'Success';
        } else {
            $statusReport['Testimonies'] = 'Failed to insert DB';
        }
    } else {
        $statusReport['Testimonies'] = 'Failed to find testimonies data';
    }
} else {
    $statusReport['Testimonies'] = 'Failed Google Auth or Missing Sheet ID';
}

// 3. Direct Fetch: YouTube API
$youtubeApiKey = $_ENV['NEXT_PUBLIC_YOUTUBE_API_KEY'] ?? $_ENV['YOUTUBE_API_KEY'] ?? getenv('NEXT_PUBLIC_YOUTUBE_API_KEY') ?? getenv('YOUTUBE_API_KEY');
if ($youtubeApiKey && $youtubeApiKey !== 'PASTE_YOUR_YOUTUBE_API_KEY_HERE') {
    $playlists = [
        ['title' => 'Sermon', 'id' => 'PLjYGidLI9l0BHAPX_OifAMN8SbslwjP2a'],
        ['title' => 'Prato Jyoti', 'id' => 'PLjYGidLI9l0A7siLS3N37SwexXXCY6ORj'],
        ['title' => 'Santi ro Barta', 'id' => 'PLjYGidLI9l0CfRcarD9FesVBbh75To9XS']
    ];
    
    $youtubeText = "LATEST YOUTUBE VIDEOS:\n";
    $foundVideos = false;
    
    foreach ($playlists as $pl) {
        $url = "https://www.googleapis.com/youtube/v3/playlistItems?" . http_build_query([
            'part' => 'snippet,contentDetails',
            'playlistId' => $pl['id'],
            'maxResults' => 1,
            'key' => $youtubeApiKey
        ]);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);
        
        $data = json_decode($response, true);
        if (isset($data['items']) && count($data['items']) > 0) {
            $item = $data['items'][0];
            $title = $item['snippet']['title'] ?? '';
            $date = date('Y-m-d', strtotime($item['snippet']['publishedAt'] ?? 'now'));
            
            if ($title && $title !== 'Private video' && $title !== 'Deleted video') {
                $youtubeText .= "{$pl['title']}: {$title} (Published: {$date})\n";
                $foundVideos = true;
            }
        }
    }
    
    if ($foundVideos) {
        $stmt = $pdo->prepare("INSERT INTO chatbot_dynamic_knowledge (knowledge_type, content) VALUES ('youtube', ?) ON DUPLICATE KEY UPDATE content = VALUES(content)");
        if ($stmt->execute([$youtubeText])) {
            $updatedCount++;
            $statusReport['YouTube'] = 'Success';
        } else {
            $statusReport['YouTube'] = 'Failed to insert DB';
        }
    } else {
        $statusReport['YouTube'] = 'Failed to find videos via API';
    }
} else {
    $statusReport['YouTube'] = 'Missing YouTube API Key';
}

// 4. Sync Static Knowledge
require_once __DIR__ . '/sync_knowledge.php';
try {
    $staticSynced = syncKnowledgeIfChanged($pdo);
    if ($staticSynced) {
        $updatedCount++;
        $statusReport['Static HTML'] = 'Success (Synced new changes)';
    } else {
        $statusReport['Static HTML'] = 'Success (No changes detected/Skipped)';
    }
} catch (Exception $e) {
    $statusReport['Static HTML'] = 'Failed (' . $e->getMessage() . ')';
}

echo "Cron job completed successfully. Updated $updatedCount data sources.<br><br>\n";
foreach ($statusReport as $key => $val) {
    echo "<b>{$key}:</b> {$val}<br>\n";
}
?>
