-- SQL Schema for Church Website (Hostinger MySQL)
-- Run this in your Hostinger phpMyAdmin

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    designation ENUM('Pastor', 'Secretary', 'Developer') NOT NULL,
    email VARCHAR(255) UNIQUE,
    mobile VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image1_path VARCHAR(255),
    image2_path VARCHAR(255),
    pdf_path VARCHAR(255),
    author_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    media_type ENUM('image', 'video', 'none') DEFAULT 'none',
    media_path VARCHAR(255),
    author_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS broadcasts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    author_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS weekly_notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    release_date DATE NOT NULL,
    documents_json JSON,
    notices_json JSON,
    author_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS special_programmes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    upload_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    wing VARCHAR(100) NOT NULL,
    custom_wing VARCHAR(255),
    event_from DATE,
    event_to DATE,
    duration VARCHAR(50),
    details TEXT,
    document_path VARCHAR(255),
    author_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS speaking_arrangements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sub_section ENUM('Sunday Worships', 'Morning prayer', 'Monday Prayer', 'C.E Union', 'Wednesday Prayer', 'Zoom Prayer') NOT NULL,
    details TEXT,
    event_date DATE NOT NULL,
    attachment1_path VARCHAR(255),
    attachment2_path VARCHAR(255),
    attachment3_path VARCHAR(255),
    author_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS developer_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS developer_otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    hashed_otp VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS developer_login_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS developer_audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_table VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chatbot_rate_limits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL UNIQUE,
    message_count INT DEFAULT 0,
    first_message_time DATETIME NOT NULL,
    cooldown_until DATETIME NULL,
    spam_strikes INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS donations (
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
);

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    wing_id VARCHAR(100) NOT NULL,
    wing_name VARCHAR(150),
    description TEXT NOT NULL,
    word_count INT DEFAULT 0,
    folder_url VARCHAR(500) NOT NULL,
    folder_id VARCHAR(255) NOT NULL,
    images_json JSON,
    cover_image VARCHAR(500),
    event_date DATE,
    location VARCHAR(255),
    author_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_wing (wing_id)
);

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

