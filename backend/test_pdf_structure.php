<?php
require_once __DIR__ . '/libs/PdfParser/autoload.php';

$parser = new \Smalot\PdfParser\Parser();

$files = [
    'Sunday' => 'c:\\Users\\beher\\Downloads\\SPEAKING ARRANGMENT\\Sunday Worship Schedule.pdf',
    'Morning' => 'c:\\Users\\beher\\Downloads\\SPEAKING ARRANGMENT\\Morning Prayer List.pdf',
    'Monday' => 'c:\\Users\\beher\\Downloads\\SPEAKING ARRANGMENT\\Monday Prayer List.pdf',
    'Wednesday' => 'c:\\Users\\beher\\Downloads\\SPEAKING ARRANGMENT\\WEDNESDAY BIBLE STUDY.pdf',
    'Evening' => 'c:\\Users\\beher\\Downloads\\SPEAKING ARRANGMENT\\Zoom Prayer_July 2026.pdf'
];

foreach ($files as $name => $path) {
    echo "==================== $name ====================\n";
    $pdf = $parser->parseFile($path);
    $text = $pdf->getText();
    $lines = explode("\n", $text);
    foreach ($lines as $i => $line) {
        if (preg_match('/\d{2}\.\d{2}\.\d{4}/', $line)) {
            echo "Line $i: " . trim($line) . "\n";
        }
    }
}
?>
