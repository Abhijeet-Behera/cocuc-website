<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_config.php';

$message = "";

// Ensure developer_settings table exists
try {
    $pdo->query("CREATE TABLE IF NOT EXISTS developer_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value VARCHAR(255) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $password = $_POST['password'] ?? '';
    
    if (strlen($password) < 6) {
        $message = "<div style='color:red;'>Password must be at least 6 characters long.</div>";
    } else {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        try {
            $stmt = $pdo->prepare("INSERT INTO developer_settings (setting_key, setting_value) VALUES ('developer_common_password', ?) ON DUPLICATE KEY UPDATE setting_value = ?");
            $stmt->execute([$hashed_password, $hashed_password]);
            
            $message = "<div style='color:green;'><strong>Success!</strong> The common developer password has been securely hashed and stored.<br><br>
            <span style='color:red;'>CRITICAL SECURITY STEP: You MUST delete this `setup_dev_password.php` file from the server now.</span></div>";
        } catch (PDOException $e) {
            $message = "<div style='color:red;'>Database error: " . $e->getMessage() . "</div>";
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Developer Setup</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f9; padding: 40px; display: flex; justify-content: center; }
        .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 500px; }
        input[type=password] { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;}
        button { background: #0056b3; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #004494; }
    </style>
</head>
<body>
    <div class="card">
        <h2>Developer Access Setup</h2>
        <p>Set the common password for developer login. This password will be required along with the OTP.</p>
        <?php echo $message; ?>
        
        <?php if(strpos($message, "Success!") === false): ?>
        <form method="POST">
            <label>New Common Password:</label>
            <input type="password" name="password" required>
            <button type="submit">Set Password</button>
        </form>
        <?php endif; ?>
    </div>
</body>
</html>
