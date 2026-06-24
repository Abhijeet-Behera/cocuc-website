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
