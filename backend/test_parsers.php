<?php
/**
 * Test PDF parsers against sample files
 */
require_once __DIR__ . '/speaking_schedule_parsers.php';

$files = [
    'Sunday Worship' => [
        'path' => 'c:\\Users\\beher\\Downloads\\SPEAKING ARRANGMENT\\Sunday Worship Schedule.pdf',
        'func' => 'parseSundayWorshipPdf'
    ],
    'Morning Prayer' => [
        'path' => 'c:\\Users\\beher\\Downloads\\SPEAKING ARRANGMENT\\Morning Prayer List.pdf',
        'func' => 'parseMorningPrayerPdf'
    ],
    'Monday Prayer' => [
        'path' => 'c:\\Users\\beher\\Downloads\\SPEAKING ARRANGMENT\\Monday Prayer List.pdf',
        'func' => 'parseMondayPrayerPdf'
    ],
    'Wednesday Bible Study' => [
        'path' => 'c:\\Users\\beher\\Downloads\\SPEAKING ARRANGMENT\\WEDNESDAY BIBLE STUDY.pdf',
        'func' => 'parseWednesdayBibleStudyPdf'
    ],
    'Evening Zoom Prayer' => [
        'path' => 'c:\\Users\\beher\\Downloads\\SPEAKING ARRANGMENT\\Zoom Prayer_July 2026.pdf',
        'func' => 'parseEveningZoomPrayerPdf'
    ]
];

foreach ($files as $name => $info) {
    echo "\n=== Testing parser: $name ===\n";
    $func = $info['func'];
    try {
        $result = $func($info['path']);
        if ($result === null) {
            echo "✗ Failed to parse (returned null)\n";
        } else {
            echo "✓ Sub-section: " . $result['sub_section'] . "\n";
            echo "✓ Period: " . $result['period_start'] . " to " . $result['period_end'] . "\n";
            echo "✓ Items count: " . count($result['items']) . "\n";
            echo "✓ Sample items:\n";
            print_r(array_slice($result['items'], 0, 2));
            echo "✓ Meta Info:\n";
            print_r($result['meta_json']);
        }
    } catch (Exception $e) {
        echo "✗ Exception: " . $e->getMessage() . "\n";
        echo $e->getTraceAsString() . "\n";
    }
}
?>
