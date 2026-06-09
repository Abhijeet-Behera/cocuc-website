<?php
session_start();

header("Content-Type: text/html; charset=UTF-8");

$envPath = __DIR__ . '/.env';

function updateEnvValue($path, $key, $value)
{
    if (!file_exists($path)) {
        return false;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES);
    $found = false;
    $newLines = [];

    foreach ($lines as $line) {
        if (strpos(trim($line), $key . '=') === 0) {
            $newLines[] = $key . '=' . $value;
            $found = true;
        } else {
            $newLines[] = $line;
        }
    }

    if (!$found) {
        $newLines[] = $key . '=' . $value;
    }

    return file_put_contents($path, implode(PHP_EOL, $newLines) . PHP_EOL) !== false;
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
            'message' => 'Invalid JSON from Google token endpoint.',
            'http_code' => $httpCode,
            'raw_response' => $response
        ];
    }

    if ($httpCode >= 400 || isset($data['error'])) {
        return [
            'error' => true,
            'message' => $data['error_description'] ?? $data['error'] ?? 'Google OAuth error.',
            'http_code' => $httpCode,
            'response' => $data
        ];
    }

    return $data;
}

require_once __DIR__ . '/env.php';

$googleClientId = getenv('GOOGLE_CLIENT_ID');
$googleClientSecret = getenv('GOOGLE_CLIENT_SECRET');
$googleRedirectUri = getenv('GOOGLE_REDIRECT_URI');

if (
    empty($googleClientId) ||
    empty($googleClientSecret) ||
    empty($googleRedirectUri) ||
    $googleClientId === 'your_google_client_id_here'
) {
    die('Google OAuth credentials missing in .env file.');
}

if (isset($_GET['error'])) {
    die('Google OAuth error: ' . htmlspecialchars($_GET['error']));
}

if (empty($_GET['code'])) {
    die('Authorization code missing.');
}

if (
    empty($_GET['state']) ||
    empty($_SESSION['youtube_oauth_state']) ||
    $_GET['state'] !== $_SESSION['youtube_oauth_state']
) {
    die('Invalid OAuth state. Possible CSRF protection triggered.');
}

unset($_SESSION['youtube_oauth_state']);

$tokenResponse = postRequest('https://oauth2.googleapis.com/token', [
    'code' => $_GET['code'],
    'client_id' => trim($googleClientId),
    'client_secret' => trim($googleClientSecret),
    'redirect_uri' => trim($googleRedirectUri),
    'grant_type' => 'authorization_code'
]);

if (isset($tokenResponse['error'])) {
    echo '<h2>OAuth Failed</h2>';
    echo '<pre>' . htmlspecialchars(json_encode($tokenResponse, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)) . '</pre>';
    exit;
}

if (empty($tokenResponse['refresh_token'])) {
    echo '<h2>No refresh token received</h2>';
    echo '<p>This usually happens if permission was already granted earlier.</p>';
    echo '<p>Please open youtube-oauth-start.php again and approve permission.</p>';
    echo '<p><a href="youtube-oauth-start.php">Try OAuth again</a></p>';
    echo '<pre>' . htmlspecialchars(json_encode($tokenResponse, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)) . '</pre>';
    exit;
}

$refreshToken = $tokenResponse['refresh_token'];
$saved = updateEnvValue($envPath, 'YOUTUBE_REFRESH_TOKEN', $refreshToken);

echo '<h2>YouTube OAuth Connected Successfully</h2>';

if ($saved) {
    echo '<p>Refresh token has been saved into backend/.env successfully.</p>';
} else {
    echo '<p>Could not automatically save refresh token. Copy this manually into backend/.env:</p>';
    echo '<pre>YOUTUBE_REFRESH_TOKEN=' . htmlspecialchars($refreshToken) . '</pre>';
}

echo '<p>Now test your upcoming API:</p>';
echo '<p><a href="upcoming.php?debug=1">Open upcoming.php?debug=1</a></p>';
?>