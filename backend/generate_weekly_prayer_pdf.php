<?php

declare(strict_types=1);

/**
 * Saturday Evening Automated Weekly Prayer Requests PDF Generator & Dispatcher.
 *
 * Can be executed via:
 * 1. CLI / Hostinger Cron Job:
 *    php /path/to/generate_weekly_prayer_pdf.php
 *    php /path/to/generate_weekly_prayer_pdf.php --force
 *
 * 2. HTTP Webhook / GitHub Action:
 *    GET/POST https://unionchurch.in/backend/generate_weekly_prayer_pdf.php?key=YOUR_CRON_SECRET&force=1
 */

// Load environment variables if available
if (file_exists(__DIR__ . '/env.php')) {
    require_once __DIR__ . '/env.php';
}

// 1. Timezone Configuration (Explicitly Asia/Kolkata for Bhubaneswar, India)
$churchTimezone = getenv('TIMEZONE') ?: ($_ENV['TIMEZONE'] ?? 'Asia/Kolkata');
date_default_timezone_set($churchTimezone);

require_once __DIR__ . '/services/PrayerStorageService.php';
require_once __DIR__ . '/services/PrayerPdfGenerator.php';
require_once __DIR__ . '/services/PrayerMailService.php';

$isCli = (php_sapi_name() === 'cli');

// 2. Authentication for Webhook / HTTP invocation
$cronSecret = getenv('CRON_SECRET') ?: ($_ENV['CRON_SECRET'] ?? '');

if (!$isCli) {
    header('Content-Type: application/json; charset=UTF-8');

    $providedKey = $_GET['key'] ?? ($_SERVER['HTTP_X_CRON_KEY'] ?? '');
    if (!empty($cronSecret) && !hash_equals($cronSecret, (string)$providedKey)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Forbidden. Invalid or missing CRON_SECRET key.']);
        exit;
    }
}

// 3. Force Flag (for testing or manual triggering anytime)
$forceRun = false;
if ($isCli) {
    global $argv;
    if (isset($argv) && in_array('--force', $argv, true)) {
        $forceRun = true;
    }
} else {
    if (!empty($_GET['force']) && $_GET['force'] === '1' || $_GET['force'] === 'true') {
        $forceRun = true;
    }
}

// 4. Verify Saturday Evening Window (unless forced)
$now = new DateTime('now', new DateTimeZone($churchTimezone));
$dayOfWeek = (int)$now->format('w'); // 0 = Sunday, 6 = Saturday
$currentHour = (int)$now->format('G'); // 0 to 23

// Saturday is day 6. Configurable start hour (default: 18 = 6:00 PM IST onwards)
$scheduledHour = (int)(getenv('SATURDAY_CRON_HOUR') ?: ($_ENV['SATURDAY_CRON_HOUR'] ?? 18));

if (!$forceRun) {
    if ($dayOfWeek !== 6) {
        $msg = "Skipped: Today is " . $now->format('l') . ". Weekly PDF generation runs automatically every Saturday evening (or use --force / ?force=1).";
        if ($isCli) {
            echo $msg . "\n";
            exit(0);
        } else {
            echo json_encode(['success' => false, 'message' => $msg]);
            exit(0);
        }
    }

    if ($currentHour < $scheduledHour) {
        $msg = "Skipped: Current hour is " . $currentHour . ":00. Saturday generation scheduled for " . $scheduledHour . ":00 onwards (or use --force / ?force=1).";
        if ($isCli) {
            echo $msg . "\n";
            exit(0);
        } else {
            echo json_encode(['success' => false, 'message' => $msg]);
            exit(0);
        }
    }
}

try {
    // 5. Calculate Weekly Date Window (Sunday to Saturday)
    // If today is Saturday, period_end is today, and period_start was 6 days ago (Sunday).
    // If running on a different day with force, align to most recent completed Saturday or current day.
    if ($dayOfWeek === 6) {
        $periodEndDate = $now->format('Y-m-d');
        $periodStartDate = (clone $now)->modify('-6 days')->format('Y-m-d');
    } else {
        // Find previous Saturday
        $lastSaturday = (clone $now)->modify('last saturday');
        $periodEndDate = $lastSaturday->format('Y-m-d');
        $periodStartDate = (clone $lastSaturday)->modify('-6 days')->format('Y-m-d');
    }

    $filename = "weekly-prayer-requests-{$periodEndDate}.pdf";
    $outputDir = __DIR__ . '/uploads/prayer_reports';
    if (!is_dir($outputDir)) {
        mkdir($outputDir, 0755, true);
    }
    $outputPath = $outputDir . '/' . $filename;

    // 6. Retrieve Requests for this Weekly Window
    $storage = new PrayerStorageService();
    $requests = $storage->getUnprocessedRequests($periodStartDate, $periodEndDate);

    // 7. Generate PDF
    $pdfGenerator = new PrayerPdfGenerator();
    $generatedPath = $pdfGenerator->generateWeeklyPdf(
        $requests,
        $periodStartDate,
        $periodEndDate,
        $outputPath
    );

    // 8. Deliver PDF to Church Email
    $mailService = new PrayerMailService();
    $emailSent = $mailService->sendWeeklyCompilation(
        $periodStartDate,
        $periodEndDate,
        $generatedPath,
        count($requests)
    );

    // 9. Mark Requests Processed and Record Report
    $requestIds = array_column($requests, 'id');
    if (!empty($requestIds)) {
        $storage->markRequestsProcessed($requestIds);
    }

    $reportId = $storage->recordWeeklyReport(
        $periodStartDate,
        $periodEndDate,
        $filename,
        $outputPath,
        count($requests),
        $emailSent
    );

    $result = [
        'success' => true,
        'message' => 'Saturday weekly prayer PDF generated and processed successfully.',
        'period_start' => $periodStartDate,
        'period_end' => $periodEndDate,
        'pdf_filename' => $filename,
        'pdf_path' => $outputPath,
        'requests_count' => count($requests),
        'email_sent' => $emailSent,
        'report_id' => $reportId,
        'timestamp' => $now->format('Y-m-d H:i:s T')
    ];

    if ($isCli) {
        echo "[SUCCESS] " . $result['message'] . "\n";
        echo "  Period: {$periodStartDate} to {$periodEndDate}\n";
        echo "  Filename: {$filename}\n";
        echo "  Total Requests: " . count($requests) . "\n";
        echo "  Email Dispatched: " . ($emailSent ? 'Yes' : 'No (Local / MTA)') . "\n";
    } else {
        echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
} catch (Throwable $e) {
    error_log("Weekly Prayer PDF generation failure: " . $e->getMessage());

    if ($isCli) {
        fwrite(STDERR, "[ERROR] " . $e->getMessage() . "\n");
        exit(1);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Weekly PDF generation failed: ' . $e->getMessage()
        ]);
        exit(1);
    }
}
