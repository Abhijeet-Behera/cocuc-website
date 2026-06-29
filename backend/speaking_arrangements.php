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
    $stmt = $pdo->query("SELECT speaking_arrangements.*, users.full_name as author_name FROM speaking_arrangements JOIN users ON speaking_arrangements.author_id = users.id ORDER BY event_date DESC, created_at DESC");
    $arrangements = $stmt->fetchAll();
    echo json_encode($arrangements);
} elseif ($method === 'DELETE') {
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }
    $payload = verifyJWT($token, JWT_SECRET);
    if (!$payload || ($payload['designation'] !== 'Secretary' && $payload['designation'] !== 'Developer')) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden: Only Secretary or Developers can delete arrangements"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing arrangement ID"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM speaking_arrangements WHERE id = ?");
    $stmt->execute([$id]);
    
    if ($payload['designation'] === 'Developer') {
        logDeveloperAction($pdo, $payload['email'], 'DELETE', 'speaking_arrangements', "Deleted arrangement ID {$id}");
    }
    
    echo json_encode(["message" => "Arrangement deleted successfully"]);

} elseif ($method === 'POST') {
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $payload = verifyJWT($token, JWT_SECRET);
    if (!$payload || ($payload['designation'] !== 'Secretary' && $payload['designation'] !== 'Developer')) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden: Only Secretary or Developers can post arrangements"]);
        exit;
    }

    $id = $_POST['id'] ?? null;
    $sub_section = $_POST['sub_section'] ?? '';
    $details = $_POST['details'] ?? '';
    $event_date = $_POST['event_date'] ?? '';

    $has_attachment = (isset($_FILES['attachment1']) && $_FILES['attachment1']['error'] === UPLOAD_ERR_OK) ||
                      (isset($_FILES['attachment2']) && $_FILES['attachment2']['error'] === UPLOAD_ERR_OK) ||
                      (isset($_FILES['attachment3']) && $_FILES['attachment3']['error'] === UPLOAD_ERR_OK);

    if (!$sub_section || !$event_date) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    if (!$details && !$has_attachment) {
        http_response_code(400);
        echo json_encode(["error" => "Please provide either details or an attachment"]);
        exit;
    }

    $target_dir = "../uploads/speaking_arrangements/";
    if (!is_dir($target_dir)) @mkdir($target_dir, 0777, true);

    function handleUpload($fileInputName, $targetDir) {
        if (isset($_FILES[$fileInputName]) && $_FILES[$fileInputName]['error'] === UPLOAD_ERR_OK) {
            $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.-]/", "_", basename($_FILES[$fileInputName]["name"]));
            $target_file = $targetDir . $fileName;
            if (move_uploaded_file($_FILES[$fileInputName]["tmp_name"], $target_file)) {
                return "/uploads/speaking_arrangements/" . $fileName;
            }
        }
        return null;
    }

    try {
        if ($id) {
            $stmt = $pdo->prepare("SELECT attachment1_path, attachment2_path, attachment3_path FROM speaking_arrangements WHERE id = ?");
            $stmt->execute([$id]);
            $existing = $stmt->fetch();
            if (!$existing) {
                http_response_code(404);
                echo json_encode(["error" => "Arrangement not found"]);
                exit;
            }

            $attachment1_path = handleUpload('attachment1', $target_dir) ?? $existing['attachment1_path'];
            $attachment2_path = handleUpload('attachment2', $target_dir) ?? $existing['attachment2_path'];
            $attachment3_path = handleUpload('attachment3', $target_dir) ?? $existing['attachment3_path'];

            $stmt = $pdo->prepare("UPDATE speaking_arrangements SET sub_section = ?, details = ?, event_date = ?, attachment1_path = ?, attachment2_path = ?, attachment3_path = ? WHERE id = ?");
            $stmt->execute([$sub_section, $details, $event_date, $attachment1_path, $attachment2_path, $attachment3_path, $id]);
            
            if ($payload['designation'] === 'Developer') {
                logDeveloperAction($pdo, $payload['email'], 'UPDATE', 'speaking_arrangements', "Updated arrangement ID {$id}");
            }
            
            echo json_encode(["message" => "Arrangement updated successfully"]);
        } else {
            $attachment1_path = handleUpload('attachment1', $target_dir);
            $attachment2_path = handleUpload('attachment2', $target_dir);
            $attachment3_path = handleUpload('attachment3', $target_dir);

            $stmt = $pdo->prepare("INSERT INTO speaking_arrangements (sub_section, details, event_date, attachment1_path, attachment2_path, attachment3_path, author_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$sub_section, $details, $event_date, $attachment1_path, $attachment2_path, $attachment3_path, $payload['id']]);
            
            $new_id = $pdo->lastInsertId();
            if ($payload['designation'] === 'Developer') {
                logDeveloperAction($pdo, $payload['email'], 'INSERT', 'speaking_arrangements', "Created new arrangement ID {$new_id}");
            }
            
            echo json_encode(["message" => "Arrangement created successfully", "id" => $new_id]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}
?>
