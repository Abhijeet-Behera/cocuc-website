<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_config.php';
require_once 'jwt_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT broadcasts.*, users.full_name as author_name FROM broadcasts JOIN users ON broadcasts.author_id = users.id ORDER BY created_at DESC");
    $broadcasts = $stmt->fetchAll();
    echo json_encode($broadcasts);
} elseif ($method === 'POST') {
    // Only Developers can post broadcasts
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $payload = verifyJWT($token, JWT_SECRET);
    if (!$payload || $payload['designation'] !== 'Developer') {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden: Only Developers can post broadcasts"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $title = $data['title'] ?? '';
    $message = $data['message'] ?? '';

    if (!$title || !$message) {
        http_response_code(400);
        echo json_encode(["error" => "Missing title or message"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO broadcasts (title, message, author_id) VALUES (?, ?, ?)");
    $stmt->execute([$title, $message, $payload['id']]);
    
    echo json_encode(["message" => "Broadcast created successfully", "id" => $pdo->lastInsertId()]);
}
?>
