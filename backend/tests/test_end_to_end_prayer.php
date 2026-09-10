<?php

declare(strict_types=1);

require_once __DIR__ . '/../services/PrayerStorageService.php';
require_once __DIR__ . '/../services/PrayerPdfGenerator.php';
require_once __DIR__ . '/../services/PrayerMailService.php';

echo "=========================================================\n";
echo " CHURCH OF CHRIST (UNION CHURCH) - PRAYER SYSTEM TEST\n";
echo "=========================================================\n\n";

$storage = new PrayerStorageService();
$pdfGen = new PrayerPdfGenerator();
$mailer = new PrayerMailService();

$passed = 0;
$failed = 0;

$assertTest = function(bool $condition, string $testName) use (&$passed, &$failed) {
    if ($condition) {
        echo "  [PASS] " . $testName . "\n";
        $passed++;
    } else {
        echo "  [FAIL] " . $testName . "\n";
        $failed++;
    }
};

// ---------------------------------------------------------
// TEST 1: Form Validation & Field Sanitization
// ---------------------------------------------------------
echo "TEST 1: Input Validation & Sanitization\n";

$rawSubmission = [
    'name' => '  Barnabas Nayak  <b>(Elder)</b>',
    'email' => 'barnabas.nayak@example.com',
    'phone' => '+91 94371-23456',
    'category' => 'Bethesda Zone (Zone #1)',
    'zone_id' => 1,
    'locality' => 'Unit-2, Bapuji Nagar',
    'request' => 'Please hold our family in prayer as we navigate medical challenges with faith and hope.',
    'additional_info' => 'Contact via WhatsApp preferred.'
];

// Clean like API does
$cleaned = [
    'name' => trim(strip_tags($rawSubmission['name'])),
    'email' => trim(filter_var($rawSubmission['email'], FILTER_SANITIZE_EMAIL)),
    'phone' => trim(preg_replace('/[^\d\s+\-()]/', '', $rawSubmission['phone'])),
    'category' => trim(strip_tags($rawSubmission['category'])),
    'zone_id' => $rawSubmission['zone_id'],
    'locality' => trim(strip_tags($rawSubmission['locality'])),
    'request' => trim(strip_tags($rawSubmission['request'])),
    'additional_info' => trim(strip_tags($rawSubmission['additional_info'])),
];

$assertTest($cleaned['name'] === 'Barnabas Nayak  (Elder)', 'HTML tags stripped on name');
$assertTest($cleaned['email'] === 'barnabas.nayak@example.com', 'Email sanitized properly');
$assertTest(strlen($cleaned['request']) >= 5, 'Prayer request length validated');

// ---------------------------------------------------------
// TEST 2: Storage Persistence (Save & Retrieve)
// ---------------------------------------------------------
echo "\nTEST 2: Storage Persistence & Storage Service\n";

$saved = $storage->saveRequest($cleaned);
$assertTest(!empty($saved['id']), 'Record assigned an ID: #' . ($saved['id'] ?? 'none'));
$assertTest($saved['status'] === 'pending', 'Initial status is pending');

// Add a second request for multiple requests test
$saved2 = $storage->saveRequest([
    'name' => 'Sister Anita Das',
    'email' => 'anita.das@example.com',
    'phone' => '9937001122',
    'category' => 'Hebron Zone (Zone #4)',
    'zone_id' => 4,
    'locality' => 'IRC Village, Nayapalli',
    'request' => 'Praying for divine healing for our grandmother admitted at hospital and thanksgiving for church support.',
    'additional_info' => '',
]);
$assertTest(!empty($saved2['id']), 'Second record saved with ID: #' . ($saved2['id'] ?? 'none'));

// ---------------------------------------------------------
// TEST 3: Individual Email Notification Formatting
// ---------------------------------------------------------
echo "\nTEST 3: Individual Email Routing Format\n";

$mailResult = $mailer->sendIndividualNotification($saved);
$assertTest(is_bool($mailResult), 'sendIndividualNotification executed without uncaught exception');

// ---------------------------------------------------------
// TEST 4: Saturday Weekly Window Retrieval & PDF Generation
// ---------------------------------------------------------
echo "\nTEST 4: Saturday Weekly Retrieval & PDF Generation\n";

$startDate = date('Y-m-d', strtotime('-6 days'));
$endDate = date('Y-m-d');
$pending = $storage->getUnprocessedRequests($startDate, $endDate);

$assertTest(count($pending) >= 2, 'Retrieved at least 2 pending requests for the weekly window (Found ' . count($pending) . ')');

$testPdfFilename = "weekly-prayer-requests-{$endDate}.pdf";
$testPdfPath = __DIR__ . "/../uploads/prayer_reports/{$testPdfFilename}";

$pdfGenerated = $pdfGen->generateWeeklyPdf($pending, $startDate, $endDate, $testPdfPath);
$assertTest(file_exists($testPdfPath), 'Weekly PDF created on disk');
$assertTest(filesize($testPdfPath) > 5000, 'Weekly PDF size is valid (' . filesize($testPdfPath) . ' bytes)');

// ---------------------------------------------------------
// TEST 5: Weekly Deduplication & Processed State Marking
// ---------------------------------------------------------
echo "\nTEST 5: Deduplication Logic\n";

$idsToMark = array_column($pending, 'id');
$storage->markRequestsProcessed($idsToMark);

$remaining = $storage->getUnprocessedRequests($startDate, $endDate);
$assertTest(count($remaining) === 0, 'All processed requests marked - no duplicates retrieved on re-run');

// ---------------------------------------------------------
// TEST 6: Empty Week Generation
// ---------------------------------------------------------
echo "\nTEST 6: Graceful Empty Week Handling\n";

$emptyFilename = "weekly-prayer-requests-empty-test.pdf";
$emptyPath = __DIR__ . "/../uploads/prayer_reports/{$emptyFilename}";
$emptyResult = $pdfGen->generateWeeklyPdf([], $startDate, $endDate, $emptyPath);

$assertTest(file_exists($emptyPath), 'Empty period PDF created successfully');
$assertTest(filesize($emptyPath) > 1000, 'Empty period PDF has valid file size (' . filesize($emptyPath) . ' bytes)');

// ---------------------------------------------------------
// TEST 7: PDF Authoritative Content Data Verification
// ---------------------------------------------------------
echo "\nTEST 7: Authoritative PDF Content Data Verification\n";

$prayerDataFile = __DIR__ . '/../../frontend/data/prayerZonesData.js';
$fileContent = file_get_contents($prayerDataFile);

$assertTest(strpos($fileContent, 'Bethesda Zone') !== false, 'Zone 1: Bethesda Zone present');
$assertTest(strpos($fileContent, 'Ebenezer Zone') !== false, 'Zone 2: Ebenezer Zone present');
$assertTest(strpos($fileContent, 'Gethsemane Zone') !== false, 'Zone 3: Gethsemane Zone present');
$assertTest(strpos($fileContent, 'Hebron Zone') !== false, 'Zone 4: Hebron Zone present');
$assertTest(strpos($fileContent, 'Golgotha Zone') !== false, 'Zone 5: Golgotha Zone present');
$assertTest(strpos($fileContent, 'Sinai Zone') !== false, 'Zone 6: Sinai Zone present');
$assertTest(strpos($fileContent, 'Bethel Zone') !== false, 'Zone 7: Bethel Zone present');
$assertTest(strpos($fileContent, 'Emmaus Zone') !== false, 'Zone 8: Emmaus Zone present');
$assertTest(strpos($fileContent, 'Bethany Zone') !== false, 'Zone 9: Bethany Zone present');
$assertTest(strpos($fileContent, 'Sophia Zone') !== false, 'Zone 10: Sophia Zone present');
$assertTest(strpos($fileContent, 'Horeb Zone') !== false, 'Zone 11: Horeb Zone present');
$assertTest(strpos($fileContent, 'Mizpah Zone') !== false, 'Zone 12: Mizpah Zone present');
$assertTest(strpos($fileContent, 'Hermon Zone') !== false, 'Zone 13: Hermon Zone present');
$assertTest(strpos($fileContent, 'Nazareth Zone') !== false, 'Zone 14: Nazareth Zone present');
$assertTest(strpos($fileContent, 'Zion Zone') !== false, 'Zone 15: Zion Zone present');
$assertTest(strpos($fileContent, 'Elim Zone') !== false, 'Zone 16: Elim Zone present');

// Verify Hermon Zone only has Mr. Sandeep Mohanty (94373 53081) from the new PDF
$assertTest(strpos($fileContent, 'Mr. Sandeep Mohanty') !== false, 'Hermon Zone coordinator Mr. Sandeep Mohanty verified');
$assertTest(strpos($fileContent, 'Mr. Jitendra Jena') === false, 'Outdated coordinator Mr. Jitendra Jena removed');

echo "\n=========================================================\n";
echo " TEST SUMMARY: {$passed} Passed, {$failed} Failed\n";
echo "=========================================================\n";

exit($failed === 0 ? 0 : 1);
