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
    $stmt = $pdo->query("SELECT announcements.*, users.full_name as author_name, users.designation as author_role FROM announcements JOIN users ON announcements.author_id = users.id ORDER BY created_at DESC");
    $announcements = $stmt->fetchAll();
    echo json_encode($announcements);
} elseif ($method === 'POST') {
    // Only Secretary can post announcements
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $payload = verifyJWT($token, JWT_SECRET);
    if (!$payload || $payload['designation'] !== 'Secretary') {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden: Only Secretary can post announcements"]);
        exit;
    }

    $title = $_POST['title'] ?? '';
    $content = $_POST['content'] ?? '';
    $media_type = $_POST['media_type'] ?? 'none';
    $media_path = null;

    if (isset($_FILES['media'])) {
        $target_dir = "../uploads/announcements/";
        if (!is_dir($target_dir)) mkdir($target_dir, 0777, true);
        
        $fileName = time() . '_' . basename($_FILES["media"]["name"]);
        $target_file = $target_dir . $fileName;
        
        if (move_uploaded_file($_FILES["media"]["tmp_name"], $target_file)) {
            $media_path = "/uploads/announcements/" . $fileName;
            // Basic detection if it's image or video
            $ext = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
            if (in_array($ext, ['mp4', 'webm', 'ogg', 'mov'])) {
                $media_type = 'video';
            } elseif (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                $media_type = 'image';
            }
        }
    } else {
        // Fallback to JSON payload if no file is uploaded
        $data = json_decode(file_get_contents("php://input"), true);
        $title = $title ?: ($data['title'] ?? '');
        $content = $content ?: ($data['content'] ?? '');
        $media_type = $data['media_type'] ?? 'none';
        $media_path = $data['media_path'] ?? null;
    }

    $stmt = $pdo->prepare("INSERT INTO announcements (title, content, media_type, media_path, author_id) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$title, $content, $media_type, $media_path, $payload['id']]);
    
    echo json_encode(["message" => "Announcement created successfully", "id" => $pdo->lastInsertId()]);
}
?>
