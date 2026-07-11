<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_config.php';
require_once 'jwt_helper.php';
require_once 'speaking_schedule_parsers.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper to log developer actions
function logDeveloperActionLocal($pdo, $email, $action, $table, $details) {
    if (function_exists('logDeveloperAction')) {
        logDeveloperAction($pdo, $email, $action, $table, $details);
    } else {
        try {
            $stmt = $pdo->prepare("INSERT INTO developer_logs (developer_email, action_type, target_table, action_details) VALUES (?, ?, ?, ?)");
            $stmt->execute([$email, $action, $table, $details]);
        } catch (Exception $e) {
            // Ignore if table doesn't exist
        }
    }
}

if ($method === 'GET') {
    $action = $_GET['action'] ?? '';

    if ($action === 'admin_list') {
        // Auth required
        $token = getBearerToken();
        if (!$token) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            exit;
        }
        $payload = verifyJWT($token, JWT_SECRET);
        if (!$payload || ($payload['designation'] !== 'Secretary' && $payload['designation'] !== 'Developer')) {
            http_response_code(403);
            echo json_encode(["error" => "Forbidden"]);
            exit;
        }

        $stmt = $pdo->query("SELECT * FROM speaking_schedule_uploads ORDER BY created_at DESC");
        $uploads = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($uploads);
        exit;

    } elseif ($action === 'preview') {
        // Auth required
        $token = getBearerToken();
        if (!$token) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            exit;
        }
        $payload = verifyJWT($token, JWT_SECRET);
        if (!$payload || ($payload['designation'] !== 'Secretary' && $payload['designation'] !== 'Developer')) {
            http_response_code(403);
            echo json_encode(["error" => "Forbidden"]);
            exit;
        }

        $upload_id = $_GET['upload_id'] ?? null;
        if (!$upload_id) {
            http_response_code(400);
            echo json_encode(["error" => "Missing upload_id"]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM speaking_schedule_uploads WHERE id = ?");
        $stmt->execute([$upload_id]);
        $upload = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$upload) {
            http_response_code(404);
            echo json_encode(["error" => "Upload not found"]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM speaking_schedule_items WHERE upload_id = ? ORDER BY schedule_date ASC, sort_order ASC");
        $stmt->execute([$upload_id]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Decode JSON fields
        $upload['meta_json'] = json_decode($upload['meta_json'], true);
        foreach ($items as &$item) {
            $item['data_json'] = json_decode($item['data_json'], true);
        }

        echo json_encode([
            "upload" => $upload,
            "items" => $items
        ]);
        exit;

    } else {
        // Public endpoint: Fetch published items of a sub_section (Only future dates)
        $sub_section = $_GET['sub_section'] ?? null;
        if (!$sub_section) {
            http_response_code(400);
            echo json_encode(["error" => "Missing sub_section. Supported: 'Sunday Worships', 'Morning prayer', 'Monday Prayer', 'Prayer Wings', 'CE Union', 'Wednesday Prayer', 'Zoom Prayer', 'Quarterly Prayer'"]);
            exit;
        }

        // Get currently published upload meta
        $stmt = $pdo->prepare("SELECT * FROM speaking_schedule_uploads WHERE sub_section = ? AND status = 'published' LIMIT 1");
        $stmt->execute([$sub_section]);
        $upload = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$upload) {
            echo json_encode([
                "meta" => null,
                "items" => []
            ]);
            exit;
        }

        $today = date('Y-m-d');
        // Fetch items that are published and date is >= today
        $stmt = $pdo->prepare("SELECT * FROM speaking_schedule_items WHERE upload_id = ? AND is_published = 1 AND schedule_date >= ? ORDER BY schedule_date ASC, sort_order ASC");
        $stmt->execute([$upload['id'], $today]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Decode JSON fields
        $upload['meta_json'] = json_decode($upload['meta_json'], true);
        foreach ($items as &$item) {
            $item['data_json'] = json_decode($item['data_json'], true);
        }

        echo json_encode([
            "meta" => $upload,
            "items" => $items
        ]);
        exit;
    }

} elseif ($method === 'POST') {
    $action = $_GET['action'] ?? '';

    // Auth required
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }
    $payload = verifyJWT($token, JWT_SECRET);
    if (!$payload || ($payload['designation'] !== 'Secretary' && $payload['designation'] !== 'Developer')) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden"]);
        exit;
    }

    if ($action === 'upload') {
        $sub_section = $_POST['sub_section'] ?? '';
        if (!$sub_section || !isset($_FILES['pdf_file'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing sub_section or pdf_file"]);
            exit;
        }

        $file = $_FILES['pdf_file'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(["error" => "File upload failed with error code: " . $file['error']]);
            exit;
        }

        // Validate pdf extension / mimetype
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        if (strtolower($ext) !== 'pdf') {
            http_response_code(400);
            echo json_encode(["error" => "Only PDF files are supported."]);
            exit;
        }

        // Select parser dynamically
        $parserFunc = '';
        switch ($sub_section) {
            case 'Sunday Worships':
                $parserFunc = 'parseSundayWorshipPdf';
                break;
            case 'Morning prayer':
                $parserFunc = 'parseMorningPrayerPdf';
                break;
            case 'Monday Prayer':
                $parserFunc = 'parseMondayPrayerPdf';
                break;
            case 'CE Union':
                $parserFunc = 'parseCEUnionPdf';
                break;
            case 'Wednesday Prayer':
                $parserFunc = 'parseWednesdayBibleStudyPdf';
                break;
            case 'Zoom Prayer':
                $parserFunc = 'parseEveningZoomPrayerPdf';
                break;
            case 'Quarterly Prayer':
                $parserFunc = 'parseQuarterlyPrayerPdf';
                break;
            default:
                http_response_code(400);
                echo json_encode(["error" => "Unrecognized sub-section: " . $sub_section]);
                exit;
        }

        // Run parser
        $parsedData = null;
        try {
            $parsedData = $parserFunc($file['tmp_name']);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(["error" => "Failed to parse PDF: " . $e->getMessage()]);
            exit;
        }

        if ($parsedData === null || empty($parsedData['items'])) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid PDF format: No valid schedule rows were found. Please check that you selected the correct subsection and uploaded a valid text-based PDF."]);
            exit;
        }

        // Create upload directory if not exists
        $uploadDir = __DIR__ . '/uploads/speaking_schedules/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $destFileName = time() . '_' . basename($file['name']);
        $destPath = $uploadDir . $destFileName;

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to save uploaded file."]);
            exit;
        }

        // Insert upload record as draft
        $stmt = $pdo->prepare("INSERT INTO speaking_schedule_uploads (sub_section, title, pdf_file, period_start, period_end, status, meta_json, uploaded_by) VALUES (?, ?, ?, ?, ?, 'draft', ?, ?)");
        $stmt->execute([
            $parsedData['sub_section'],
            $parsedData['title'],
            'uploads/speaking_schedules/' . $destFileName,
            $parsedData['period_start'],
            $parsedData['period_end'],
            json_encode($parsedData['meta_json']),
            $payload['id']
        ]);

        $upload_id = $pdo->lastInsertId();

        // Insert items
        $stmtInsert = $pdo->prepare("INSERT INTO speaking_schedule_items (upload_id, sub_section, schedule_date, month_label, day_name, data_json, sort_order, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, 0)");
        foreach ($parsedData['items'] as $index => $item) {
            $stmtInsert->execute([
                $upload_id,
                $parsedData['sub_section'],
                $item['schedule_date'],
                $item['month_label'],
                $item['day_name'],
                json_encode($item['data_json']),
                $index
            ]);
        }

        if ($payload['designation'] === 'Developer') {
            logDeveloperActionLocal($pdo, $payload['email'], 'UPLOAD', 'speaking_schedule_uploads', "Uploaded schedule PDF for {$sub_section}");
        }

        // Return preview
        $stmtItems = $pdo->prepare("SELECT * FROM speaking_schedule_items WHERE upload_id = ? ORDER BY schedule_date ASC, sort_order ASC");
        $stmtItems->execute([$upload_id]);
        $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);
        foreach ($items as &$it) {
            $it['data_json'] = json_decode($it['data_json'], true);
        }

        echo json_encode([
            "success" => true,
            "upload_id" => $upload_id,
            "title" => $parsedData['title'],
            "period_start" => $parsedData['period_start'],
            "period_end" => $parsedData['period_end'],
            "meta_json" => $parsedData['meta_json'],
            "preview_items" => $items
        ]);
        exit;
    }

} elseif ($method === 'PUT') {
    $action = $_GET['action'] ?? '';

    // Auth required
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }
    $payload = verifyJWT($token, JWT_SECRET);
    if (!$payload || ($payload['designation'] !== 'Secretary' && $payload['designation'] !== 'Developer')) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden"]);
        exit;
    }

    if ($action === 'publish') {
        $data = json_decode(file_get_contents("php://input"), true);
        $upload_id = $data['upload_id'] ?? null;

        if (!$upload_id) {
            http_response_code(400);
            echo json_encode(["error" => "Missing upload_id"]);
            exit;
        }

        // Find the upload
        $stmt = $pdo->prepare("SELECT * FROM speaking_schedule_uploads WHERE id = ?");
        $stmt->execute([$upload_id]);
        $upload = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$upload) {
            http_response_code(404);
            echo json_encode(["error" => "Upload not found"]);
            exit;
        }

        $sub_section = $upload['sub_section'];

        // Begin transaction
        $pdo->beginTransaction();
        try {
            // Un-publish all other uploads of same sub_section
            $stmt = $pdo->prepare("UPDATE speaking_schedule_uploads SET status = 'draft' WHERE sub_section = ? AND id != ?");
            $stmt->execute([$sub_section, $upload_id]);

            $stmt = $pdo->prepare("UPDATE speaking_schedule_items SET is_published = 0 WHERE sub_section = ? AND upload_id != ?");
            $stmt->execute([$sub_section, $upload_id]);

            // Publish this upload
            $stmt = $pdo->prepare("UPDATE speaking_schedule_uploads SET status = 'published' WHERE id = ?");
            $stmt->execute([$upload_id]);

            $stmt = $pdo->prepare("UPDATE speaking_schedule_items SET is_published = 1 WHERE upload_id = ?");
            $stmt->execute([$upload_id]);

            $pdo->commit();

            if ($payload['designation'] === 'Developer') {
                logDeveloperActionLocal($pdo, $payload['email'], 'PUBLISH', 'speaking_schedule_uploads', "Published schedule upload ID {$upload_id}");
            }

            echo json_encode(["success" => true, "message" => "Schedule published successfully."]);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(["error" => "Publish transaction failed: " . $e->getMessage()]);
        }
        exit;

    } elseif ($action === 'update_item') {
        $data = json_decode(file_get_contents("php://input"), true);
        $item_id = $data['id'] ?? null;
        $data_json = $data['data_json'] ?? null;

        if (!$item_id || !$data_json) {
            http_response_code(400);
            echo json_encode(["error" => "Missing item id or data_json"]);
            exit;
        }

        // Prepare optional fields
        $schedule_date = $data['schedule_date'] ?? null;
        $day_name = $data['day_name'] ?? null;

        $query = "UPDATE speaking_schedule_items SET data_json = ?";
        $params = [json_encode($data_json)];

        if ($schedule_date) {
            $query .= ", schedule_date = ?";
            $params[] = $schedule_date;
            // Recalculate month label
            $dateObj = DateTime::createFromFormat('Y-m-d', $schedule_date);
            if ($dateObj) {
                $query .= ", month_label = ?";
                $params[] = $dateObj->format('F Y');
            }
        }
        if ($day_name) {
            $query .= ", day_name = ?";
            $params[] = $day_name;
        }

        $query .= " WHERE id = ?";
        $params[] = $item_id;

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        if ($payload['designation'] === 'Developer') {
            logDeveloperActionLocal($pdo, $payload['email'], 'UPDATE', 'speaking_schedule_items', "Updated item ID {$item_id}");
        }

        echo json_encode(["success" => true, "message" => "Item updated successfully."]);
        exit;
    }

} elseif ($method === 'DELETE') {
    // Auth required
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }
    $payload = verifyJWT($token, JWT_SECRET);
    if (!$payload || ($payload['designation'] !== 'Secretary' && $payload['designation'] !== 'Developer')) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden"]);
        exit;
    }

    $upload_id = $_GET['upload_id'] ?? null;
    if (!$upload_id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing upload_id"]);
        exit;
    }

    // Find and delete file from disk
    $stmt = $pdo->prepare("SELECT pdf_file FROM speaking_schedule_uploads WHERE id = ?");
    $stmt->execute([$upload_id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row && $row['pdf_file']) {
        $filePath = __DIR__ . '/' . $row['pdf_file'];
        if (file_exists($filePath)) {
            @unlink($filePath);
        }
    }

    // Items automatically cascade delete due to foreign key
    $stmt = $pdo->prepare("DELETE FROM speaking_schedule_uploads WHERE id = ?");
    $stmt->execute([$upload_id]);

    if ($payload['designation'] === 'Developer') {
        logDeveloperActionLocal($pdo, $payload['email'], 'DELETE', 'speaking_schedule_uploads', "Deleted upload ID {$upload_id}");
    }

    echo json_encode(["success" => true, "message" => "Upload deleted successfully."]);
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
?>
