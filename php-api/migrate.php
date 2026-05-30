<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain");

require_once 'db_config.php';

try {
    // Check if status column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM users LIKE 'status'");
    if ($stmt->rowCount() == 0) {
        $pdo->exec("ALTER TABLE users ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'");
        echo "Successfully added 'status' column to users table.\n";
        
        // Auto-approve the first Developer account (assuming it's ID 1 or designation = Developer)
        $pdo->exec("UPDATE users SET status = 'approved' WHERE designation = 'Developer'");
        echo "Auto-approved existing Developer accounts.\n";
    } else {
        echo "Database already up to date.\n";
    }
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
?>
