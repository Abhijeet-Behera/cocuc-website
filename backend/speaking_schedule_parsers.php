<?php
/**
 * PDF parser functions for Speaking Arrangements
 */

require_once __DIR__ . '/libs/PdfParser/autoload.php';

// Common title prefixes for separating speaker columns, sorted from longest to shortest for matching priority
const TITLE_PREFIXES = [
    'Rev. Dr.',
    'Dn. Mr.',
    'Dn. Er.',
    'Elder Mr.',
    'Testimony Time',
    'Prayer Time',
    'Rev.',
    'Evg.',
    'Mr.',
    'Mrs.',
    'Prof.',
    'Dr.',
    'Dn.',
    'Er.',
    'Sister',
    'Bro.',
    'Ms.',
    'Elder'
];

// Special Sunday Worship values that don't match typical prefixes but occupy a column cell
const SUNDAY_SPECIAL_VALUES = [
    'LCVC Sunday',
    'Viswa Vani Sunday'
];

/**
 * Standardize text: remove multiple spaces, clean up non-breaking spaces and trim
 */
function cleanPdfText($text)
{
    // Replace non-breaking spaces and multiple whitespace characters with single spaces
    $cleaned = preg_replace('/[ \s]+/u', ' ', $text);
    return trim($cleaned);
}

/**
 * Identify indices where column cells start based on prefix locations in the text after the date.
 * Smarter overlapping, sorting, and positioning logic.
 */
function segmentLineByPrefixes($text, $expectedCount)
{
    if (empty($text))
        return [];

    $matches = [];

    // Find all occurrences of known prefixes
    foreach (TITLE_PREFIXES as $prefix) {
        $pos = 0;
        while (($pos = mb_strpos($text, $prefix, $pos)) !== false) {
            $matches[] = [
                'pos' => $pos,
                'prefix' => $prefix
            ];
            $pos += mb_strlen($prefix);
        }
    }

    // Find positions of special values
    foreach (SUNDAY_SPECIAL_VALUES as $val) {
        $pos = 0;
        while (($pos = mb_strpos($text, $val, $pos)) !== false) {
            $matches[] = [
                'pos' => $pos,
                'prefix' => $val
            ];
            $pos += mb_strlen($val);
        }
    }

    // Sort matches by prefix length descending first (to process longer ones first for conflict resolution)
    usort($matches, function ($a, $b) {
        return mb_strlen($b['prefix']) - mb_strlen($a['prefix']);
    });

    // Remove overlapping/subset matches. If a match is inside the character range of an already accepted (longer) match, discard it.
    $filteredMatches = [];
    foreach ($matches as $match) {
        $start = $match['pos'];
        $end = $start + mb_strlen($match['prefix']);

        $overlaps = false;
        foreach ($filteredMatches as $existing) {
            $eStart = $existing['pos'];
            $eEnd = $eStart + mb_strlen($existing['prefix']);

            // Overlap check
            if (($start >= $eStart && $start < $eEnd) || ($eStart >= $start && $eStart < $end)) {
                $overlaps = true;
                break;
            }
        }

        if (!$overlaps) {
            $filteredMatches[] = $match;
        }
    }

    // Sort the final matches by their position in the text (ascending)
    usort($filteredMatches, function ($a, $b) {
        return $a['pos'] - $b['pos'];
    });

    // Handle columns that might not start with a prefix (e.g. Wednesday topic).
    // If the first prefix match starts after index 0, insert a virtual empty prefix at index 0.
    if (!empty($filteredMatches) && $filteredMatches[0]['pos'] > 0) {
        array_unshift($filteredMatches, [
            'pos' => 0,
            'prefix' => ''
        ]);
    }

    // Extract segments
    $segments = [];
    $count = count($filteredMatches);
    for ($i = 0; $i < $count; $i++) {
        $start = $filteredMatches[$i]['pos'];

        // Determine the end position of the current cell: either start of next cell or end of line
        if ($expectedCount > 0 && $i == $expectedCount - 1) {
            // Last expected column gets all remaining text
            $segments[] = trim(mb_substr($text, $start));
            break;
        } else {
            $end = ($i + 1 < $count) ? $filteredMatches[$i + 1]['pos'] : mb_strlen($text);
            $segments[] = trim(mb_substr($text, $start, $end - $start));
        }
    }

    // Fallback: if we extracted fewer segments than expected, try parsing by double spaces
    if (count($segments) < $expectedCount) {
        $parts = preg_split('/\s{2,}/', $text);
        $parts = array_filter(array_map('trim', $parts));
        if (count($parts) >= $expectedCount) {
            return array_slice($parts, 0, $expectedCount);
        }

        // Pad with empty strings
        while (count($segments) < $expectedCount) {
            $segments[] = '';
        }
    }

    return $segments;
}

/**
 * Parser for Sunday Worship Schedule
 */
function parseSundayWorshipPdf($filePath)
{
    $parser = new \Smalot\PdfParser\Parser();
    $pdf = $parser->parseFile($filePath);
    $text = $pdf->getText();
    $lines = explode("\n", $text);

    $rows = [];
    $periodStart = null;
    $periodEnd = null;

    // Detect period from title, e.g. "Sunday Worship Schedule (July – September 2026)"
    if (preg_match('/Sunday Worship Schedule\s*\(([^)]+)\)/i', $text, $titleMatches)) {
        $periodStr = $titleMatches[1]; // e.g. "July – September 2026"
    }

    foreach ($lines as $line) {
        $line = cleanPdfText($line);
        if (empty($line))
            continue;

        // Check if line starts with a date in dd.mm.yyyy format
        if (preg_match('/^(\d{2})\.(\d{2})\.(\d{4})\s*(.*)$/', $line, $matches)) {
            $day = $matches[1];
            $month = $matches[2];
            $year = $matches[3];
            $rest = trim($matches[4]);

            $scheduleDate = "$year-$month-$day";
            if (!$periodStart || $scheduleDate < $periodStart)
                $periodStart = $scheduleDate;
            if (!$periodEnd || $scheduleDate > $periodEnd)
                $periodEnd = $scheduleDate;

            // Split the rest of the line into columns: English Worship, Odia Worship, C.S. Pur, Kalinga Vihar, Sundarpada
            $cols = segmentLineByPrefixes($rest, 5);
            // Ensure we have exactly 5 columns
            while (count($cols) < 5) {
                $cols[] = '';
            }

            // Detect English month label for UI grouping
            $dateObj = DateTime::createFromFormat('Y-m-d', $scheduleDate);
            $monthLabel = $dateObj ? $dateObj->format('F Y') : '';

            $rows[] = [
                'schedule_date' => $scheduleDate,
                'month_label' => $monthLabel,
                'day_name' => 'Sunday',
                'data_json' => [
                    'english' => $cols[0],
                    'odia' => $cols[1],
                    'cspur' => $cols[2],
                    'kalingavihar' => $cols[3],
                    'sundarpada' => $cols[4]
                ]
            ];
        }
    }

    if (empty($rows)) {
        return null; // Reject upload if no rows found
    }

    return [
        'sub_section' => 'Sunday Worships',
        'title' => 'Sunday Worship Schedule',
        'period_start' => $periodStart,
        'period_end' => $periodEnd,
        'meta_json' => [
            'times' => [
                'english' => '10:00 AM',
                'odia' => '04:00 PM',
                'cspur' => '10:00 AM',
                'kalingavihar' => '10:00 AM',
                'sundarpada' => '10:00 AM'
            ]
        ],
        'items' => $rows
    ];
}

/**
 * Parser for Morning Prayer List
 */
function parseMorningPrayerPdf($filePath)
{
    $parser = new \Smalot\PdfParser\Parser();
    $pdf = $parser->parseFile($filePath);
    $text = $pdf->getText();
    $lines = explode("\n", $text);

    $rows = [];
    $periodStart = null;
    $periodEnd = null;

    $zoomId = '';
    $passcode = '';

    // Extract zoom info
    if (preg_match('/Meeting ID:\s*([\d\s]+)/i', $text, $idMatches)) {
        $zoomId = str_replace(' ', '', $idMatches[1]);
    }
    if (preg_match('/Pass-code:\s*(\w+)/i', $text, $passMatches)) {
        $passcode = $passMatches[1];
    }

    // Default header timing
    $headerTiming = '07:00 AM to 08:00 AM, Every Day Except Sunday';

    foreach ($lines as $line) {
        $line = cleanPdfText($line);
        if (empty($line))
            continue;

        // Matches lines starting with e.g. "01.07.2026 Wednesday Mr. Peter Digal Rev. Dr. Ayub Chhinchani"
        // Regex has optional day name
        if (preg_match('/^(\d{2})\.(\d{2})\.(\d{4})\s+(\w+)\s+(.*)$/', $line, $matches)) {
            $day = $matches[1];
            $month = $matches[2];
            $year = $matches[3];
            $dayName = $matches[4];
            $rest = trim($matches[5]);

            $scheduleDate = "$year-$month-$day";
            if (!$periodStart || $scheduleDate < $periodStart)
                $periodStart = $scheduleDate;
            if (!$periodEnd || $scheduleDate > $periodEnd)
                $periodEnd = $scheduleDate;

            // Spk name can sometimes be "Testimony Time" or "Prayer Time" or a name with prefix.
            // Let's segment by known prefixes or the words "Testimony Time" / "Prayer Time".
            // Adding "Testimony Time", "Prayer Time" as parser boundaries
            $cols = segmentLineByPrefixes($rest, 2);
            if (count($cols) < 2) {
                // If segment failed, split by spaces if we can see double space
                $parts = preg_split('/\s{2,}/', $rest);
                if (count($parts) >= 2) {
                    $cols = [trim($parts[0]), trim($parts[1])];
                } else {
                    $cols = [$rest, ''];
                }
            }

            $rows[] = [
                'schedule_date' => $scheduleDate,
                'month_label' => (DateTime::createFromFormat('Y-m-d', $scheduleDate))->format('F Y'),
                'day_name' => $dayName,
                'data_json' => [
                    'presiding_by' => $cols[0],
                    'speaker' => $cols[1]
                ]
            ];
        }
    }

    if (empty($rows)) {
        return null;
    }

    return [
        'sub_section' => 'Morning prayer',
        'title' => 'Morning Prayer List',
        'period_start' => $periodStart,
        'period_end' => $periodEnd,
        'meta_json' => [
            'header' => $headerTiming,
            'zoom_id' => $zoomId ?: '218 382 5185',
            'passcode' => $passcode ?: '12345',
            'schedule' => [
                'Opening Prayer, Singing & Worship' => '15 Minutes',
                'Sharing from God’s Word' => '15 Minutes',
                'Sharing Prayer Points & Prayer' => '25 Minutes',
                'Closing Prayer & Benediction' => '5 Minutes'
            ]
        ],
        'items' => $rows
    ];
}

/**
 * Parser for Monday Prayer List
 */
function parseMondayPrayerPdf($filePath)
{
    $parser = new \Smalot\PdfParser\Parser();
    $pdf = $parser->parseFile($filePath);
    $text = $pdf->getText();
    $lines = explode("\n", $text);

    $rows = [];
    $periodStart = null;
    $periodEnd = null;

    $zoomId = '';
    $passcode = '';

    if (preg_match('/Zoom ID:\s*([\d\s]+)/i', $text, $idMatches)) {
        $zoomId = str_replace(' ', '', $idMatches[1]);
    }
    if (preg_match('/Passcode:\s*(\w+)/i', $text, $passMatches)) {
        $passcode = $passMatches[1];
    }

    $currentRow = null;

    foreach ($lines as $rawLine) {
        $trimmedLine = trim($rawLine);
        if (empty($trimmedLine))
            continue;

        // Detect schedule date line: "13.07.2026 Dn. Mr. Sudhir Swain Er. Michael Rajesh Behera Bethel Bethesda..."
        if (preg_match('/^(\d{2})\.(\d{2})\.(\d{4})\s+(.*)$/', $trimmedLine, $matches)) {
            if ($currentRow) {
                $rows[] = $currentRow;
            }

            $day = $matches[1];
            $month = $matches[2];
            $year = $matches[3];
            $rest = $matches[4]; // Keep raw spaces

            $scheduleDate = "$year-$month-$day";
            if (!$periodStart || $scheduleDate < $periodStart)
                $periodStart = $scheduleDate;
            if (!$periodEnd || $scheduleDate > $periodEnd)
                $periodEnd = $scheduleDate;

            // First split the clean string into two name columns: the Presiding speaker and the remainder (starting from Message speaker)
            $rest_clean = cleanPdfText($rest);
            $names_split = segmentLineByPrefixes($rest_clean, 2);
            $presided_by = $names_split[0] ?? $rest_clean;
            $remainder = $names_split[1] ?? '';

            // Partition the remainder into message_by, singing_by, and zones based on the singing groups: Bethel, Nazareth, Bethany
            // Choose the group that occurs FIRST in the string
            $message_by = $remainder;
            $singing_by = '';
            $zones = '';

            $groups = ['Bethel', 'Nazareth', 'Bethany'];
            $firstGroup = null;
            $minPos = 999999;
            foreach ($groups as $group) {
                $pos = mb_strpos($remainder, $group);
                if ($pos !== false && $pos < $minPos) {
                    $minPos = $pos;
                    $firstGroup = $group;
                }
            }

            if ($firstGroup !== null) {
                $message_by = trim(mb_substr($remainder, 0, $minPos));
                $singing_by = $firstGroup;
                $zones = trim(mb_substr($remainder, $minPos + mb_strlen($firstGroup)));
            }

            $currentRow = [
                'schedule_date' => $scheduleDate,
                'month_label' => (DateTime::createFromFormat('Y-m-d', $scheduleDate))->format('F Y'),
                'day_name' => 'Monday',
                'data_json' => [
                    'presided_by' => cleanPdfText($presided_by),
                    'message_by' => cleanPdfText($message_by),
                    'singing_by' => cleanPdfText($singing_by),
                    'zones' => cleanPdfText($zones)
                ]
            ];
        } else {
            // Append multiline text to Zones if we are in the middle of parsing
            $cleanLine = cleanPdfText($trimmedLine);
            if ($currentRow && !preg_match('/ON ZOOM|We are following|Opening Prayer|Sharing from|Closing Prayer|MONDAY/i', $cleanLine)) {
                $currentRow['data_json']['zones'] .= ' ' . $cleanLine;
            }
        }
    }

    // Push the last row
    if ($currentRow) {
        $rows[] = $currentRow;
    }

    // Clean up zones text spacing
    foreach ($rows as &$item) {
        $item['data_json']['zones'] = cleanPdfText($item['data_json']['zones']);
    }

    if (empty($rows)) {
        return null;
    }

    return [
        'sub_section' => 'Monday Prayer',
        'title' => 'Monday Prayer Schedule',
        'period_start' => $periodStart,
        'period_end' => $periodEnd,
        'meta_json' => [
            'header' => 'Monday 7 to 8 PM',
            'zoom_id' => $zoomId ?: '218 382 5185',
            'passcode' => $passcode ?: '12345',
            'schedule' => [
                'Opening Prayer, Singing & Worship' => '20 Minutes',
                'Sharing from God’s Word' => '15 Minutes',
                'Sharing Prayer Points & Prayer' => '20 Minutes',
                'Closing Prayer & Benediction' => '5 Minutes'
            ]
        ],
        'items' => $rows
    ];
}

/**
 * Parser for Wednesday Bible Study
 */
function parseWednesdayBibleStudyPdf($filePath)
{
    $parser = new \Smalot\PdfParser\Parser();
    $pdf = $parser->parseFile($filePath);
    $text = $pdf->getText();
    $lines = explode("\n", $text);

    $rows = [];
    $periodStart = null;
    $periodEnd = null;

    $currentMonthLabel = '';
    $pendingMonthName = '';
    $currentRow = null;

    $normalizeBibleLine = function ($line) {
        $line = cleanPdfText($line);

        // Fix PDF superscript / separated ordinal extraction, e.g. "1 st" => "1st"
        $line = preg_replace('/(\d)\s+(st|nd|rd|th)\b/i', '$1$2', $line);

        return cleanPdfText($line);
    };

    $isIgnorableBibleLine = function ($line) {
        return preg_match('/^(BIBLE STUDY PROGRAM|Every Wednesday|DATE\s+TOPIC|DATE|TOPIC|SPEAKER)$/i', $line);
    };

    $parseTopicAndSpeaker = function ($rowText) {
        $rowText = cleanPdfText($rowText);
        $rowText = preg_replace('/(\d)\s+(st|nd|rd|th)\b/i', '$1$2', $rowText);
        $rowText = cleanPdfText($rowText);

        if ($rowText === '') {
            return ['', ''];
        }

        // Best case: split at the final speaker prefix.
        // This prevents ordinal topics like "The 1st Seal" from being lost.
        if (preg_match('/^(.+?)\s+((?:Rev\. Dr\.|Rev\.|Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Evg\.|Elder|Dn\.|Er\.|Bro\.|Sister)\s+.+)$/u', $rowText, $matches)) {
            return [cleanPdfText($matches[1]), cleanPdfText($matches[2])];
        }

        // Fallback to existing prefix segmentation.
        $cols = segmentLineByPrefixes($rowText, 2);
        if (count($cols) >= 2) {
            return [cleanPdfText($cols[0]), cleanPdfText($cols[1])];
        }

        // Fallback for tables extracted with wide gaps.
        $parts = preg_split('/\s{2,}/', $rowText);
        $parts = array_values(array_filter(array_map('trim', $parts)));
        if (count($parts) >= 2) {
            return [cleanPdfText($parts[0]), cleanPdfText($parts[1])];
        }

        return [cleanPdfText($rowText), ''];
    };

    $flushCurrentRow = function () use (&$currentRow, &$rows, &$periodStart, &$periodEnd, $parseTopicAndSpeaker) {
        if (!$currentRow) {
            return;
        }

        [$topic, $speaker] = $parseTopicAndSpeaker($currentRow['row_text']);

        $rows[] = [
            'schedule_date' => $currentRow['schedule_date'],
            'month_label' => $currentRow['month_label'],
            'day_name' => 'Wednesday',
            'data_json' => [
                'topic' => $topic,
                'speaker' => $speaker
            ]
        ];

        if (!$periodStart || $currentRow['schedule_date'] < $periodStart)
            $periodStart = $currentRow['schedule_date'];
        if (!$periodEnd || $currentRow['schedule_date'] > $periodEnd)
            $periodEnd = $currentRow['schedule_date'];

        $currentRow = null;
    };

    foreach ($lines as $line) {
        $line = $normalizeBibleLine($line);
        if (empty($line))
            continue;
        if ($isIgnorableBibleLine($line))
            continue;

        // Handle month split across two lines, e.g. "December" then "026"
        if ($pendingMonthName && preg_match('/^0?(\d{2,4})$/', $line, $yearOnly)) {
            $yearDigits = $yearOnly[1];
            $year = (strlen($yearDigits) == 2) ? '20' . $yearDigits : $yearDigits;
            $currentMonthLabel = "$pendingMonthName $year";
            $pendingMonthName = '';
            continue;
        }

        // Detect month labels in PDF text:
        // "July 026", "August 026", "December 026", or "January 027 The 6th Trumpet ..."
        if (preg_match('/^(January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+0?(\d{2,4}))?(?:\s+(.*))?$/i', $line, $mLabel)) {
            $monthName = $mLabel[1];
            $yearDigits = $mLabel[2] ?? '';
            $extraText = trim($mLabel[3] ?? '');

            if ($yearDigits !== '') {
                $year = (strlen($yearDigits) == 2) ? '20' . $yearDigits : $yearDigits;
                $currentMonthLabel = "$monthName $year";
                $pendingMonthName = '';
            } else {
                $pendingMonthName = $monthName;
            }

            // Month header extra text like "7 Churches in Revelation 2 & 3" is not a dated row.
            // Keep the month label only; dated rows are parsed below.
            continue;
        }

        // Catch rows starting with dd.mm.yyyy format.
        // Some PDF rows are extracted as only the date on one line and topic/speaker on following lines.
        if (preg_match('/^(\d{2})\.(\d{2})\.(\d{4})\s*(.*)$/', $line, $matches)) {
            $flushCurrentRow();

            $day = $matches[1];
            $month = $matches[2];
            $year = $matches[3];
            $rest = trim($matches[4]);

            $scheduleDate = "$year-$month-$day";

            // If we don't have currentMonthLabel, derive from row's date
            $dateObj = DateTime::createFromFormat('Y-m-d', $scheduleDate);
            $monthLabel = $currentMonthLabel ?: ($dateObj ? $dateObj->format('F Y') : '');

            $currentRow = [
                'schedule_date' => $scheduleDate,
                'month_label' => $monthLabel,
                'row_text' => $rest
            ];

            continue;
        }

        // If the row content appears on the next line after a date, attach it to the current dated row.
        if ($currentRow) {
            $currentRow['row_text'] = cleanPdfText($currentRow['row_text'] . ' ' . $line);
        }
    }

    $flushCurrentRow();

    if (empty($rows)) {
        return null;
    }

    return [
        'sub_section' => 'Wednesday Prayer', // Mapped to Wednesday Prayer DB key
        'title' => 'Wednesday Bible Study Program',
        'period_start' => $periodStart,
        'period_end' => $periodEnd,
        'meta_json' => [
            'header' => 'Bible Study Program, COCUC, Bhubaneswar',
            'venue' => 'Amenity Hall',
            'timing' => 'Every Wednesday at 07 PM'
        ],
        'items' => $rows
    ];
}

/**
 * Parser for Evening Zoom Prayer
 */
function parseEveningZoomPrayerPdf($filePath)
{
    $parser = new \Smalot\PdfParser\Parser();
    $pdf = $parser->parseFile($filePath);
    $text = $pdf->getText();
    $lines = explode("\n", $text);

    $rows = [];
    $periodStart = null;
    $periodEnd = null;

    $zoomId = '';
    $passcode = '';
    $nbNote = '';

    if (preg_match('/Zoom ID:\s*([\d\s]+)/i', $text, $idMatches)) {
        $zoomId = str_replace(' ', '', $idMatches[1]);
    }
    if (preg_match('/Passcode:\s*(\w+)/i', $text, $passMatches)) {
        $passcode = $passMatches[1];
    }

    // Extract NB note
    if (preg_match('/NB:-(.*?)(?=PROG|PROGRAM|THANK|$)/is', $text, $nbMatches)) {
        $nbNote = cleanPdfText($nbMatches[1]);
    }

    foreach ($lines as $line) {
        $line = cleanPdfText($line);
        if (empty($line))
            continue;

        // Matches e.g. "03.07.2026 Friday Evg. Christopher Surya Mr. Arun Kumar Pradhan Evg. Christopher Surya"
        if (preg_match('/^(\d{2})\.(\d{2})\.(\d{4})\s+(\w+)\s+(.*)$/', $line, $matches)) {
            $day = $matches[1];
            $month = $matches[2];
            $year = $matches[3];
            $dayName = $matches[4];
            $rest = trim($matches[5]);

            $scheduleDate = "$year-$month-$day";
            if (!$periodStart || $scheduleDate < $periodStart)
                $periodStart = $scheduleDate;
            if (!$periodEnd || $scheduleDate > $periodEnd)
                $periodEnd = $scheduleDate;

            // Columns: Leader, Speaker, Worship. We segment by name prefixes
            $cols = segmentLineByPrefixes($rest, 3);
            while (count($cols) < 3) {
                $cols[] = '';
            }

            $rows[] = [
                'schedule_date' => $scheduleDate,
                'month_label' => (DateTime::createFromFormat('Y-m-d', $scheduleDate))->format('F Y'),
                'day_name' => $dayName,
                'data_json' => [
                    'leader' => $cols[0],
                    'speaker' => $cols[1],
                    'worship' => $cols[2]
                ]
            ];
        }
    }

    if (empty($rows)) {
        return null;
    }

    return [
        'sub_section' => 'Zoom Prayer', // Mapped to Zoom Prayer DB key
        'title' => 'Evening Zoom Prayer Schedule',
        'period_start' => $periodStart,
        'period_end' => $periodEnd,
        'meta_json' => [
            'header' => 'Evening Zoom Prayer, 07–08 PM',
            'zoom_id' => $zoomId ?: '218 382 5185',
            'passcode' => $passcode ?: '12345',
            'nb_note' => $nbNote ?: 'Worship Leaders are requested to select two Songs/Hymns/Choruses & forward to Zoom Host at least one day in advance.',
            'schedule' => [
                'Welcome & Opening Prayer' => '5 Minutes',
                'Worship / Singing' => '10 Minutes',
                'Devotional Talk' => '15 Minutes',
                'Prayer & Intercession' => '25 Minutes',
                'The Lord’s Prayer & Benediction' => '5 Minutes'
            ]
        ],
        'items' => $rows
    ];
}
?>