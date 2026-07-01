<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain");

require_once 'db_config.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        donation_reference VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        mobile_number VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        category VARCHAR(100) NOT NULL,
        custom_category VARCHAR(255),
        intended_amount DECIMAL(10, 2) NOT NULL,
        message TEXT,
        payment_mode ENUM('upi', 'neft_rtgs') DEFAULT NULL,
        transaction_id VARCHAR(100),
        payment_date DATE,
        paid_amount DECIMAL(10, 2),
        status ENUM('pending_payment', 'payment_details_submitted', 'verified') DEFAULT 'pending_payment',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    $pdo->exec($sql);
    echo "Successfully created or verified 'donations' table.\n";
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
