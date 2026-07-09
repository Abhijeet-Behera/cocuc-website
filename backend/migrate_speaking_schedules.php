<?php
/**
 * Migration: Create speaking_schedule_uploads and speaking_schedule_items tables
 * Run once: php migrate_speaking_schedules.php
 */
require_once __DIR__ . '/db_config.php';

try {
    // Table 1: Upload records (one per PDF upload)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS speaking_schedule_uploads (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sub_section VARCHAR(50) NOT NULL,
            title VARCHAR(255),
            pdf_file VARCHAR(255),
            period_start DATE,
            period_end DATE,
            status ENUM('draft','published') DEFAULT 'draft',
            meta_json JSON,
            uploaded_by INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_sub_status (sub_section, status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    echo "✓ Created table: speaking_schedule_uploads\n";

    // Table 2: Individual schedule rows extracted from PDFs
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS speaking_schedule_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            upload_id INT NOT NULL,
            sub_section VARCHAR(50) NOT NULL,
            schedule_date DATE NOT NULL,
            month_label VARCHAR(50),
            day_name VARCHAR(20),
            data_json JSON NOT NULL,
            sort_order INT DEFAULT 0,
            is_published TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (upload_id) REFERENCES speaking_schedule_uploads(id) ON DELETE CASCADE,
            INDEX idx_sub_date (sub_section, schedule_date),
            INDEX idx_published (is_published, sub_section, schedule_date)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    echo "✓ Created table: speaking_schedule_items\n";
    echo "\nMigration completed successfully!\n";

} catch (PDOException $e) {
    echo "✗ Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
