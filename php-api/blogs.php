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
    // Anyone can read blogs
    $stmt = $pdo->query("SELECT blogs.*, users.full_name as author_name, users.designation as author_role FROM blogs JOIN users ON blogs.author_id = users.id ORDER BY created_at DESC");
    $blogs = $stmt->fetchAll();
    echo json_encode($blogs);
} elseif ($method === 'POST') {
    // Only Pastors can post blogs
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $payload = verifyJWT($token, JWT_SECRET);
    if (!$payload || $payload['designation'] !== 'Pastor') {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden: Only Pastors can post blogs"]);
        exit;
    }

    // Handle file upload for thumbnail
    $title = $_POST['title'] ?? '';
    $content = $_POST['content'] ?? '';
    $thumbnail_url = null;

    if (!$title || !$content) {
        $data = json_decode(file_get_contents("php://input"), true);
        $title = $title ?: ($data['title'] ?? '');
        $content = $content ?: ($data['content'] ?? '');
        $thumbnail_url = $data['thumbnail_url'] ?? '';
    }

    // If a file is uploaded directly instead of a URL
    if (isset($_FILES['thumbnail'])) {
        $target_dir = "../uploads/blogs/";
        if (!is_dir($target_dir)) mkdir($target_dir, 0777, true);
        $fileName = time() . '_' . basename($_FILES["thumbnail"]["name"]);
        $target_file = $target_dir . $fileName;
        if (move_uploaded_file($_FILES["thumbnail"]["tmp_name"], $target_file)) {
            $thumbnail_url = "/uploads/blogs/" . $fileName;
        }
    }

    if (!$title || !$content) {
        http_response_code(400);
        echo json_encode(["error" => "Missing title or content"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO blogs (title, content, thumbnail_path, author_id) VALUES (?, ?, ?, ?)");
    $stmt->execute([$title, $content, $thumbnail_url, $payload['id']]);
    
    echo json_encode(["message" => "Blog created successfully", "id" => $pdo->lastInsertId()]);
}
?>
