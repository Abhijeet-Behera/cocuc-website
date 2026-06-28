<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

// Parse .env file if it exists
require_once __DIR__ . '/env.php';

$spreadsheetId = $_ENV['MEMORY_VERSE_SPREADSHEET_ID'] ?? $_SERVER['MEMORY_VERSE_SPREADSHEET_ID'] ?? getenv('MEMORY_VERSE_SPREADSHEET_ID');
$CREDENTIALS_PATH = __DIR__ . '/google-credentials.json';

if (!$spreadsheetId || $spreadsheetId === 'your_spreadsheet_id_here') {
    echo json_encode([
        "daily" => null,
        "weekly" => null,
        "monthly" => null,
        "error" => "Google Sheets keys not configured."
    ]);
    exit();
}

if (!file_exists($CREDENTIALS_PATH)) {
    http_response_code(500);
    echo json_encode(["error" => "Google credentials not found"]);
    exit;
}

$token = getGoogleAccessToken($CREDENTIALS_PATH);
if (!$token) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to get Google Access Token"]);
    exit;
}

$range = 'Verses!A2:E';
$url = "https://sheets.googleapis.com/v4/spreadsheets/{$spreadsheetId}/values/{$range}";

// Fetch the data from Google Sheets
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Accept: application/json"
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 || !$response) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch verses from Google Sheets.", "details" => json_decode($response)]);
    exit();
}

$data = json_decode($response, true);
$rows = isset($data['values']) ? $data['values'] : [];

// Helper function to get Google Access Token using Service Account JSON without libraries
function getGoogleAccessToken($credentialsPath) {
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
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion' => $jwt
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    $tokenData = json_decode($response, true);
    return $tokenData['access_token'] ?? null;
}

// Get today's date in IST
$istOffset = 330 * 60; // 5 hours 30 mins in seconds
$todayStr = gmdate("Y-m-d", time() + $istOffset);

$todayTime = strtotime($todayStr);
$pastOrTodayRows = array_filter($rows, function($row) use ($todayTime) {
    if (!isset($row[1])) return false;
    $rowTime = strtotime($row[1]);
    return $rowTime !== false && $rowTime <= $todayTime;
});

// Sort descending by date (newest first)
usort($pastOrTodayRows, function($a, $b) {
    return strtotime($b[1]) - strtotime($a[1]);
});

$daily = null;
$weekly = null;
$monthly = null;

foreach ($pastOrTodayRows as $row) {
    $type = strtolower(isset($row[2]) ? $row[2] : "");
    $verseObj = [
        "date" => isset($row[1]) ? $row[1] : "",
        "type" => isset($row[2]) ? $row[2] : "",
        "reference" => isset($row[3]) ? $row[3] : "",
        "scripture" => isset($row[4]) ? $row[4] : ""
    ];

    if ($type === 'daily' && !$daily) $daily = $verseObj;
    if ($type === 'weekly' && !$weekly) $weekly = $verseObj;
    if ($type === 'monthly' && !$monthly) $monthly = $verseObj;

    if ($daily && $weekly && $monthly) break;
}

// Fallbacks
echo json_encode([
    "daily" => $daily ? $daily : ["type" => "Daily", "reference" => "Psalm 118:24", "scripture" => "This is the day that the LORD has made; let us rejoice and be glad in it."],
    "weekly" => $weekly ? $weekly : ["type" => "Weekly", "reference" => "Proverbs 3:5-6", "scripture" => "Trust in the LORD with all your heart, and do not lean on your own understanding."],
    "monthly" => $monthly ? $monthly : ["type" => "Monthly", "reference" => "Joshua 1:9", "scripture" => "Be strong and courageous. Do not be frightened, and do not be dismayed, for the LORD your God is with you wherever you go."]
]);
