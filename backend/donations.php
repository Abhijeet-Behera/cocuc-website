<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db_config.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

if ($method === 'POST') {
    $action = $data['action'] ?? '';

    if ($action === 'intent') {
        // Create donation intent
        $fullName = trim($data['fullName'] ?? '');
        $mobileNumber = trim($data['mobileNumber'] ?? '');
        $email = trim($data['email'] ?? '');
        $category = trim($data['category'] ?? '');
        $customCategory = trim($data['customCategory'] ?? '');
        $amount = floatval($data['amount'] ?? 0);
        $message = trim($data['message'] ?? '');

        if (empty($fullName) || empty($mobileNumber) || empty($category) || $amount <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Required fields are missing or invalid."]);
            exit;
        }

        if ($category === 'Other' && empty($customCategory)) {
            http_response_code(400);
            echo json_encode(["error" => "Custom category is required when 'Other' is selected."]);
            exit;
        }

        // Generate a unique donation reference: DON-YYYYMMDD-XXXXXX
        $reference = 'DON-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

        try {
            $stmt = $pdo->prepare("INSERT INTO donations (donation_reference, full_name, mobile_number, email, category, custom_category, intended_amount, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending_payment')");
            $stmt->execute([$reference, $fullName, $mobileNumber, $email, $category, $customCategory, $amount, $message]);

            echo json_encode([
                "success" => true,
                "donationReference" => $reference,
                "status" => "pending_payment"
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create donation intent: " . $e->getMessage()]);
        }
    } elseif ($action === 'confirm') {
        // Confirm payment details
        $reference = trim($data['donationReference'] ?? '');
        $transactionId = trim($data['transactionId'] ?? '');
        $paymentDate = trim($data['paymentDate'] ?? date('Y-m-d'));
        $paidAmount = floatval($data['paidAmount'] ?? 0);
        $paymentMode = trim($data['paymentMode'] ?? '');

        if (empty($reference) || empty($transactionId) || $paidAmount <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "Required fields are missing or invalid."]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE donations SET transaction_id = ?, payment_date = ?, paid_amount = ?, payment_mode = ?, status = 'payment_details_submitted' WHERE donation_reference = ?");
            $stmt->execute([$transactionId, $paymentDate, $paidAmount, $paymentMode, $reference]);

            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    "success" => true,
                    "message" => "Payment details received and are under verification."
                ]);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Donation reference not found."]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update payment details: " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Invalid action."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
}
?>
