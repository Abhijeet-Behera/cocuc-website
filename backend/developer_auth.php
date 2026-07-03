<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_config.php';
require_once 'jwt_helper.php';

// Include PHPMailer
require 'libs/PHPMailer/src/Exception.php';
require 'libs/PHPMailer/src/PHPMailer.php';
require 'libs/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents("php://input"), true);

$allowed_emails_str = $_ENV['ALLOWED_DEVELOPER_EMAILS'] ?? '';
$allowed_emails = array_map('trim', explode(',', $allowed_emails_str));

function logAttempt($pdo, $email, $status) {
    $ip = getClientIP();
    $stmt = $pdo->prepare("INSERT INTO developer_login_logs (email, ip_address, status) VALUES (?, ?, ?)");
    $stmt->execute([$email, $ip, $status]);
}

if ($action === 'verify_credentials') {
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    // Verify reCAPTCHA
    $recaptchaToken = $data['recaptcha_token'] ?? '';
    if (!$recaptchaToken) {
        http_response_code(400);
        echo json_encode(["error" => "Missing reCAPTCHA token"]);
        exit;
    }
    $secretKey = $_ENV['RECAPTCHA_SECRET_KEY'] ?? '';
    $verifyResponse = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$recaptchaToken}");
    $responseData = json_decode($verifyResponse);
    if (!$responseData->success) {
        http_response_code(403);
        echo json_encode(["error" => "reCAPTCHA verification failed. Please try again."]);
        exit;
    }

    if (!in_array($email, $allowed_emails)) {
        http_response_code(403);
        echo json_encode(["error" => "This email is not registered for developer access."]);
        exit;
    }

    $stmt = $pdo->query("SELECT setting_value FROM developer_settings WHERE setting_key = 'developer_common_password'");
    $setting = $stmt->fetch();

    if (!$setting || !password_verify($password, $setting['setting_value'])) {
        logAttempt($pdo, $email, "Failed (Wrong Password)");
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials."]);
        exit;
    }

    // Generate 6-digit OTP
    $otp = sprintf("%06d", mt_rand(1, 999999));
    $hashed_otp = password_hash($otp, PASSWORD_DEFAULT);
    $expires_at = date('Y-m-d H:i:s', strtotime('+5 minutes'));

    // Store in DB
    $stmt = $pdo->prepare("INSERT INTO developer_otps (email, hashed_otp, expires_at) VALUES (?, ?, ?)");
    $stmt->execute([$email, $hashed_otp, $expires_at]);

    // Send email via PHPMailer
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['SMTP_USER'] ?? 'cocbhubaneswar@gmail.com';
        $mail->Password   = $_ENV['SMTP_PASS'] ?? '';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        $mail->setFrom($mail->Username, 'Developer Auth System');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'Your Developer Login OTP';
        $mail->Body    = "Your OTP for developer access is: <strong>{$otp}</strong>. It expires in 5 minutes.";

        $mail->send();
        echo json_encode(["message" => "OTP sent successfully."]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to send OTP. Mailer Error: {$mail->ErrorInfo}"]);
    }
} elseif ($action === 'verify_otp') {
    $email = $data['email'] ?? '';
    $otp = $data['otp'] ?? '';

    if (!in_array($email, $allowed_emails)) {
        http_response_code(403);
        echo json_encode(["error" => "This email is not registered."]);
        exit;
    }

    // Fetch the latest OTP for this email
    $stmt = $pdo->prepare("SELECT id, hashed_otp, expires_at FROM developer_otps WHERE email = ? ORDER BY created_at DESC LIMIT 1");
    $stmt->execute([$email]);
    $record = $stmt->fetch();

    if ($record) {
        if (strtotime($record['expires_at']) < time()) {
            logAttempt($pdo, $email, "Failed (Expired OTP)");
            http_response_code(401);
            echo json_encode(["error" => "OTP has expired."]);
            exit;
        }

        if (password_verify($otp, $record['hashed_otp'])) {
            // Success
            $pdo->prepare("DELETE FROM developer_otps WHERE email = ?")->execute([$email]);
            logAttempt($pdo, $email, "Success");

            // Generate JWT (Assuming id = 999 for developers since they aren't strictly in users table anymore)
            $payload = [
                'id' => 999,
                'email' => $email,
                'full_name' => 'Developer',
                'designation' => 'Developer'
            ];
            $token = generateJWT($payload, JWT_SECRET);
            
            echo json_encode(["message" => "Login successful", "token" => $token, "user" => $payload]);
        } else {
            logAttempt($pdo, $email, "Failed (Invalid OTP)");
            http_response_code(401);
            echo json_encode(["error" => "Invalid OTP."]);
        }
    } else {
        logAttempt($pdo, $email, "Failed (No OTP Record)");
        http_response_code(401);
        echo json_encode(["error" => "No OTP requested or expired."]);
    }
} else {
    http_response_code(404);
    echo json_encode(["error" => "Invalid action"]);
}
?>
