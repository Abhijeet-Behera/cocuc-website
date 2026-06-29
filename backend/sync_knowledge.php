<?php
require_once __DIR__ . '/db_config.php';

function syncKnowledgeIfChanged($pdo) {
    // We support multiple environments: Local Dev (.jsx), Local Build (.html), and Hostinger Prod (.html)
    $possibleDirs = [
        realpath(__DIR__ . '/../frontend/app'),
        realpath(__DIR__ . '/../frontend/out'),
        realpath(__DIR__ . '/../') // Hostinger public_html
    ];

    $targetDirs = [];
    foreach ($possibleDirs as $dir) {
        // Exclude the backend itself if scanning public_html
        if ($dir && is_dir($dir)) {
            $targetDirs[] = $dir;
        }
    }

    if (empty($targetDirs)) return false;

    // Clear PHP stat cache
    clearstatcache();

    $latestMtime = 0;
    $filesToScan = [];

    foreach ($targetDirs as $dir) {
        try {
            $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS));
            foreach ($iterator as $file) {
                // Skip the backend directory completely to avoid scanning API scripts
                if (strpos($file->getPathname(), DIRECTORY_SEPARATOR . 'backend' . DIRECTORY_SEPARATOR) !== false) {
                    continue;
                }
                
                if ($file->isFile() && in_array($file->getExtension(), ['js', 'jsx', 'ts', 'tsx', 'html'])) {
                    $mtime = $file->getMTime();
                    if ($mtime > $latestMtime) {
                        $latestMtime = $mtime;
                    }
                    $filesToScan[] = $file->getPathname();
                }
            }
        } catch (Exception $e) {}
    }

    if ($latestMtime === 0 || empty($filesToScan)) return false;

    // Get the latest update time from the database
    $stmt = $pdo->query("SELECT UNIX_TIMESTAMP(MAX(last_updated)) FROM frontend_knowledge");
    $lastDbUpdate = (int)$stmt->fetchColumn();

    // If a file was modified after the last DB update, run the sync
    if ($latestMtime > $lastDbUpdate) {
        foreach ($filesToScan as $fullPath) {
            $ext = pathinfo($fullPath, PATHINFO_EXTENSION);
            $content = file_get_contents($fullPath);
            
            $cleanContent = "";
            if ($ext === 'html') {
                // For HTML files (like on Hostinger), strip tags for clean semantic text
                // First, remove scripts and styles
                $content = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', "", $content);
                $content = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', "", $content);
                $cleanContent = strip_tags($content);
            } else {
                // For React JSX files
                $cleanContent = preg_replace('/import.*?;/s', '', $content);
                $cleanContent = preg_replace('/export default function.*?\(/', '', $cleanContent);
                $cleanContent = preg_replace('/const\s+\w+\s*=\s*(?:\[[^\]]*\]|\{[^\}]*\})/', '', $cleanContent);
                $cleanContent = preg_replace('/<[^>]+>/', ' ', $cleanContent);
                $cleanContent = preg_replace('/\{[^\}]*\}/', ' ', $cleanContent);
            }
            
            // Final whitespace cleanup
            $cleanContent = preg_replace('/\s+/', ' ', $cleanContent);
            $cleanContent = trim($cleanContent);
            
            if (strlen($cleanContent) > 50) {
                $relativePath = str_replace($dir, '', $fullPath);
                    $relativePath = ltrim($relativePath, '/\\');
                    
                    // Clear old chunks for this file
                    $delStmt = $pdo->prepare("DELETE FROM frontend_knowledge WHERE source_file = ?");
                    $delStmt->execute([$relativePath]);
                    
                    // Split into larger chunks of ~800 characters with SENTENCE OVERLAPPING
                    // This prevents information from being sliced in half and guarantees full context.
                    $sentences = preg_split('/(?<=[.?!])\s+/', $cleanContent);
                    $chunks = [];
                    $currentChunk = '';
                    $lastSentence = '';
                    
                    foreach ($sentences as $sentence) {
                        if (strlen($currentChunk) + strlen($sentence) > 800) {
                            if (!empty(trim($currentChunk))) {
                                $chunks[] = trim($currentChunk);
                            }
                            // Start new chunk with an OVERLAP of the previous sentence to maintain context!
                            $currentChunk = $lastSentence . ' ' . $sentence . ' ';
                        } else {
                            $currentChunk .= $sentence . ' ';
                        }
                        $lastSentence = $sentence;
                    }
                    if (!empty(trim($currentChunk))) {
                        $chunks[] = trim($currentChunk);
                    }
                    
                    $stmt = $pdo->prepare("
                        INSERT INTO frontend_knowledge (source_file, chunk_index, content) 
                        VALUES (?, ?, ?)
                    ");
                    
                    foreach ($chunks as $index => $chunk) {
                        if (strlen($chunk) > 20) { // Ignore tiny fragmented chunks
                            $stmt->execute([$relativePath, $index, $chunk]);
                        }
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
