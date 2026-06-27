<?php
require_once __DIR__ . '/db_config.php';

function syncKnowledgeIfChanged($pdo) {
    $frontendDir = realpath(__DIR__ . '/../frontend/app');
    if (!$frontendDir || !is_dir($frontendDir)) return false;

    // Clear PHP stat cache so we get the real file modification times after an SCP upload
    clearstatcache();

    // Get the latest file modification time in the frontend directory
    $latestMtime = 0;
    
    try {
        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($frontendDir, RecursiveDirectoryIterator::SKIP_DOTS));
        foreach ($iterator as $file) {
            if ($file->isFile() && in_array($file->getExtension(), ['js', 'jsx', 'ts', 'tsx'])) {
                $mtime = $file->getMTime();
                if ($mtime > $latestMtime) {
                    $latestMtime = $mtime;
                }
            }
        }
    } catch (Exception $e) {
        return false;
    }

    if ($latestMtime === 0) return false;

    // Get the latest update time from the database
    $stmt = $pdo->query("SELECT UNIX_TIMESTAMP(MAX(last_updated)) FROM frontend_knowledge");
    $lastDbUpdate = (int)$stmt->fetchColumn();

    // If a file was modified after the last DB update, run the sync
    if ($latestMtime > $lastDbUpdate) {
        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($frontendDir, RecursiveDirectoryIterator::SKIP_DOTS));
        
        foreach ($iterator as $file) {
            if ($file->isFile() && in_array($file->getExtension(), ['js', 'jsx', 'ts', 'tsx'])) {
                $fullPath = $file->getPathname();
                $content = file_get_contents($fullPath);
                
                // Cleanup React code
                $cleanContent = preg_replace('/import.*?;/s', '', $content);
                $cleanContent = preg_replace('/export default function/', 'SECTION:', $cleanContent);
                $cleanContent = preg_replace('/className="[^"]*"/', '', $cleanContent);
                $cleanContent = preg_replace('/<[^>]+>/', ' ', $cleanContent);
                $cleanContent = preg_replace('/\s+/', ' ', $cleanContent);
                $cleanContent = trim($cleanContent);
                
                if (strlen($cleanContent) > 50) {
                    $relativePath = str_replace($frontendDir, '', $fullPath);
                    $relativePath = ltrim($relativePath, '/\\');
                    
                    $stmt = $pdo->prepare("
                        INSERT INTO frontend_knowledge (source_file, content) 
                        VALUES (?, ?) 
                        ON DUPLICATE KEY UPDATE content = VALUES(content), last_updated = CURRENT_TIMESTAMP
                    ");
                    $stmt->execute([$relativePath, $cleanContent]);
                }
            }
        }
        return true; // Synced
    }
    return false; // No sync needed
}

// If accessed directly via URL/CLI (not included by another file)
if (basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'])) {
    header("Content-Type: application/json; charset=UTF-8");
    $secretKey = "sync_admin_123";
    if (php_sapi_name() !== 'cli') {
        if (!isset($_GET['key']) || $_GET['key'] !== $secretKey) {
            http_response_code(403);
            echo json_encode(["error" => "Unauthorized."]);
            exit;
        }
    }
    
    try {
        $synced = syncKnowledgeIfChanged($pdo);
        echo json_encode([
            "success" => true,
            "message" => $synced ? "Knowledge base was updated with new changes." : "Knowledge base is already up to date.",
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to sync: " . $e->getMessage()]);
    }
}
?>
