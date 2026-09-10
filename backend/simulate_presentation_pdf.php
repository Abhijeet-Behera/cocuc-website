<?php

declare(strict_types=1);

require_once __DIR__ . '/services/PrayerPdfGenerator.php';
require_once __DIR__ . '/services/PrayerStorageService.php';

$generator = new PrayerPdfGenerator();
$storage = new PrayerStorageService();

// Curated realistic church congregation petitions across different zones
$presentationRequests = [
    [
        'name' => 'Mrs. Bijaylakshmi Nayak',
        'email' => 'bijay.nayak@gmail.com',
        'phone' => '+91 94372 14214',
        'category' => 'Bethesda Zone (Zone #1)',
        'zone_id' => 1,
        'locality' => 'Unit-3, Kharavela Nagar near Master Canteen',
        'request' => "Praying for my elder sister undergoing critical cardiac bypass surgery at AIIMS next Monday. We ask the congregation to stand in agreement for guided hands of the surgical team, stabilization of vitals, zero postoperative complications, and complete spiritual peace for our family.",
        'additional_info' => 'Admitted in Cardiology ICU. Requesting pastors visit if permitted.',
        'created_at' => '2026-08-31 09:30:00'
    ],
    [
        'name' => 'Mr. Purnananda Pradhan',
        'email' => 'purnananda.p@outlook.com',
        'phone' => '+91 94392 63392',
        'category' => 'Hebron Zone (Zone #4)',
        'zone_id' => 4,
        'locality' => 'IRC Village, Sector 2, Nayapalli',
        'request' => "Please lift up our youth members preparing for the national civil services and engineering entrance exams this month. Pray for sharp memory, emotional calm, divine favor, and that they keep Christ at the center of all their aspirations.",
        'additional_info' => 'Hebron zone youth fellowship meeting this Saturday at 6 PM.',
        'created_at' => '2026-09-01 18:15:00'
    ],
    [
        'name' => 'Dr. Subhashree Mohapatra',
        'email' => 'subhashree.doc@yahoo.com',
        'phone' => '+91 94370 51610',
        'category' => 'Zion Zone (Zone #15)',
        'zone_id' => 15,
        'locality' => 'Mancheswar Railway Colony, Sector A',
        'request' => "Special thanksgiving to the Lord for miraculously saving our family during a highway vehicular breakdown without any injuries. We dedicate this week to praise and worship for God's protective angels over our travels.",
        'additional_info' => 'Thanksgiving offering will be shared during Sunday morning Odia service.',
        'created_at' => '2026-09-02 11:45:00'
    ],
    [
        'name' => 'Rev. Amos Chandra Pradhan',
        'email' => 'amos.pradhan@unionchurch.in',
        'phone' => '+91 94381 13974',
        'category' => 'Ebenezer Zone (Zone #2)',
        'zone_id' => 2,
        'locality' => 'Unit-4, MLA Colony & Old AG Colony',
        'request' => "Intercession for the homebound elderly widows and sick brethren in Ebenezer Zone who suffer from prolonged arthritic pain and seasonal illness. Pray that the Holy Spirit brings them comfort, spiritual companionship, and strength day by day.",
        'additional_info' => 'Pastoral home communion visits scheduled for this Thursday afternoon.',
        'created_at' => '2026-09-03 14:20:00'
    ],
    [
        'name' => 'Brother Sandeep Mohanty',
        'email' => 'sandeep.mohanty@gmail.com',
        'phone' => '+91 94373 53081',
        'category' => 'Hermon Zone (Zone #13)',
        'zone_id' => 13,
        'locality' => 'Kalinga Nagar, SUM Hospital Corridor',
        'request' => "Praying for new Christian families who have recently migrated to Kalinga Nagar and Ghatikia for IT/medical employment. Pray for open doors to connect them with our cottage prayer fellowships and satellite outreach.",
        'additional_info' => 'Hermon Zone prayer coordinator request.',
        'created_at' => '2026-09-04 16:50:00'
    ],
    [
        'name' => 'Sister Mita Sahu',
        'email' => 'mita.sahu@gmail.com',
        'phone' => '+91 93370 31389',
        'category' => 'Golgotha Zone (Zone #5)',
        'zone_id' => 5,
        'locality' => 'Satya Nagar / Vani Vihar corridor',
        'request' => "Earnest prayer for a young sister struggling with anxiety and depression after unexpected job loss. Pray for Jehovah Jireh to provide suitable employment and for restored peace and purpose in Christ.",
        'additional_info' => '',
        'created_at' => '2026-09-05 10:10:00'
    ]
];

// Generate PDF
$startDate = '2026-08-30';
$endDate = '2026-09-05';
$pdfFilename = "weekly-prayer-requests-{$endDate}-presentation.pdf";
$outputDir = __DIR__ . '/uploads/prayer_reports';
if (!is_dir($outputDir)) {
    mkdir($outputDir, 0755, true);
}
$outputPath = $outputDir . '/' . $pdfFilename;

$generatedPath = $generator->generateWeeklyPdf($presentationRequests, $startDate, $endDate, $outputPath);

// Also copy to frontend/public for web viewing
$publicDir = __DIR__ . '/../frontend/public';
if (is_dir($publicDir)) {
    copy($generatedPath, $publicDir . '/weekly-prayer-requests-sample.pdf');
}

// Copy to brain artifacts
$artifactsDir = 'C:/Users/NABNIT/.gemini/antigravity-ide/brain/e44119d6-0bcb-438f-bd01-81519bf54bfc';
if (is_dir($artifactsDir)) {
    copy($generatedPath, $artifactsDir . '/sample_church_prayer_requests.pdf');
}

echo "SUCCESS: Presentation PDF created at: {$generatedPath}\n";
echo "File size: " . filesize($generatedPath) . " bytes\n";
echo "Public web link copy: /weekly-prayer-requests-sample.pdf\n";
