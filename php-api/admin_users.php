<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_config.php';
require_once 'jwt_helper.php';

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$token = $matches[1];
$payload = verifyJWT($token, JWT_SECRET);

if (!$payload || $payload['designation'] !== 'Developer') {
    http_response_code(403);
    echo json_encode(["error" => "Forbidden: Only Developers can manage users"]);
    exit;
}

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'pending') {
    try {
        // Fetch all users whose status is 'pending'
        $stmt = $pdo->query("SELECT id, full_name, designation, email, mobile, created_at FROM users WHERE status = 'pending' ORDER BY created_at DESC");
        $users = $stmt->fetchAll();
        echo json_encode($users);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && ($action === 'approve' || $action === 'revoke')) {
    $data = json_decode(file_get_contents("php://input"), true);
    $userId = $data['user_id'] ?? null;

    if (!$userId) {
        http_response_code(400);
        echo json_encode(["error" => "User ID required"]);
        exit;
    }

    try {
        if ($action === 'approve') {
            $stmt = $pdo->prepare("UPDATE users SET status = 'approved' WHERE id = ?");
            $stmt->execute([$userId]);
            echo json_encode(["message" => "User approved successfully"]);
        } elseif ($action === 'revoke') {
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ? AND status = 'pending'");
            $stmt->execute([$userId]);
            echo json_encode(["message" => "User registration revoked/deleted"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["error" => "Invalid action"]);
}
?>
