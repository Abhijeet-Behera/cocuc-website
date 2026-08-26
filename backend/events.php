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
        $title = trim($_POST['title'] ?? '');
        $wingId = trim($_POST['wingId'] ?? $_POST['wing_id'] ?? '');
        $wingName = trim($_POST['wingName'] ?? $_POST['wing_name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $eventDate = !empty($_POST['eventDate']) ? $_POST['eventDate'] : date('Y-m-d');
        $location = trim($_POST['location'] ?? 'Church Campus');

        if (empty($title) || empty($wingId) || empty($description)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Title, wing, and description are required.']);
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

        // Get Google Drive Folder ID from ENV
        $envKeyMap = [
            'general-church' => 'DRIVE_FOLDER_GENERAL_CHURCH',
            'ce-union' => 'DRIVE_FOLDER_CE_UNION',
            'mahila-samiti' => 'DRIVE_FOLDER_MAHILA_SAMITI',
            'sunday-school' => 'DRIVE_FOLDER_SUNDAY_SCHOOL',
            'youth-fellowship' => 'DRIVE_FOLDER_YOUTH_FELLOWSHIP',
            'elders-fellowship' => 'DRIVE_FOLDER_ELDERS_FELLOWSHIP',
        ];
        $envKey = $envKeyMap[$wingId] ?? null;
        $folderId = $envKey ? ($_ENV[$envKey] ?? null) : null;
        
        $imagesUrls = [];
        
        // Helper function for Google Auth
        if (!function_exists('getGoogleAccessToken')) {
            function getGoogleAccessToken($credentialsPath) {
                if (!file_exists($credentialsPath)) return null;
                $creds = json_decode(file_get_contents($credentialsPath), true);
                if (!$creds) return null;
            
                $header = json_encode(['alg' => 'RS256', 'typ' => 'JWT']);
                $now = time();
                $payload = json_encode([
                    'iss' => $creds['client_email'],
                    'scope' => 'https://www.googleapis.com/auth/drive.file',
                    'aud' => $creds['token_uri'],
                    'exp' => $now + 3600,
                    'iat' => $now
                ]);
            
                $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
                $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
                
                $signature = '';
                openssl_sign($base64UrlHeader . "." . $base64UrlPayload, $signature, $creds['private_key'], OPENSSL_ALGO_SHA256);
                $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
            
                $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
            
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $creds['token_uri']);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                    'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    'assertion' => $jwt
                ]));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                $response = curl_exec($ch);
                curl_close($ch);
            
                $tokenData = json_decode($response, true);
                return $tokenData['access_token'] ?? null;
            }
        }

        // Process File Uploads
        if (!empty($_FILES['images']) && is_array($_FILES['images']['name'])) {
            $token = null;
            if ($folderId) {
                $CREDENTIALS_PATH = __DIR__ . '/google-credentials.json';
                $token = getGoogleAccessToken($CREDENTIALS_PATH);
            }

            $count = count($_FILES['images']['name']);
            for ($i = 0; $i < $count; $i++) {
                if ($_FILES['images']['error'][$i] === UPLOAD_ERR_OK) {
                    $tmpName = $_FILES['images']['tmp_name'][$i];
                    $fileName = $_FILES['images']['name'][$i];
                    $mimeType = $_FILES['images']['type'][$i];

                    $uploadSuccess = false;

                    // 1. Try Google Drive if token and folder ID exist
                    if ($token && $folderId) {
                        $metadata = json_encode([
                            'name' => $fileName,
                            'parents' => [$folderId]
                        ]);

                        $boundary = "-------314159265358979323846";
                        $body = "--$boundary
"
                              . "Content-Type: application/json; charset=UTF-8

"
                              . "$metadata
"
                              . "--$boundary
"
                              . "Content-Type: $mimeType

"
                              . file_get_contents($tmpName) . "
"
                              . "--$boundary--";

                        $ch = curl_init();
                        curl_setopt($ch, CURLOPT_URL, 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink');
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                        curl_setopt($ch, CURLOPT_POST, true);
                        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
                        curl_setopt($ch, CURLOPT_HTTPHEADER, [
                            "Authorization: Bearer $token",
                            "Content-Type: multipart/related; boundary=$boundary",
                            "Content-Length: " . strlen($body)
                        ]);

                        $res = curl_exec($ch);
                        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                        curl_close($ch);

                        if ($httpCode === 200) {
                            $driveData = json_decode($res, true);
                            if (!empty($driveData['webContentLink'])) {
                                $imagesUrls[] = $driveData['webContentLink'];
                                $uploadSuccess = true;
                            }
                        }
                    }

                    // 2. Fallback to Local Storage if Drive fails or isn't configured
                    if (!$uploadSuccess) {
                        $targetDir = __DIR__ . "/../uploads/events/$wingId/";
                        if (!file_exists($targetDir)) {
                            mkdir($targetDir, 0777, true);
                        }
                        
                        $safeFileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "", basename($fileName));
                        $targetFilePath = $targetDir . $safeFileName;
                        
                        if (move_uploaded_file($tmpName, $targetFilePath)) {
                            // Construct relative URL for frontend
                            $imagesUrls[] = "/uploads/events/$wingId/$safeFileName";
                        }
                    }
                }
            }
        }

        $coverImage = !empty($imagesUrls[0]) ? $imagesUrls[0] : null;
        $folderUrl = $folderId ? "https://drive.google.com/drive/folders/$folderId" : '';

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
            ':images_json' => json_encode($imagesUrls),
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
                'images' => $imagesUrls
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
