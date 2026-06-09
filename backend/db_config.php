<?php
require_once __DIR__ . '/env.php';

// Database configuration loaded from .env
define('DB_HOST', getenv('DB_HOST') ?: 'localhost'); 
define('DB_NAME', getenv('DB_NAME') ?: '');
define('DB_USER', getenv('DB_USER') ?: '');
define('DB_PASS', getenv('DB_PASS') ?: '');

// Secret key for JWT Authentication
define('JWT_SECRET', getenv('JWT_SECRET') ?: '');

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
?>
