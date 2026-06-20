<?php
require_once 'db_config.php';

$message = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    
    if (!$password) {
        $message = "<p style='color:red;'>Please enter a password.</p>";
    } else {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $email = 'pastor@unionchurch.in';

        try {
            // Delete if exists to recreate
            $pdo->query("DELETE FROM users WHERE email = 'pastor@unionchurch.in'");
            
            $stmt = $pdo->prepare("INSERT INTO users (full_name, designation, email, password_hash) VALUES (?, ?, ?, ?)");
            $stmt->execute(['Pastor', 'Pastor', $email, $hashedPassword]);
            
            $message = "<div style='color:green;'>
                            <h2>Success!</h2>
                            <p>The Pastor account has been successfully created in the live database.</p>
                            <p>You can now go back to <b>/admin/login</b> and test it!</p>
                            <p><b>Please delete this file immediately after testing!</b></p>
                        </div>";
        } catch (PDOException $e) {
            $message = "<p style='color:red;'>Database error: " . $e->getMessage() . "</p>";
        }
    }
}
?>

<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; padding: 2rem;">
    <h2>Pastor Password Setup</h2>
    <?= $message ?>
    <?php if (!str_contains($message, "Success")): ?>
        <form method="POST">
            <label>Enter the exact password you want to use:</label><br><br>
            <input type="text" name="password" required style="padding: 10px; width: 300px;"><br><br>
            <button type="submit" style="padding: 10px 20px; background: maroon; color: white; border: none;">Set Password</button>
        </form>
    <?php endif; ?>
</body>
</html>
