<?php
require 'db_config.php';
try {
    $pdo->exec("ALTER TABLE blogs ADD COLUMN custom_author VARCHAR(255) DEFAULT 'Pastor'");
    echo 'Success';
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
