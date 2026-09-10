<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

// Allowed CORS Origins
$allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://www.unionchurch.in',
    'https://unionchurch.in',
];

$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($requestOrigin !== '' && in_array($requestOrigin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $requestOrigin);
    header('Vary: Origin');
} else {
    // Permissive during development
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function sendResponse(int $status, array $data): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(405, [
        'success' => false,
        'error' => 'Method not allowed. Only POST submissions are accepted.'
    ]);
}

// Load environment variables if available
if (file_exists(__DIR__ . '/env.php')) {
    require_once __DIR__ . '/env.php';
}

require_once __DIR__ . '/services/PrayerStorageService.php';
require_once __DIR__ . '/services/PrayerMailService.php';

// Read JSON payload
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput ?: '', true);

if (!is_array($inputData)) {
    sendResponse(400, [
        'success' => false,
        'error' => 'Invalid request payload. Expected JSON.'
    ]);
}

// Extract and sanitize input fields
$name = trim(strip_tags((string)($inputData['name'] ?? '')));
$email = trim(filter_var((string)($inputData['email'] ?? ''), FILTER_SANITIZE_EMAIL));
$phone = trim(preg_replace('/[^\d\s+\-()]/', '', (string)($inputData['phone'] ?? '')));
$category = trim(strip_tags((string)($inputData['category'] ?? 'General Prayer')));
$zoneId = !empty($inputData['zone_id']) ? (int)$inputData['zone_id'] : null;
$locality = trim(strip_tags((string)($inputData['locality'] ?? '')));
$requestText = trim(strip_tags((string)($inputData['request'] ?? ($inputData['message'] ?? ''))));
$additionalInfo = trim(strip_tags((string)($inputData['additional_info'] ?? '')));

// Validation Rules
$errors = [];

if (strlen($name) < 2) {
    $errors[] = 'Please provide your full name (at least 2 characters).';
}

$hasValidEmail = !empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL);
$hasValidPhone = !empty($phone) && strlen(preg_replace('/[^\d]/', '', $phone)) >= 7;

if (!$hasValidEmail && !$hasValidPhone) {
    $errors[] = 'Please provide a valid email address or phone number.';
}

if (strlen($requestText) < 5) {
    $errors[] = 'Please describe your prayer request (at least 5 characters).';
}

if (!empty($errors)) {
    sendResponse(400, [
        'success' => false,
        'error' => implode(' ', $errors),
        'errors' => $errors
    ]);
}

try {
    $storage = new PrayerStorageService();
    $savedRecord = $storage->saveRequest([
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'category' => $category,
        'zone_id' => $zoneId,
        'locality' => $locality,
        'request' => $requestText,
        'additional_info' => $additionalInfo,
    ]);

    // Send individual bullet-point notification to church pastors
    $mailer = new PrayerMailService();
    $mailSent = $mailer->sendIndividualNotification($savedRecord);

    sendResponse(200, [
        'success' => true,
        'message' => 'Your prayer request has been submitted successfully to our intercessory team.',
        'id' => $savedRecord['id'] ?? null,
        'email_routed' => $mailSent
    ]);
} catch (Throwable $e) {
    // Log technical error securely without leaking to user
    error_log('Prayer request processing error: ' . $e->getMessage());

    sendResponse(500, [
        'success' => false,
        'error' => 'A temporary server error occurred while recording your prayer request. Please try again later.'
    ]);
}
