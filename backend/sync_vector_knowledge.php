<?php
// backend/sync_vector_knowledge.php
// Run this script in the background to sync your MySQL database to Pinecone
require_once __DIR__ . '/db_config.php';
require_once __DIR__ . '/env_loader.php';

$envPath = __DIR__ . '/.env';
$env = file_exists($envPath) ? loadEnv($envPath) : [];

$geminiKey = $env['CLOUDFLARE_API_TOKEN'] ?? getenv('CLOUDFLARE_API_TOKEN');
$cloudflareAccountId = $env['CLOUDFLARE_ACCOUNT_ID'] ?? getenv('CLOUDFLARE_ACCOUNT_ID');
$pineconeKey = $env['PINECONE_API_KEY'] ?? getenv('PINECONE_API_KEY');
$pineconeHost = $env['PINECONE_HOST'] ?? getenv('PINECONE_HOST'); 

if (!$geminiKey || !$cloudflareAccountId || !$pineconeKey || !$pineconeHost) {
    die("Missing API Keys: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, PINECONE_API_KEY, or PINECONE_HOST in .env\n");
}

function getEmbedding($text, $apiKey, $accountId = null) {
    global $cloudflareAccountId;
    $accountId = $accountId ?? $cloudflareAccountId;
    
    $url = "https://api.cloudflare.com/client/v4/accounts/{$accountId}/ai/run/@cf/baai/bge-base-en-v1.5";
    
    $payload = json_encode([
        "text" => $text
    ]);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ]);
    
    $response = curl_exec($ch);
    $curlErr = curl_error($ch);
    curl_close($ch);
    
    if ($curlErr) {
        echo "CURL Error in getEmbedding: " . $curlErr . "<br>";
        return null;
    }
    
    $data = json_decode($response, true);
    if (isset($data['result']['data'][0])) {
        return $data['result']['data'][0];
    } else {
        echo "Cloudflare API Error: " . htmlspecialchars($response) . "<br>";
    }
    return null;
}

function upsertToPinecone($vectors, $pineconeKey, $pineconeHost) {
    $url = rtrim($pineconeHost, '/') . '/vectors/upsert';
    
    $payload = json_encode([
        "vectors" => $vectors,
        "namespace" => "church-knowledge"
    ]);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Api-Key: ' . $pineconeKey,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return $httpCode >= 200 && $httpCode < 300;
}

// 1. Gather all dynamic knowledge chunks
$chunks = [];

// Blogs
$stmt = $pdo->query("SELECT id, title, content FROM blogs ORDER BY created_at DESC LIMIT 10");
while ($row = $stmt->fetch()) {
    $text = "Blog Post: " . $row['title'] . ". Content: " . strip_tags(substr($row['content'], 0, 800));
    $chunks[] = ['id' => 'blog_' . $row['id'], 'text' => $text];
}

// Announcements
$stmt = $pdo->query("SELECT id, title, content FROM announcements ORDER BY created_at DESC LIMIT 10");
while ($row = $stmt->fetch()) {
    $text = "Church Announcement: " . $row['title'] . ". Details: " . strip_tags($row['content']);
    $chunks[] = ['id' => 'announcement_' . $row['id'], 'text' => $text];
}

// Upcoming Events
$stmt = $pdo->query("SELECT id, title, event_from, event_to, details FROM special_programmes ORDER BY created_at DESC LIMIT 10");
while ($row = $stmt->fetch()) {
    $text = "Upcoming Event: " . $row['title'] . " from " . $row['event_from'] . " to " . $row['event_to'] . ". Details: " . strip_tags($row['details']);
    $chunks[] = ['id' => 'event_' . $row['id'], 'text' => $text];
}

// Broadcasts
$stmt = $pdo->query("SELECT id, title, message FROM broadcasts ORDER BY created_at DESC LIMIT 10");
while ($row = $stmt->fetch()) {
    $text = "Broadcast Message: " . $row['title'] . ". Message: " . strip_tags($row['message']);
    $chunks[] = ['id' => 'broadcast_' . $row['id'], 'text' => $text];
}

// Weekly Notices
$stmt = $pdo->query("SELECT id, release_date, notices_json FROM weekly_notices ORDER BY release_date DESC LIMIT 5");
while ($row = $stmt->fetch()) {
    $text = "Weekly Notice (" . $row['release_date'] . "): " . strip_tags($row['notices_json']);
    $chunks[] = ['id' => 'notice_' . $row['id'], 'text' => $text];
}

// Speaking Arrangements
$stmt = $pdo->query("SELECT id, sub_section, event_date, details FROM speaking_arrangements ORDER BY event_date DESC LIMIT 10");
while ($row = $stmt->fetch()) {
    $text = "Speaking Arrangement (" . $row['sub_section'] . ") on " . $row['event_date'] . ": " . strip_tags($row['details']);
    $chunks[] = ['id' => 'speaking_' . $row['id'], 'text' => $text];
}

// STATIC FRONTEND FILE SCRAPER (Web Scraper)
$frontendDirs = [
    realpath(__DIR__ . '/../frontend/app'),
    realpath(__DIR__ . '/../frontend/out')
];

$staticChunkId = 0;
foreach ($frontendDirs as $dir) {
    if (!$dir || !is_dir($dir)) continue;
    
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS));
    foreach ($iterator as $file) {
        if ($file->isFile() && in_array($file->getExtension(), ['js', 'jsx', 'ts', 'tsx', 'html'])) {
            $content = file_get_contents($file->getPathname());
            
            // Strip React code and HTML tags to get pure English text
            $cleanContent = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', "", $content);
            $cleanContent = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', "", $cleanContent);
            $cleanContent = preg_replace('/import.*?;/s', '', $cleanContent);
            $cleanContent = preg_replace('/export default function.*?\(/', '', $cleanContent);
            $cleanContent = preg_replace('/const\s+\w+\s*=\s*(?:\[[^\]]*\]|\{[^\}]*\})/', '', $cleanContent);
            $cleanContent = preg_replace('/<[^>]+>/', ' ', $cleanContent);
            $cleanContent = preg_replace('/\{[^\}]*\}/', ' ', $cleanContent);
            $cleanContent = preg_replace('/\s+/', ' ', $cleanContent);
            $cleanContent = trim($cleanContent);
            
            if (strlen($cleanContent) > 50) {
                // Break into 500-character chunks with semantic overlap
                $sentences = preg_split('/(?<=[.?!])\s+/', $cleanContent);
                $currentChunk = '';
                
                foreach ($sentences as $sentence) {
                    if (strlen($currentChunk) + strlen($sentence) > 500) {
                        if (strlen(trim($currentChunk)) > 20) {
                            $chunks[] = ['id' => 'static_chunk_' . $staticChunkId++, 'text' => "Website Info: " . trim($currentChunk)];
                        }
                        $currentChunk = $sentence . ' '; // Reset for next chunk
                    } else {
                        $currentChunk .= $sentence . ' ';
                    }
                }
                if (strlen(trim($currentChunk)) > 20) {
                    $chunks[] = ['id' => 'static_chunk_' . $staticChunkId++, 'text' => "Website Info: " . trim($currentChunk)];
                }
            }
        }
    }
}

// 2. Convert and Upload
$vectorsToUpload = [];
$successCount = 0;

echo "Found " . count($chunks) . " chunks to sync.\n";

foreach ($chunks as $index => $chunk) {
    $embedding = getEmbedding($chunk['text'], $geminiKey);
    if ($embedding) {
        $vectorsToUpload[] = [
            "id" => (string)$chunk['id'],
            "values" => $embedding,
            "metadata" => [
                "text" => $chunk['text'] // Storing the actual text so we can retrieve it in chat
            ]
        ];
        
        // Batch upload every 10 items to prevent huge payloads
        if (count($vectorsToUpload) >= 10 || $index === count($chunks) - 1) {
            if (upsertToPinecone($vectorsToUpload, $pineconeKey, $pineconeHost)) {
                $successCount += count($vectorsToUpload);
                echo "Successfully upserted " . count($vectorsToUpload) . " vectors.\n";
            } else {
                echo "Failed to upsert a batch.\n";
            }
            $vectorsToUpload = []; // Reset batch
        }
    } else {
        echo "Failed to generate embedding for chunk ID: " . $chunk['id'] . "\n";
    }
    
    // Sleep briefly to respect free tier rate limits (1500 RPM is generous, but safe is better)
    usleep(200000); // 200ms
}

echo "\nSync Complete! $successCount / " . count($chunks) . " successfully embedded and synced to Pinecone.\n";
?>
