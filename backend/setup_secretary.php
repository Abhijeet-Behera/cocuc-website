<?php
require_once 'db_config.php';

$message = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';

    if (!$password) {
        $message = "<p style='color:red;'>Please enter a password.</p>";
    } else {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $email = 'secretary@unionchurch.in';

        try {
            $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $check->execute([$email]);
            $existingUser = $check->fetch(PDO::FETCH_ASSOC);

            if ($existingUser) {
                $stmt = $pdo->prepare("
        UPDATE users 
        SET full_name = ?, designation = ?, password_hash = ?
        WHERE email = ?
    ");
                $stmt->execute(['Secretary', 'Secretary', $hashedPassword, $email]);
            } else {
                $stmt = $pdo->prepare("
        INSERT INTO users (full_name, designation, email, password_hash) 
        VALUES (?, ?, ?, ?)
    ");
                $stmt->execute(['Secretary', 'Secretary', $email, $hashedPassword]);
            }

            $message = "<div style='color:green;'>
                            <h2>Success!</h2>
                            <p>The Secretary account has been successfully created in the live database.</p>
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
    <h2>Secretary Password Setup</h2>
    <p>This script will hardcode the Secretary account (`secretary@unionchurch.in`) into the database.</p>
    <?= $message ?>
    <?php if (!str_contains($message, "Success")): ?>
        <form method="POST">
            <label>Enter the exact password you want to use for the Secretary:</label><br><br>
            <input type="text" name="password" required style="padding: 10px; width: 300px;"><br><br>
            <button type="submit"
                style="padding: 10px 20px; background: #800000; color: white; border: none; cursor: pointer; border-radius: 8px;">Set
                Secretary Password</button>
        </form>
    <?php endif; ?>
</body>

</html>