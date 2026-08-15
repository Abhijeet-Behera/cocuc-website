<?php
/**
 * Events API Endpoint (Hostinger / MySQL)
 * Supports GET (list/filter), POST (create), DELETE (remove)
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db_config.php';
require_once __DIR__ . '/jwt_helper.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper to extract Google Drive Folder ID
function extractFolderId($url) {
    if (preg_match('/\/folders\/([a-zA-Z0-9_-]+)/', $url, $matches)) {
        return $matches[1];
    }
    if (preg_match('/[?&]id=([a-zA-Z0-9_-]+)/', $url, $matches)) {
        return $matches[1];
    }
    return preg_replace('/[^a-zA-Z0-9_-]/', '', $url);
}

// -------------------------------------------------------------
// GET: Fetch events (all or filtered by wing_id / search)
// -------------------------------------------------------------
if ($method === 'GET') {
    try {
        $wingId = isset($_GET['wing_id']) ? trim($_GET['wing_id']) : (isset($_GET['wingId']) ? trim($_GET['wingId']) : null);
        $search = isset($_GET['search']) ? trim($_GET['search']) : null;

        $sql = "SELECT * FROM events WHERE 1=1";
        $params = [];

        if ($wingId) {
            $sql .= " AND wing_id = :wing_id";
            $params[':wing_id'] = $wingId;
        }

        if ($search) {
            $sql .= " AND (title LIKE :s1 OR description LIKE :s2 OR location LIKE :s3)";
            $params[':s1'] = "%$search%";
            $params[':s2'] = "%$search%";
            $params[':s3'] = "%$search%";
        }

        $sql .= " ORDER BY event_date DESC, created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $events = array_map(function($r) {
            return [
                'id' => (string)$r['id'],
                'title' => $r['title'],
                'wingId' => $r['wing_id'],
                'wingName' => $r['wing_name'],
                'description' => $r['description'],
                'wordCount' => (int)$r['word_count'],
                'folderUrl' => $r['folder_url'],
                'folderId' => $r['folder_id'],
                'images' => !empty($r['images_json']) ? json_decode($r['images_json'], true) : [],
                'coverImage' => $r['cover_image'],
                'eventDate' => $r['event_date'],
                'location' => $r['location'],
                'createdAt' => $r['created_at'],
                'updatedAt' => $r['updated_at']
            ];
        }, $rows);

        echo json_encode([
            'success' => true,
            'data' => $events,
            'count' => count($events)
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// -------------------------------------------------------------
// POST: Create a new event record
// -------------------------------------------------------------
if ($method === 'POST') {
    try {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);

        if (!$body) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid JSON body']);
            exit;
        }

        $title = trim($body['title'] ?? '');
        $wingId = trim($body['wingId'] ?? $body['wing_id'] ?? '');
        $wingName = trim($body['wingName'] ?? $body['wing_name'] ?? '');
        $description = trim($body['description'] ?? '');
        $folderUrl = trim($body['folderUrl'] ?? $body['folder_url'] ?? '');
        $eventDate = !empty($body['eventDate']) ? $body['eventDate'] : date('Y-m-d');
        $location = trim($body['location'] ?? 'Church Campus');
        $images = $body['images'] ?? [];

        if (empty($title) || empty($wingId) || empty($description) || empty($folderUrl)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Title, wing, description, and Google Drive URL are required.']);
            exit;
        }

        // Word count validation (up to 1000 words max)
        $words = str_word_count($description);
        if ($words > 1000) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => "Description exceeds 1000 words limit. Count: $words words."
            ]);
            exit;
        }

        $folderId = extractFolderId($folderUrl);
        $coverImage = !empty($images[0]) ? $images[0] : null;

        $stmt = $pdo->prepare("
            INSERT INTO events (title, wing_id, wing_name, description, word_count, folder_url, folder_id, images_json, cover_image, event_date, location)
            VALUES (:title, :wing_id, :wing_name, :description, :word_count, :folder_url, :folder_id, :images_json, :cover_image, :event_date, :location)
        ");

        $stmt->execute([
            ':title' => $title,
            ':wing_id' => $wingId,
            ':wing_name' => $wingName,
            ':description' => $description,
            ':word_count' => $words,
            ':folder_url' => $folderUrl,
            ':folder_id' => $folderId,
            ':images_json' => json_encode($images),
            ':cover_image' => $coverImage,
            ':event_date' => $eventDate,
            ':location' => $location
        ]);

        $newId = $pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Event created successfully.',
            'data' => [
                'id' => (string)$newId,
                'title' => $title,
                'wingId' => $wingId,
                'folderId' => $folderId,
                'images' => $images
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// -------------------------------------------------------------
// DELETE: Delete event by ID
// -------------------------------------------------------------
if ($method === 'DELETE') {
    try {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Event ID is required']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM events WHERE id = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode(['success' => true, 'message' => 'Event deleted successfully']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}
