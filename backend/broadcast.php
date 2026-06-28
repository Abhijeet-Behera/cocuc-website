<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_config.php';
require_once 'jwt_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT broadcasts.*, COALESCE(users.full_name, 'Developer') as author_name FROM broadcasts LEFT JOIN users ON broadcasts.author_id = users.id ORDER BY created_at DESC");
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

    // Disable foreign key checks to allow author_id = 999 (Developer)
    $pdo->query('SET FOREIGN_KEY_CHECKS = 0');
    $stmt = $pdo->prepare("INSERT INTO broadcasts (title, message, author_id) VALUES (?, ?, ?)");
    $stmt->execute([$title, $message, $payload['id']]);
    $new_id = $pdo->lastInsertId();
    $pdo->query('SET FOREIGN_KEY_CHECKS = 1');
    if ($payload['designation'] === 'Developer') {
        logDeveloperAction($pdo, $payload['email'], 'INSERT', 'broadcasts', "Created new broadcast ID {$new_id}");
    }
    
    echo json_encode(["message" => "Broadcast created successfully", "id" => $new_id]);
} elseif ($method === 'PUT') {
    $token = getBearerToken();
    if (!$token) { http_response_code(401); echo json_encode(["error" => "Unauthorized"]); exit; }
    $payload = verifyJWT($token, JWT_SECRET);
    if (!$payload || $payload['designation'] !== 'Developer') { http_response_code(403); echo json_encode(["error" => "Forbidden"]); exit; }

    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;
    $title = $data['title'] ?? '';
    $message = $data['message'] ?? '';

    if (!$id || !$title || !$message) {
        http_response_code(400);
        echo json_encode(["error" => "Missing id, title or message"]);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE broadcasts SET title = ?, message = ? WHERE id = ?");
    $stmt->execute([$title, $message, $id]);
    
    logDeveloperAction($pdo, $payload['email'], 'UPDATE', 'broadcasts', "Updated broadcast ID {$id}");
    echo json_encode(["message" => "Broadcast updated successfully"]);
} elseif ($method === 'DELETE') {
    $token = getBearerToken();
    if (!$token) { http_response_code(401); echo json_encode(["error" => "Unauthorized"]); exit; }
    $payload = verifyJWT($token, JWT_SECRET);
    if (!$payload || $payload['designation'] !== 'Developer') { http_response_code(403); echo json_encode(["error" => "Forbidden"]); exit; }

    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing id"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM broadcasts WHERE id = ?");
    $stmt->execute([$id]);
    
    logDeveloperAction($pdo, $payload['email'], 'DELETE', 'broadcasts', "Deleted broadcast ID {$id}");
    echo json_encode(["message" => "Broadcast deleted successfully"]);
}
?>
