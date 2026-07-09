<?php
/**
 * One-time seed script: Insert 3 demo Special Programme records.
 * Run once via CLI:  php seed_demo_programmes.php
 * Or via browser:    http://yourserver/api/seed_demo_programmes.php
 *
 * Duplicate-safe: checks by title before inserting.
 * Safe to delete after use.
 */

header('Content-Type: application/json');

require_once __DIR__ . '/db_config.php';

$demos = [
    [
        'title'       => 'Youth Fellowship Retreat 2026',
        'wing'        => 'Youth Fellowship',
        'custom_wing' => '',
        'event_from'  => '2026-07-12',
        'event_to'    => '2026-07-14',
        'duration'    => '3 Days',
        'details'     => 'A spiritual retreat for young members focusing on fellowship, prayer, Bible study, leadership, and community bonding.',
        'upload_date' => '2026-07-04',
    ],
    [
        'title'       => "Women's Fellowship Prayer Meet",
        'wing'        => "Women's Fellowship",
        'custom_wing' => '',
        'event_from'  => '2026-07-20',
        'event_to'    => '2026-07-20',
        'duration'    => '1 Day',
        'details'     => 'A special prayer gathering for women members with worship, fellowship, testimony sharing, and scripture reflection.',
        'upload_date' => '2026-07-04',
    ],
    [
        'title'       => 'Christmas Eve Celebration',
        'wing'        => 'Church General',
        'custom_wing' => '',
        'event_from'  => '2026-12-24',
        'event_to'    => '2026-12-24',
        'duration'    => '1 Evening',
        'details'     => 'A church-wide Christmas Eve programme with worship, choir presentation, message, and fellowship.',
        'upload_date' => '2026-07-04',
    ],
];

// Use the first user in the system as the author
$authorStmt = $pdo->query("SELECT id FROM users ORDER BY id ASC LIMIT 1");
$author = $authorStmt->fetch();
$authorId = $author ? $author['id'] : 1;

$inserted = 0;
$skipped  = 0;

$checkStmt  = $pdo->prepare("SELECT COUNT(*) FROM special_programmes WHERE title = ?");
$insertStmt = $pdo->prepare(
    "INSERT INTO special_programmes (upload_date, title, wing, custom_wing, event_from, event_to, duration, details, document_path, author_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)"
);

foreach ($demos as $d) {
    $checkStmt->execute([$d['title']]);
    if ((int)$checkStmt->fetchColumn() > 0) {
        $skipped++;
        continue;
    }

    $insertStmt->execute([
        $d['upload_date'],
        $d['title'],
        $d['wing'],
        $d['custom_wing'],
        $d['event_from'],
        $d['event_to'],
        $d['duration'],
        $d['details'],
        $authorId,
    ]);
    $inserted++;
}

echo json_encode([
    'message'  => "Seed complete: {$inserted} inserted, {$skipped} skipped (already exist).",
    'inserted' => $inserted,
    'skipped'  => $skipped,
]);
