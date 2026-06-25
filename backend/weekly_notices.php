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
    $stmt = $pdo->query("SELECT weekly_notices.*, users.full_name as author_name FROM weekly_notices JOIN users ON weekly_notices.author_id = users.id ORDER BY release_date DESC, created_at DESC");
    $notices = $stmt->fetchAll();
    echo json_encode($notices);
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
        echo json_encode(["error" => "Forbidden: Only Secretary can delete notices"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing notice ID"]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM weekly_notices WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Notice deleted successfully"]);

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
        echo json_encode(["error" => "Forbidden: Only Secretary can post notices"]);
        exit;
    }

    $id = $_POST['id'] ?? null;
    $release_date = $_POST['release_date'] ?? '';
    $notices_json = $_POST['notices_json'] ?? '[]';

    if (!$release_date) {
        http_response_code(400);
        echo json_encode(["error" => "Missing release date"]);
        exit;
    }

    $target_dir = "../uploads/weekly_notices/";
    if (!is_dir($target_dir)) @mkdir($target_dir, 0777, true);

    function handleUploads($fileInputName, $targetDir) {
        $uploadedPaths = [];
        if (isset($_FILES[$fileInputName])) {
            $files = $_FILES[$fileInputName];
            if (is_array($files['name'])) {
                for ($i = 0; $i < count($files['name']); $i++) {
                    if ($files['error'][$i] === UPLOAD_ERR_OK) {
                        $fileName = time() . '_' . $i . '_' . preg_replace("/[^a-zA-Z0-9.-]/", "_", basename($files['name'][$i]));
                        $target_file = $targetDir . $fileName;
                        if (move_uploaded_file($files['tmp_name'][$i], $target_file)) {
                            $uploadedPaths[] = "/uploads/weekly_notices/" . $fileName;
                        }
                    }
                }
            } else {
                if ($files['error'] === UPLOAD_ERR_OK) {
                    $fileName = time() . '_0_' . preg_replace("/[^a-zA-Z0-9.-]/", "_", basename($files['name']));
                    $target_file = $targetDir . $fileName;
                    if (move_uploaded_file($files['tmp_name'], $target_file)) {
                        $uploadedPaths[] = "/uploads/weekly_notices/" . $fileName;
                    }
                }
            }
        }
        return $uploadedPaths;
    }

    $newDocs = handleUploads('documents', $target_dir);

    // Handle individual notice attachments
    $noticesArray = json_decode($notices_json, true) ?? [];
    
    try {
        if ($id) {
            $stmt = $pdo->prepare("SELECT documents_json, notices_json FROM weekly_notices WHERE id = ?");
            $stmt->execute([$id]);
            $existing = $stmt->fetch();
            if (!$existing) {
                http_response_code(404);
                echo json_encode(["error" => "Notice not found"]);
                exit;
            }

            $existingDocs = json_decode($existing['documents_json'] ?? '[]', true);
            if (!is_array($existingDocs)) $existingDocs = [];
            $existingNotices = json_decode($existing['notices_json'] ?? '[]', true);
            if (!is_array($existingNotices)) $existingNotices = [];
            
            // Either replace docs if new ones uploaded, or keep existing
            $finalDocs = !empty($newDocs) ? $newDocs : $existingDocs;

            foreach ($noticesArray as $idx => &$notice) {
                $noticeFileKey = 'notice_file_' . $idx;
                $noticeDoc = handleUploads($noticeFileKey, $target_dir);
                if (!empty($noticeDoc)) {
                    $notice['attachment'] = $noticeDoc[0];
                } else {
                    // Find existing attachment if it exists
                    // We match by index since notices are ordered
                    if (isset($existingNotices[$idx]['attachment'])) {
                        $notice['attachment'] = $existingNotices[$idx]['attachment'];
                    }
                }
            }
            $notices_json_final = json_encode($noticesArray);

            $stmt = $pdo->prepare("UPDATE weekly_notices SET release_date = ?, documents_json = ?, notices_json = ? WHERE id = ?");
            $stmt->execute([$release_date, json_encode($finalDocs), $notices_json_final, $id]);
            
            echo json_encode(["message" => "Notice updated successfully"]);
        } else {
            foreach ($noticesArray as $idx => &$notice) {
                $noticeFileKey = 'notice_file_' . $idx;
                $noticeDoc = handleUploads($noticeFileKey, $target_dir);
                if (!empty($noticeDoc)) {
                    $notice['attachment'] = $noticeDoc[0];
                }
            }
            $notices_json_final = json_encode($noticesArray);

            $stmt = $pdo->prepare("INSERT INTO weekly_notices (release_date, documents_json, notices_json, author_id) VALUES (?, ?, ?, ?)");
            $stmt->execute([$release_date, json_encode($newDocs), $notices_json_final, $payload['id']]);
            
            echo json_encode(["message" => "Notice created successfully", "id" => $pdo->lastInsertId()]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}
?>
