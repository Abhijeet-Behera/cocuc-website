<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain; charset=UTF-8");

require_once __DIR__ . '/db_config.php';

try {
    $sql = "
    CREATE TABLE IF NOT EXISTS prayer_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NULL,
        phone VARCHAR(50) NULL,
        category VARCHAR(150) NOT NULL,
        zone_id INT NULL,
        locality VARCHAR(255) NULL,
        request TEXT NOT NULL,
        additional_info TEXT NULL,
        status ENUM('pending', 'processed', 'archived') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP NULL,
        INDEX idx_status_created (status, created_at)
    );

    CREATE TABLE IF NOT EXISTS weekly_prayer_pdfs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        period_start DATE NOT NULL,
        period_end DATE NOT NULL,
        pdf_filename VARCHAR(255) NOT NULL,
        pdf_path VARCHAR(255) NOT NULL,
        request_count INT DEFAULT 0,
        email_sent TINYINT(1) DEFAULT 0,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ";

    $pdo->exec($sql);
    echo "Successfully created or verified 'prayer_requests' and 'weekly_prayer_pdfs' tables.\n";
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
