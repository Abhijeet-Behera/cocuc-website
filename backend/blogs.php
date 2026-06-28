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

// FIFO Logic: Delete blogs older than 3 months automatically
try {
    $pdo->query("DELETE FROM blogs WHERE created_at < DATE_SUB(NOW(), INTERVAL 3 MONTH)");
} catch (PDOException $e) {
    // Ignore error if table doesn't exist yet
}

if ($method === 'GET') {
    // Anyone can read blogs
    $stmt = $pdo->query("SELECT blogs.*, users.full_name as author_name, users.designation as author_role FROM blogs JOIN users ON blogs.author_id = users.id ORDER BY created_at DESC");
    $blogs = $stmt->fetchAll();
    echo json_encode($blogs);

} elseif ($method === 'DELETE') {
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }
    $payload = verifyJWT($token, JWT_SECRET);
    if (!$payload || ($payload['designation'] !== 'Pastor' && $payload['designation'] !== 'Developer')) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden: Only Pastors or Developers can delete blogs"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing blog ID"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM blogs WHERE id = ?");
    $stmt->execute([$id]);
    
    if ($payload['designation'] === 'Developer') {
        logDeveloperAction($pdo, $payload['email'], 'DELETE', 'blogs', "Deleted blog ID {$id}");
    }
    
    echo json_encode(["message" => "Blog deleted successfully"]);

} elseif ($method === 'POST') {
    // Only Pastors can post/edit blogs
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $payload = verifyJWT($token, JWT_SECRET);
    if (!$payload || ($payload['designation'] !== 'Pastor' && $payload['designation'] !== 'Developer')) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden: Only Pastors or Developers can post blogs"]);
        exit;
    }

    $id = $_POST['id'] ?? null;
    $title = $_POST['title'] ?? '';
    $content = $_POST['content'] ?? '';
    
    $has_attachment = (isset($_FILES['image1']) && $_FILES['image1']['error'] === UPLOAD_ERR_OK) ||
                      (isset($_FILES['image2']) && $_FILES['image2']['error'] === UPLOAD_ERR_OK) ||
                      (isset($_FILES['pdf']) && $_FILES['pdf']['error'] === UPLOAD_ERR_OK);

    if ((!$title || !$content) && !$has_attachment) {
        http_response_code(400);
        echo json_encode(["error" => "Please provide either title & content, or an attachment"]);
        exit;
    }

    $target_dir = "../uploads/blogs/";
    if (!is_dir($target_dir)) @mkdir($target_dir, 0777, true);

    function handleUpload($fileInputName, $targetDir) {
        if (isset($_FILES[$fileInputName]) && $_FILES[$fileInputName]['error'] === UPLOAD_ERR_OK) {
            $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.-]/", "_", basename($_FILES[$fileInputName]["name"]));
            $target_file = $targetDir . $fileName;
            if (move_uploaded_file($_FILES[$fileInputName]["tmp_name"], $target_file)) {
                return "/uploads/blogs/" . $fileName;
            }
        }
        return null;
    }

    try {
        // UPDATE MODE
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM blogs WHERE id = ?");
            $stmt->execute([$id]);
            $existing = $stmt->fetch();
            if (!$existing) {
                http_response_code(404);
                echo json_encode(["error" => "Blog not found"]);
                exit;
            }

            $image1_path = handleUpload('image1', $target_dir) ?? $existing['image1_path'];
            $image2_path = handleUpload('image2', $target_dir) ?? $existing['image2_path'];
            $pdf_path = handleUpload('pdf', $target_dir) ?? $existing['pdf_path'];

            $stmt = $pdo->prepare("UPDATE blogs SET title = ?, content = ?, image1_path = ?, image2_path = ?, pdf_path = ? WHERE id = ?");
            $stmt->execute([$title, $content, $image1_path, $image2_path, $pdf_path, $id]);
            
            if ($payload['designation'] === 'Developer') {
                logDeveloperAction($pdo, $payload['email'], 'UPDATE', 'blogs', "Updated blog ID {$id}");
            }
            
            echo json_encode(["message" => "Blog updated successfully"]);
        } 
        // INSERT MODE
        else {
            $image1_path = handleUpload('image1', $target_dir);
            $image2_path = handleUpload('image2', $target_dir);
            $pdf_path = handleUpload('pdf', $target_dir);

            $stmt = $pdo->prepare("INSERT INTO blogs (title, content, image1_path, image2_path, pdf_path, author_id) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $content, $image1_path, $image2_path, $pdf_path, $payload['id']]);
            
            $new_id = $pdo->lastInsertId();
            if ($payload['designation'] === 'Developer') {
                logDeveloperAction($pdo, $payload['email'], 'INSERT', 'blogs', "Created new blog ID {$new_id}");
            }
            
            echo json_encode(["message" => "Blog created successfully", "id" => $new_id]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}
?>
