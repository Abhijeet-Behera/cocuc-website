<?php

declare(strict_types=1);

require_once __DIR__ . '/../libs/fpdf/fpdf.php';

/**
 * Custom Church FPDF implementation with branding, running headers, and page counters.
 */
class ChurchFPDF extends FPDF
{
    private string $churchName = 'Church of Christ (Union Church), Bhubaneswar';
    private string $documentTitle = 'Weekly Intercessory Prayer Requests';
    private string $periodText = '';
    private ?string $logoPath = null;

    public function setMeta(string $periodText, ?string $logoPath = null): void
    {
        $this->periodText = $periodText;
        $this->logoPath = $logoPath;
    }

    public function RoundedRect($x, $y, $w, $h, $r, $style = '', $corners = '1234'): void
    {
        $k = $this->k;
        $hp = $this->h;
        if ($style === 'F') {
            $op = 'f';
        } elseif ($style === 'FD' || $style === 'DF') {
            $op = 'B';
        } else {
            $op = 'S';
        }
        $MyArc = 4/3 * (sqrt(2) - 1);
        $this->_out(sprintf('%.2F %.2F m', ($x + $r) * $k, ($hp - $y) * $k));

        $xc = $x + $w - $r;
        $yc = $y + $r;
        $this->_out(sprintf('%.2F %.2F l', $xc * $k, ($hp - $y) * $k));
        if (strpos($corners, '2') === false) {
            $this->_out(sprintf('%.2F %.2F l', ($x + $w) * $k, ($hp - $y) * $k));
        } else {
            $this->_Arc($xc + $r * $MyArc, $yc - $r, $xc + $r, $yc - $r * $MyArc, $xc + $r, $yc);
        }

        $xc = $x + $w - $r;
        $yc = $y + $h - $r;
        $this->_out(sprintf('%.2F %.2F l', ($x + $w) * $k, ($hp - $yc) * $k));
        if (strpos($corners, '3') === false) {
            $this->_out(sprintf('%.2F %.2F l', ($x + $w) * $k, ($hp - ($y + $h)) * $k));
        } else {
            $this->_Arc($xc + $r, $yc + $r * $MyArc, $xc + $r * $MyArc, $yc + $r, $xc, $yc + $r);
        }

        $xc = $x + $r;
        $yc = $y + $h - $r;
        $this->_out(sprintf('%.2F %.2F l', $xc * $k, ($hp - ($y + $h)) * $k));
        if (strpos($corners, '4') === false) {
            $this->_out(sprintf('%.2F %.2F l', $x * $k, ($hp - ($y + $h)) * $k));
        } else {
            $this->_Arc($xc - $r * $MyArc, $yc + $r, $xc - $r, $yc + $r * $MyArc, $xc - $r, $yc);
        }

        $xc = $x + $r;
        $yc = $y + $r;
        $this->_out(sprintf('%.2F %.2F l', $x * $k, ($hp - $yc) * $k));
        if (strpos($corners, '1') === false) {
            $this->_out(sprintf('%.2F %.2F l', $x * $k, ($hp - $y) * $k));
            $this->_out(sprintf('%.2F %.2F l', ($x + $r) * $k, ($hp - $y) * $k));
        } else {
            $this->_Arc($xc - $r, $yc - $r * $MyArc, $xc - $r * $MyArc, $yc - $r, $xc, $yc - $r);
        }
        $this->_out($op);
    }

    protected function _Arc($x1, $y1, $x2, $y2, $x3, $y3): void
    {
        $h = $this->h;
        $this->_out(sprintf('%.2F %.2F %.2F %.2F %.2F %.2F c ', $x1 * $this->k, ($h - $y1) * $this->k,
            $x2 * $this->k, ($h - $y2) * $this->k, $x3 * $this->k, ($h - $y3) * $this->k));
    }

    // Page Header
    public function Header(): void
    {
        // 1. Church Logo
        $startX = 14;
        $startY = 10;

        if ($this->logoPath && file_exists($this->logoPath)) {
            // Place logo (width ~20mm, height ~20mm)
            $this->Image($this->logoPath, $startX, $startY, 18, 18);
            $textX = $startX + 22;
        } else {
            $textX = $startX;
        }

        // 2. Church Name & Subtitle
        $this->SetXY($textX, $startY + 1);
        $this->SetFont('Arial', 'B', 14);
        $this->SetTextColor(128, 0, 0); // Deep Maroon (#800000)
        $this->Cell(110, 6, $this->churchName, 0, 1, 'L');

        $this->SetX($textX);
        $this->SetFont('Arial', 'B', 10);
        $this->SetTextColor(75, 85, 99);
        $this->Cell(110, 5, $this->documentTitle, 0, 1, 'L');

        $this->SetX($textX);
        $this->SetFont('Arial', 'I', 8.5);
        $this->SetTextColor(107, 114, 128);
        $this->Cell(110, 4, $this->periodText, 0, 1, 'L');

        // Right side badge: Confidential Pastoral Document
        $this->SetXY(145, $startY + 2);
        $this->SetFont('Arial', 'B', 8);
        $this->SetTextColor(128, 0, 0);
        $this->SetFillColor(253, 242, 242);
        $this->Cell(51, 6, 'CONFIDENTIAL PASTORAL CARE', 1, 1, 'C', true);

        $this->SetXY(145, $startY + 9);
        $this->SetFont('Arial', '', 7.5);
        $this->SetTextColor(107, 114, 128);
        $this->Cell(51, 4, 'Bhubaneswar, Odisha - India', 0, 1, 'C');

        // Decorative Maroon Accent Line
        $this->SetY(33);
        $this->SetDrawColor(128, 0, 0);
        $this->SetLineWidth(0.8);
        $this->Line(14, 33, 196, 33);
        $this->SetLineWidth(0.2);

        $this->Ln(4);
    }

    // Page Footer
    public function Footer(): void
    {
        $this->SetY(-16);
        $this->SetDrawColor(229, 231, 235);
        $this->Line(14, $this->GetY(), 196, $this->GetY());

        $this->SetY(-13);
        $this->SetFont('Arial', 'I', 8);
        $this->SetTextColor(107, 114, 128);
        $this->Cell(130, 6, 'Church of Christ (Union Church) | Intercessory Prayer Fellowship', 0, 0, 'L');
        $this->Cell(52, 6, 'Page ' . $this->PageNo() . ' of {nb}', 0, 0, 'R');
    }
}

/**
 * Service to generate church-branded PDF documents for prayer requests.
 */
class PrayerPdfGenerator
{
    private string $logoPath;

    public function __construct(?string $logoPath = null)
    {
        if ($logoPath && file_exists($logoPath)) {
            $this->logoPath = $logoPath;
        } else {
            // Check default locations
            $candidates = [
                __DIR__ . '/../assets/church-logo.png',
                __DIR__ . '/../../frontend/public/church-logo.png',
                __DIR__ . '/../../frontend/public/COCUC_LOGO.png',
            ];
            $this->logoPath = '';
            foreach ($candidates as $cand) {
                if (file_exists($cand)) {
                    $this->logoPath = $cand;
                    break;
                }
            }
        }
    }

    /**
     * Safely transcode UTF-8 string to ISO-8859-1 for FPDF standard fonts.
     */
    private function sanitizeText(string $text): string
    {
        // Replace common unicode typography with ASCII equivalents
        $replacements = [
            "\xE2\x80\x98" => "'", // left single quote
            "\xE2\x80\x99" => "'", // right single quote
            "\xE2\x80\x9C" => '"', // left double quote
            "\xE2\x80\x9D" => '"', // right double quote
            "\xE2\x80\x93" => '-', // en-dash
            "\xE2\x80\x94" => '--',// em-dash
            "\xE2\x80\xA2" => chr(149), // bullet
            "\xE2\x80\xA6" => '...', // ellipsis
        ];
        $text = strtr($text, $replacements);

        // Convert remainder to ISO-8859-1
        if (function_exists('iconv')) {
            $converted = @iconv('UTF-8', 'windows-1252//TRANSLIT', $text);
            if ($converted !== false) {
                return $converted;
            }
        }
        return utf8_decode($text);
    }

    /**
     * Generates a weekly prayer requests PDF.
     *
     * @param array  $requests   Array of prayer request records
     * @param string $startDate  Formatted start date (e.g. '2026-08-30')
     * @param string $endDate    Formatted end date (e.g. '2026-09-05')
     * @param string $outputPath Absolute output file path
     * @return string            The generated file path
     */
    public function generateWeeklyPdf(
        array $requests,
        string $startDate,
        string $endDate,
        string $outputPath
    ): string {
        $pdf = new ChurchFPDF('P', 'mm', 'A4');
        $pdf->AliasNbPages();

        $startFormatted = date('D, d M Y', strtotime($startDate));
        $endFormatted = date('D, d M Y', strtotime($endDate));
        $periodText = "Prayer Collection Period: {$startFormatted} to {$endFormatted}";

        $pdf->setMeta($periodText, $this->logoPath ?: null);
        $pdf->SetMargins(14, 15, 14);
        $pdf->SetAutoPageBreak(true, 20);
        $pdf->AddPage();

        // 1. Overview Metadata Box
        $pdf->SetFillColor(249, 250, 251);
        $pdf->SetDrawColor(229, 231, 235);
        $pdf->RoundedRect(14, 37, 182, 22, 2.5, 'DF');

        $pdf->SetXY(18, 39);
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->SetTextColor(128, 0, 0);
        $pdf->Cell(60, 5, 'WEEKLY PRAYER REPORT SUMMARY', 0, 1, 'L');

        $pdf->SetXY(18, 45);
        $pdf->SetFont('Arial', '', 8.5);
        $pdf->SetTextColor(55, 65, 81);
        $totalCount = count($requests);
        $pdf->Cell(80, 5, $this->sanitizeText("Total Prayer Petitions Submitted: {$totalCount}"), 0, 0, 'L');

        $nowFormatted = date('d M Y, h:i A') . ' IST';
        $pdf->Cell(95, 5, $this->sanitizeText("Generated On: {$nowFormatted}"), 0, 1, 'R');

        $pdf->SetXY(18, 50);
        $pdf->SetFont('Arial', 'I', 8);
        $pdf->SetTextColor(107, 114, 128);
        $pdf->Cell(175, 5, $this->sanitizeText("Scripture Promise: 'Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God.' - Phil 4:6"), 0, 1, 'L');

        $pdf->Ln(7);

        // 2. Content: Empty State vs Requests List
        if (empty($requests)) {
            // Elegant Empty State Box
            $pdf->SetY(67);
            $pdf->SetFillColor(254, 242, 242);
            $pdf->SetDrawColor(254, 202, 202);
            $pdf->RoundedRect(14, $pdf->GetY(), 182, 36, 3, 'DF');

            $pdf->SetY($pdf->GetY() + 6);
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->SetTextColor(153, 27, 27);
            $pdf->Cell(182, 6, $this->sanitizeText('No Submitted Prayer Requests For This Period'), 0, 1, 'C');

            $pdf->SetFont('Arial', '', 9);
            $pdf->SetTextColor(107, 114, 128);
            $pdf->Cell(182, 5, $this->sanitizeText("No personal prayer petitions were submitted between {$startFormatted} and {$endFormatted}."), 0, 1, 'C');
            $pdf->Cell(182, 5, $this->sanitizeText("We give praise and thanksgiving for the continued grace, peace, and health of our congregation."), 0, 1, 'C');
        } else {
            $pdf->SetY(65);

            foreach ($requests as $index => $req) {
                $itemNum = $index + 1;
                $name = trim($req['name'] ?? 'Anonymous Believer');
                $email = trim($req['email'] ?? 'Not provided');
                $phone = trim($req['phone'] ?? 'Not provided');
                $category = trim($req['category'] ?? 'General Prayer');
                $locality = trim($req['locality'] ?? '');
                $prayerText = trim($req['request'] ?? $req['message'] ?? '');
                $submittedOn = !empty($req['created_at'])
                    ? date('D, d M Y - h:i A', strtotime($req['created_at'])) . ' IST'
                    : 'This week';
                $additional = trim($req['additional_info'] ?? '');

                // Ensure there is enough space on current page for header and bullet points (~50mm)
                // If not, trigger page break cleanly before beginning the request card
                if ($pdf->GetY() > 220) {
                    $pdf->AddPage();
                    $pdf->SetY(38);
                }

                $cardStartY = $pdf->GetY();

                // Request Header Bar
                $pdf->SetFillColor(128, 0, 0); // Maroon
                $pdf->SetTextColor(255, 255, 255);
                $pdf->SetFont('Arial', 'B', 9.5);
                $headerTitle = $this->sanitizeText(" Request #{$itemNum}  |  Category: {$category}");
                $pdf->Cell(182, 6.5, $headerTitle, 0, 1, 'L', true);

                // Meta Info Box (Bullet Points)
                $pdf->SetFillColor(253, 246, 246);
                $pdf->SetDrawColor(229, 231, 235);

                $bulletsStartY = $pdf->GetY();
                $pdf->SetFont('Arial', '', 8.5);

                $renderBullet = function (string $label, string $value) use ($pdf) {
                    $bulletChar = chr(149); // Clean round bullet
                    $pdf->SetX(18);
                    $pdf->SetTextColor(128, 0, 0);
                    $pdf->SetFont('Arial', 'B', 9);
                    $pdf->Cell(4, 5, $bulletChar, 0, 0, 'L');

                    $pdf->SetTextColor(55, 65, 81);
                    $pdf->SetFont('Arial', 'B', 8.5);
                    $pdf->Cell(38, 5, $label . ':', 0, 0, 'L');

                    $pdf->SetFont('Arial', '', 8.5);
                    $pdf->SetTextColor(17, 24, 39);
                    $pdf->Cell(135, 5, $this->sanitizeText($value), 0, 1, 'L');
                };

                $renderBullet('Name', $name);
                $renderBullet('Email', $email ?: 'Not provided');
                $renderBullet('Phone', $phone ?: 'Not provided');
                $renderBullet('Prayer Category', $category);
                if ($locality) {
                    $renderBullet('Locality / Area', $locality);
                }
                $renderBullet('Submitted On', $submittedOn);

                $pdf->Ln(2);

                // Prayer Petition Box (MultiCell for multi-line wrapping with auto page-break)
                $pdf->SetX(18);
                $pdf->SetFont('Arial', 'B', 8.5);
                $pdf->SetTextColor(128, 0, 0);
                $pdf->Cell(4, 5, chr(149), 0, 0, 'L');
                $pdf->Cell(50, 5, 'Prayer Request / Intercession Need:', 0, 1, 'L');

                // Inset petition text
                $pdf->SetX(22);
                $pdf->SetFont('Arial', '', 9);
                $pdf->SetTextColor(31, 41, 55);
                $pdf->SetFillColor(255, 255, 255);
                $pdf->SetDrawColor(229, 231, 235);
                $sanitizedRequest = $this->sanitizeText($prayerText);

                // MultiCell handles long text and auto-breaks pages seamlessly
                $pdf->MultiCell(174, 5, $sanitizedRequest, 'L', 'L');

                if ($additional) {
                    $pdf->Ln(1);
                    $pdf->SetX(18);
                    $pdf->SetFont('Arial', 'B', 8.5);
                    $pdf->SetTextColor(128, 0, 0);
                    $pdf->Cell(4, 5, chr(149), 0, 0, 'L');
                    $pdf->Cell(50, 5, 'Additional Information:', 0, 1, 'L');

                    $pdf->SetX(22);
                    $pdf->SetFont('Arial', 'I', 8.5);
                    $pdf->SetTextColor(75, 85, 99);
                    $pdf->MultiCell(174, 4.5, $this->sanitizeText($additional), 'L', 'L');
                }

                // Bottom divider between requests
                $pdf->Ln(4);
                $pdf->SetDrawColor(209, 213, 219);
                $pdf->SetLineWidth(0.3);
                $pdf->Line(14, $pdf->GetY(), 196, $pdf->GetY());
                $pdf->Ln(5);
            }
        }

        // Ensure target directory exists
        $dir = dirname($outputPath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $pdf->Output('F', $outputPath);

        return $outputPath;
    }
}
