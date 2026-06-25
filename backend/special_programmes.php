<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_config.php';
require_once 'jwt_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT special_programmes.*, users.full_name as author_name FROM special_programmes JOIN users ON special_programmes.author_id = users.id ORDER BY upload_date DESC, created_at DESC");
    $programmes = $stmt->fetchAll();
    echo json_encode($programmes);
} elseif ($method === 'DELETE') {
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }
    $payload = verifyJWT($token, JWT_SECRET);
    if (!$payload || $payload['designation'] !== 'Secretary') {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden: Only Secretary can delete programmes"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing programme ID"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM special_programmes WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Programme deleted successfully"]);

} elseif ($method === 'POST') {
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $payload = verifyJWT($token, JWT_SECRET);
    if (!$payload || $payload['designation'] !== 'Secretary') {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden: Only Secretary can post programmes"]);
        exit;
    }

    $id = $_POST['id'] ?? null;
    $upload_date = $_POST['upload_date'] ?? '';
    $title = $_POST['title'] ?? '';
    $wing = $_POST['wing'] ?? '';
    $custom_wing = $_POST['custom_wing'] ?? '';
    $event_from = !empty($_POST['event_from']) ? $_POST['event_from'] : null;
    $event_to = !empty($_POST['event_to']) ? $_POST['event_to'] : null;
    $duration = $_POST['duration'] ?? null;
    $details = $_POST['details'] ?? null;

    $has_attachment = isset($_FILES['document']) && $_FILES['document']['error'] === UPLOAD_ERR_OK;
    if (!$upload_date || !$wing) {
        http_response_code(400);
        echo json_encode(["error" => "Missing upload date or wing"]);
        exit;
    }
    if (!$title && !$has_attachment) {
        http_response_code(400);
        echo json_encode(["error" => "Please provide either a title or an attachment"]);
        exit;
    }

    $target_dir = "../uploads/special_programmes/";
    if (!is_dir($target_dir)) @mkdir($target_dir, 0777, true);

    function handleUpload($fileInputName, $targetDir) {
        if (isset($_FILES[$fileInputName]) && $_FILES[$fileInputName]['error'] === UPLOAD_ERR_OK) {
            $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.-]/", "_", basename($_FILES[$fileInputName]["name"]));
            $target_file = $targetDir . $fileName;
            if (move_uploaded_file($_FILES[$fileInputName]["tmp_name"], $target_file)) {
                return "/uploads/special_programmes/" . $fileName;
            }
        }
        return null;
    }

    try {
        if ($id) {
            $stmt = $pdo->prepare("SELECT document_path FROM special_programmes WHERE id = ?");
            $stmt->execute([$id]);
            $existing = $stmt->fetch();
            if (!$existing) {
                http_response_code(404);
                echo json_encode(["error" => "Programme not found"]);
                exit;
            }

            $document_path = handleUpload('document', $target_dir) ?? $existing['document_path'];

            $stmt = $pdo->prepare("UPDATE special_programmes SET upload_date = ?, title = ?, wing = ?, custom_wing = ?, event_from = ?, event_to = ?, duration = ?, details = ?, document_path = ? WHERE id = ?");
            $stmt->execute([$upload_date, $title, $wing, $custom_wing, $event_from, $event_to, $duration, $details, $document_path, $id]);
            
            echo json_encode(["message" => "Programme updated successfully"]);
        } else {
            $document_path = handleUpload('document', $target_dir);

            $stmt = $pdo->prepare("INSERT INTO special_programmes (upload_date, title, wing, custom_wing, event_from, event_to, duration, details, document_path, author_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$upload_date, $title, $wing, $custom_wing, $event_from, $event_to, $duration, $details, $document_path, $payload['id']]);
            
            echo json_encode(["message" => "Programme created successfully", "id" => $pdo->lastInsertId()]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}
?>
