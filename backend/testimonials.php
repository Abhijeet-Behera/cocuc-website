<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'env.php';

// Load Sheet ID exclusively from environment
$SPREADSHEET_ID = $_ENV['TESTIMONIES_SHEET_ID'] ?? $_SERVER['TESTIMONIES_SHEET_ID'] ?? getenv('TESTIMONIES_SHEET_ID');
$CREDENTIALS_PATH = __DIR__ . '/google-credentials.json';

if (!$SPREADSHEET_ID) {
    http_response_code(500);
    echo json_encode(["error" => "TESTIMONIES_SHEET_ID is not configured in .env"]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch from Google Sheets
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

    $url = "https://sheets.googleapis.com/v4/spreadsheets/" . $SPREADSHEET_ID . "/values/Sheet1!A2:C";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $token",
        "Accept: application/json"
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch from Google Sheets", "details" => json_decode($response)]);
        exit;
    }

    $data = json_decode($response, true);
    $rows = $data['values'] ?? [];
    
    $testimonies = [];
    foreach ($rows as $row) {
        // Date, Title, Body
        if (count($row) >= 3) {
            $testimonies[] = [
                'date' => $row[0],
                'title' => $row[1],
                'body' => $row[2]
            ];
        }
    }
    
    // Reverse to show latest first if date is appended at the bottom
    $testimonies = array_reverse($testimonies);
    echo json_encode($testimonies);

} elseif ($method === 'POST') {
    // Submit a testimony
    $data = json_decode(file_get_contents("php://input"), true) ?: $_POST;
    
    $title = $data['title'] ?? '';
    $body = $data['body'] ?? '';
    $consent1 = $data['consent1'] ?? false;
    $consent2 = $data['consent2'] ?? false;
    
    if (!$title || !$body || !$consent1 || !$consent2) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields or consent"]);
        exit;
    }

    // Verify reCAPTCHA
    $recaptchaToken = $data['recaptcha_token'] ?? '';
    if (!$recaptchaToken) {
        http_response_code(400);
        echo json_encode(["error" => "Missing reCAPTCHA token"]);
        exit;
    }
    $secretKey = $_ENV['RECAPTCHA_SECRET_KEY'] ?? '';
    $verifyResponse = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$recaptchaToken}");
    $responseData = json_decode($verifyResponse);
    if (!$responseData->success) {
        http_response_code(403);
        echo json_encode(["error" => "reCAPTCHA verification failed. Please try again."]);
        exit;
    }
    
    // Check word count
    $wordCount = str_word_count(strip_tags($body));
    if ($wordCount > 500) {
        http_response_code(400);
        echo json_encode(["error" => "Testimony body exceeds the 500 word limit."]);
        exit;
    }

    $to = 'pastor@unionchurch.in';
    $subject = '[Testimony] ' . $title;
    $message = "A new testimony has been submitted.\n\n" .
               "Title: $title\n\n" .
               "Body:\n$body\n\n" .
               "The user has agreed to the terms (Proverbs 19:5 and Union Church publish consent).";
               
    $headers = "From: noreply@unionchurch.in\r\n" .
               "Reply-To: noreply@unionchurch.in\r\n" .
               "X-Mailer: PHP/" . phpversion();

    if (@mail($to, $subject, $message, $headers)) {
        echo json_encode(["message" => "Testimony submitted successfully."]);
    } else {
        // Return 200 for local testing so the UI flow doesn't break, but notify
        echo json_encode(["message" => "Testimony submitted (Local mode: Email not actually sent. Will work on Hostinger)."]);
    }
}

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
?>
