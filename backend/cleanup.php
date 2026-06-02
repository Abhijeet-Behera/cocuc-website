<?php
// cleanup.php
// This script deletes records and associated files that are older than 3 months.
// You can set this up as a Cron Job in Hostinger hPanel to run daily.

require_once 'db_config.php';

// Calculate the date 3 months ago
$threeMonthsAgo = date('Y-m-d H:i:s', strtotime('-3 months'));

try {
    $pdo->beginTransaction();

    // 1. Cleanup Announcements Media
    $stmt = $pdo->prepare("SELECT media_path FROM announcements WHERE created_at < ? AND media_path IS NOT NULL");
    $stmt->execute([$threeMonthsAgo]);
    $oldMedia = $stmt->fetchAll();

    foreach ($oldMedia as $media) {
        $filePath = ".." . $media['media_path'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }
    
    // Delete old announcements from DB
    $stmt = $pdo->prepare("DELETE FROM announcements WHERE created_at < ?");
    $stmt->execute([$threeMonthsAgo]);

    // 2. Cleanup Blogs Media
    $stmt = $pdo->prepare("SELECT thumbnail_path FROM blogs WHERE created_at < ? AND thumbnail_path IS NOT NULL");
    $stmt->execute([$threeMonthsAgo]);
    $oldBlogs = $stmt->fetchAll();

    foreach ($oldBlogs as $blog) {
        $filePath = ".." . $blog['thumbnail_path'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    // Delete old blogs from DB
    $stmt = $pdo->prepare("DELETE FROM blogs WHERE created_at < ?");
    $stmt->execute([$threeMonthsAgo]);

    // 3. Cleanup old broadcasts
    $stmt = $pdo->prepare("DELETE FROM broadcasts WHERE created_at < ?");
    $stmt->execute([$threeMonthsAgo]);

    $pdo->commit();
    
    echo json_encode(["message" => "Cleanup completed successfully."]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => "Cleanup failed: " . $e->getMessage()]);
}
?>
