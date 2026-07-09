<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

/*
 * During local development this can remain "*".
 * In production, replace "*" with your real website origin.
 */
$allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://www.unionchurch.in',
];

$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (
    $requestOrigin !== '' &&
    in_array($requestOrigin, $allowedOrigins, true)
) {
    header(
        'Access-Control-Allow-Origin: ' .
        $requestOrigin
    );

    header('Vary: Origin');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function sendJson(
    int $statusCode,
    array $data
): never {
    http_response_code($statusCode);
    echo json_encode(
        $data,
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(405, [
        'success' => false,
        'error' => 'Method not allowed.'
    ]);
}

try {
    require_once __DIR__ . '/env_loader.php';
} catch (Throwable $exception) {
    error_log(
        'Environment loading failed: ' .
        $exception->getMessage()
    );

    sendJson(500, [
        'success' => false,
        'error' =>
            'Donation submission is temporarily unavailable.'
    ]);
}

$webhookUrl = trim(
    (string) getenv('GOOGLE_SHEET_WEBHOOK_URL')
);

$webhookSecret = trim(
    (string) getenv('DONATION_WEBHOOK_SECRET')
);

if ($webhookUrl === '' || $webhookSecret === '') {
    error_log(
        'Donation webhook URL or secret is missing.'
    );

    sendJson(500, [
        'success' => false,
        'error' =>
            'Donation submission is temporarily unavailable.'
    ]);
}

$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody ?: '', true);

if (!is_array($data)) {
    sendJson(400, [
        'success' => false,
        'error' => 'Invalid request data.'
    ]);
}

$fullName = trim(
    (string) ($data['fullName'] ?? '')
);

$mobileNumber = trim(
    (string) ($data['mobileNumber'] ?? '')
);

$email = trim(
    (string) ($data['email'] ?? '')
);

$category = trim(
    (string) ($data['category'] ?? '')
);

$customCategory = trim(
    (string) ($data['customCategory'] ?? '')
);

$amountInput = trim(
    (string) ($data['amount'] ?? '')
);

$message = trim(
    (string) ($data['message'] ?? '')
);

$paymentMode = trim(
    (string) ($data['paymentMode'] ?? '')
);

$consent = filter_var(
    $data['consent'] ?? false,
    FILTER_VALIDATE_BOOLEAN
);

$errors = [];

if ($fullName === '') {
    $errors[] = 'Full Name is required.';
}



if ($category === '') {
    $errors[] = 'Offering Category is required.';
}

if (
    $category === 'Other' &&
    $customCategory === ''
) {
    $errors[] =
        'Custom Category is required when Other is selected.';
}

if (
    !preg_match(
        '/^\d{1,10}(\.\d{1,2})?$/',
        $amountInput
    ) ||
    (float) $amountInput <= 0
) {
    $errors[] =
        'Intended Amount must be greater than zero.';
}

if (
    $email !== '' &&
    !filter_var($email, FILTER_VALIDATE_EMAIL)
) {
    $errors[] = 'Email address is invalid.';
}

if (
    !in_array(
        $paymentMode,
        ['upi', 'neft_rtgs'],
        true
    )
) {
    $errors[] = 'Invalid payment mode.';
}

if (!$consent) {
    $errors[] =
        'Please confirm that the entered information is correct.';
}

if ($errors !== []) {
    sendJson(400, [
        'success' => false,
        'error' => implode(' ', $errors)
    ]);
}

function sanitizeCell(string $value): string
{
    $value = trim($value);

    // Prevent Google Sheets formula injection.
    if (preg_match('/^[=+\-@]/', $value)) {
        return "'" . $value;
    }

    return $value;
}

try {
    $referenceSuffix = strtoupper(
        bin2hex(random_bytes(3))
    );
} catch (Throwable $exception) {
    $referenceSuffix = strtoupper(
        substr(uniqid('', true), -6)
    );
}

$submissionReference =
    'DON-' .
    date('Ymd') .
    '-' .
    $referenceSuffix;

$payloadData = [
    'secret' => $webhookSecret,
    'submissionReference' =>
        $submissionReference,
    'submittedAt' =>
        date('Y-m-d H:i:s'),
    'fullName' =>
        sanitizeCell($fullName),
    'mobileNumber' =>
        sanitizeCell($mobileNumber),
    'email' =>
        sanitizeCell($email),
    'category' =>
        sanitizeCell($category),
    'customCategory' =>
        sanitizeCell($customCategory),
    'amount' =>
        number_format(
            (float) $amountInput,
            2,
            '.',
            ''
        ),
    'message' =>
        sanitizeCell($message),
    'paymentMode' =>
        $paymentMode,
    'status' =>
        'DETAILS_SUBMITTED'
];

$payload = json_encode(
    $payloadData,
    JSON_UNESCAPED_UNICODE
);

if ($payload === false) {
    sendJson(500, [
        'success' => false,
        'error' =>
            'Unable to prepare donation details.'
    ]);
}

if (!function_exists('curl_init')) {
    error_log(
        'PHP cURL extension is unavailable.'
    );

    sendJson(500, [
        'success' => false,
        'error' =>
            'Donation submission is temporarily unavailable.'
    ]);
}

$curl = curl_init($webhookUrl);

curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json'
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 20
]);

$responseBody = curl_exec($curl);
$curlError = curl_error($curl);

$httpCode = curl_getinfo(
    $curl,
    CURLINFO_HTTP_CODE
);

curl_close($curl);

if (
    $responseBody === false ||
    $curlError !== ''
) {
    error_log(
        'Donation webhook cURL failure: ' .
        $curlError
    );

    sendJson(502, [
        'success' => false,
        'error' =>
            'Unable to submit your details at the moment. Please try again.'
    ]);
}

if ($httpCode < 200 || $httpCode >= 400) {
    error_log(
        'Donation webhook HTTP status: ' .
        $httpCode
    );

    sendJson(502, [
        'success' => false,
        'error' =>
            'Unable to submit your details at the moment. Please try again.'
    ]);
}

$googleResult = json_decode(
    (string) $responseBody,
    true
);

/*
 * Apps Script can return HTTP 200 even when its own
 * JSON result contains success:false.
 */
if (
    !is_array($googleResult) ||
    empty($googleResult['success'])
) {
    error_log(
        'Donation webhook rejected request: ' .
        substr((string) $responseBody, 0, 500)
    );

    sendJson(502, [
        'success' => false,
        'error' =>
            $googleResult['message'] ??
            'Google Sheet rejected the submission.'
    ]);
}

sendJson(200, [
    'success' => true,
    'submissionReference' =>
        $submissionReference,
    'message' =>
        'Your offering details have been submitted successfully.'
]);

