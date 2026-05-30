<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db_config.php';
require_once 'jwt_helper.php';

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents("php://input"), true);

if ($action === 'register') {
    $fullName = $data['full_name'] ?? '';
    $designation = $data['designation'] ?? ''; // Pastor, Secretary, Developer
    $email = $data['email'] ?? '';
    $mobile = $data['mobile'] ?? '';
    $password = $data['password'] ?? '';

    if (!$fullName || !$designation || !$password || (!$email && !$mobile)) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare("INSERT INTO users (full_name, designation, email, mobile, password_hash) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$fullName, $designation, $email ?: null, $mobile ?: null, $hashedPassword]);
        echo json_encode(["message" => "Registration successful"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Email or mobile may already exist"]);
    }
} elseif ($action === 'login') {
    $identifier = $data['identifier'] ?? ''; // Can be email or mobile
    $password = $data['password'] ?? '';

    if (!$identifier || !$password) {
        http_response_code(400);
        echo json_encode(["error" => "Missing identifier or password"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? OR mobile = ?");
    $stmt->execute([$identifier, $identifier]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        // Security Check: Ensure account is approved
        if (isset($user['status']) && $user['status'] === 'pending') {
            http_response_code(403);
            echo json_encode(["error" => "Your account is pending verification by a Developer."]);
            exit;
        }
        if (isset($user['status']) && $user['status'] === 'rejected') {
            http_response_code(403);
            echo json_encode(["error" => "Your registration was rejected."]);
            exit;
        }

        $payload = [
            'id' => $user['id'],
            'full_name' => $user['full_name'],
            'designation' => $user['designation']
        ];
        $token = generateJWT($payload, JWT_SECRET);
        
        // Remove password hash from response
        unset($user['password_hash']);
        
        echo json_encode(["message" => "Login successful", "token" => $token, "user" => $user]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["error" => "Invalid action"]);
}
?>
