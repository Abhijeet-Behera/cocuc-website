<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

/**
 * Get Client IP Address safely from standard headers
 */
function getClientIp() {
    $headers = [
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_REAL_IP',
        'HTTP_CF_CONNECTING_IP',
        'REMOTE_ADDR'
    ];
    foreach ($headers as $header) {
        if (!empty($_SERVER[$header])) {
            $ips = explode(',', $_SERVER[$header]);
            return trim($ips[0]);
        }
    }
    return '127.0.0.1';
}

$storageFile = __DIR__ . '/registered_retreat_ips.json';

/**
 * Read registered IP list from JSON storage
 */
function getRegisteredIps($file) {
    if (!file_exists($file)) {
        return [];
    }
    $content = file_get_contents($file);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

/**
 * Save IP to JSON storage
 */
function saveRegisteredIp($file, $ip) {
    $ips = getRegisteredIps($file);
    if (!in_array($ip, $ips, true)) {
        $ips[] = $ip;
        file_put_contents($file, json_encode($ips, JSON_PRETTY_PRINT));
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$clientIp = getClientIp();

if ($method === 'GET') {
    $registeredIps = getRegisteredIps($storageFile);
    $isRegistered = in_array($clientIp, $registeredIps, true);

    header('Content-Type: application/json');
    echo json_encode([
        'registered' => $isRegistered,
        'showAd' => !$isRegistered,
        'ip' => $clientIp
    ]);
    exit(0);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';

    if ($action === 'register') {
        saveRegisteredIp($storageFile, $clientIp);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'registered' => true,
            'ip' => $clientIp
        ]);
        exit(0);
    } elseif ($action === 'reset') {
        $ips = getRegisteredIps($storageFile);
        $ips = array_values(array_filter($ips, function($ip) use ($clientIp) {
            return $ip !== $clientIp;
        }));
        file_put_contents($storageFile, json_encode($ips, JSON_PRETTY_PRINT));
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'registered' => false,
            'ip' => $clientIp
        ]);
        exit(0);
    }

    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'error' => 'Invalid action provided'
    ]);
    exit(0);
}

http_response_code(405);
header('Content-Type: application/json');
echo json_encode(['error' => 'Method not allowed']);
?>
