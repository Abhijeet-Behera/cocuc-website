<?php
// Database configuration
// Replace these with your actual Hostinger MySQL database details
define('DB_HOST', 'localhost'); // Usually localhost on Hostinger
define('DB_NAME', 'u841666234_churchdb');
define('DB_USER', 'u841666234_dbadmin');
define('DB_PASS', 'Cocuc@unionchurch#2026');

// Secret key for JWT Authentication (Change this to a random long string)
define('JWT_SECRET', 'k9$mP2vL8x#nY5qW!zR4cT7jB1hF6dG9');

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
