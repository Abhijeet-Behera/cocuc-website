<?php
session_start();

header("Content-Type: text/html; charset=UTF-8");

$envPath = __DIR__ . '/.env';

if (!file_exists($envPath)) {
    die('Environment file not found.');
}

require_once __DIR__ . '/env_loader.php';
$env = loadEnv($envPath);

if (
    !$env ||
    empty($env['GOOGLE_CLIENT_ID']) ||
    empty($env['GOOGLE_REDIRECT_URI'])
) {
    die('Google OAuth Client ID or Redirect URI missing in .env file.');
}

$clientId = trim($env['GOOGLE_CLIENT_ID']);
$redirectUri = trim($env['GOOGLE_REDIRECT_URI']);

$scope = 'https://www.googleapis.com/auth/youtube.readonly';

$state = bin2hex(random_bytes(16));
$_SESSION['youtube_oauth_state'] = $state;

$params = [
    'client_id' => $clientId,
    'redirect_uri' => $redirectUri,
    'response_type' => 'code',
    'scope' => $scope,
    'access_type' => 'offline',
    'prompt' => 'consent',
    'include_granted_scopes' => 'true',
    'state' => $state
];

$authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params, '', '&');

header('Location: ' . $authUrl);
exit;
?>