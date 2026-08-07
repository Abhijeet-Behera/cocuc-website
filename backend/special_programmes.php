<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db_config.php';
require_once __DIR__ . '/jwt_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

function uploadSpecialProgrammeDocument($fileInputName, $targetDir)
{
    if (!isset($_FILES[$fileInputName])) {
        return null;
    }

    if ($_FILES[$fileInputName]['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $originalName = basename($_FILES[$fileInputName]['name']);
    $safeOriginalName = preg_replace('/[^A-Za-z0-9_\.-]/', '_', $originalName);
    $fileName = time() . '_' . $safeOriginalName;

    $targetFile = rtrim($targetDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileName;

    if (move_uploaded_file($_FILES[$fileInputName]['tmp_name'], $targetFile)) {
        return "/uploads/special_programmes/" . $fileName;
    }

    return null;
}

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("
            SELECT 
                special_programmes.*, 
                users.full_name AS author_name 
            FROM special_programmes 
            JOIN users ON special_programmes.author_id = users.id 
            ORDER BY special_programmes.upload_date DESC, special_programmes.created_at DESC
        ");

        $programmes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($programmes);
        exit;
    }

    if ($method === 'DELETE') {
        $token = getBearerToken();

        if (!$token) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            exit;
        }

        $payload = verifyJWT($token, JWT_SECRET);

        if (!$payload || ($payload['designation'] !== 'Secretary' && $payload['designation'] !== 'Developer')) {
            http_response_code(403);
            echo json_encode(["error" => "Forbidden: Only Secretary or Developers can delete programmes"]);
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

        if ($payload['designation'] === 'Developer') {
            logDeveloperAction($pdo, $payload['email'], 'DELETE', 'special_programmes', "Deleted programme ID {$id}");
        }

        echo json_encode(["message" => "Programme deleted successfully"]);
        exit;
    }

    if ($method === 'POST') {
        $token = getBearerToken();

        if (!$token) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            exit;
        }

        $payload = verifyJWT($token, JWT_SECRET);

        if (!$payload || ($payload['designation'] !== 'Secretary' && $payload['designation'] !== 'Developer')) {
            http_response_code(403);
            echo json_encode(["error" => "Forbidden: Only Secretary or Developers can post programmes"]);
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

        $target_dir = __DIR__ . "/uploads/special_programmes/";

        if ($id) {
            $stmt = $pdo->prepare("SELECT document_path FROM special_programmes WHERE id = ?");
            $stmt->execute([$id]);
            $existing = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$existing) {
                http_response_code(404);
                echo json_encode(["error" => "Programme not found"]);
                exit;
            }

            $new_document_path = uploadSpecialProgrammeDocument('document', $target_dir);
            $document_path = $new_document_path ?: $existing['document_path'];

            $stmt = $pdo->prepare("
                UPDATE special_programmes 
                SET 
                    upload_date = ?, 
                    title = ?, 
                    wing = ?, 
                    custom_wing = ?, 
                    event_from = ?, 
                    event_to = ?, 
                    duration = ?, 
                    details = ?, 
                    document_path = ? 
                WHERE id = ?
            ");

            $stmt->execute([
                $upload_date,
                $title,
                $wing,
                $custom_wing,
                $event_from,
                $event_to,
                $duration,
                $details,
                $document_path,
                $id
            ]);

            if ($payload['designation'] === 'Developer') {
                logDeveloperAction($pdo, $payload['email'], 'UPDATE', 'special_programmes', "Updated programme ID {$id}");
            }

            echo json_encode(["message" => "Programme updated successfully"]);
            exit;
        }

        $document_path = uploadSpecialProgrammeDocument('document', $target_dir);

        $stmt = $pdo->prepare("
            INSERT INTO special_programmes 
                (upload_date, title, wing, custom_wing, event_from, event_to, duration, details, document_path, author_id) 
            VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $upload_date,
            $title,
            $wing,
            $custom_wing,
            $event_from,
            $event_to,
            $duration,
            $details,
            $document_path,
            $payload['id']
        ]);

        $new_id = $pdo->lastInsertId();

        if ($payload['designation'] === 'Developer') {
            logDeveloperAction($pdo, $payload['email'], 'INSERT', 'special_programmes', "Created new programme ID {$new_id}");
        }

        echo json_encode([
            "message" => "Programme created successfully",
            "id" => $new_id
        ]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error: " . $e->getMessage()]);
    exit;
}