<?php
// Load environment variables from .env
$envPath = __DIR__ . '/.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) continue;
        
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $name = trim($parts[0]);
            $value = trim($parts[1]);
            // Remove surrounding quotes if any
            if (preg_match('/^"(.*)"$/', $value, $matches) || preg_match("/^'(.*)'$/", $value, $matches)) {
                $value = $matches[1];
            }
            if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                putenv(sprintf('%s=%s', $name, $value));
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }
    }
}

// Database configuration
define('DB_HOST', $_ENV['DB_HOST'] ?? 'localhost');
define('DB_NAME', $_ENV['DB_NAME'] ?? '');
define('DB_USER', $_ENV['DB_USER'] ?? '');
define('DB_PASS', $_ENV['DB_PASS'] ?? '');

// Secret key for JWT Authentication
define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? '');

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    // In production, do not echo the raw error. 
    // We output a generic JSON error so the frontend doesn't break parsing.
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed."]);
    exit;
}

function getClientIP() {
    return $_SERVER['HTTP_CLIENT_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
}

function logDeveloperAction($pdo, $email, $action_type, $target_table, $details) {
    $ip = getClientIP();
    $stmt = $pdo->prepare("INSERT INTO developer_audit_logs (email, action_type, target_table, details, ip_address) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$email, $action_type, $target_table, $details, $ip]);
}

// Auto-cleanup: Delete logs older than 30 days
try {
    $pdo->query("DELETE FROM developer_login_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)");
    $pdo->query("DELETE FROM developer_audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)");
} catch (PDOException $e) {
    // Ignore error if tables don't exist yet
}
?>
