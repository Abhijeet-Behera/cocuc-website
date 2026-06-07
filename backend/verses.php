<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

// Parse .env file if it exists
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}

$apiKey = getenv('GOOGLE_SHEETS_API_KEY');
$spreadsheetId = getenv('MEMORY_VERSE_SPREADSHEET_ID');

if (!$apiKey || !$spreadsheetId || $apiKey === 'your_api_key_here') {
    echo json_encode([
        "daily" => null,
        "weekly" => null,
        "monthly" => null,
        "error" => "Google Sheets keys not configured."
    ]);
    exit();
}

$range = 'Verses!A2:E';
$url = "https://sheets.googleapis.com/v4/spreadsheets/{$spreadsheetId}/values/{$range}?key={$apiKey}";

// Fetch the data from Google Sheets
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Uncomment if SSL issues locally
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 || !$response) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch verses from Google Sheets."]);
    exit();
}

$data = json_decode($response, true);
$rows = isset($data['values']) ? $data['values'] : [];

// Get today's date in IST
$istOffset = 330 * 60; // 5 hours 30 mins in seconds
$todayStr = gmdate("Y-m-d", time() + $istOffset);

// Filter rows before or equal to today
$pastOrTodayRows = array_filter($rows, function($row) use ($todayStr) {
    return isset($row[1]) && $row[1] <= $todayStr;
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
