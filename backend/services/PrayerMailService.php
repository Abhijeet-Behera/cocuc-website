<?php

declare(strict_types=1);

/**
 * Mail service for routing individual prayer requests and weekly PDFs
 * to church pastoral and secretarial staff.
 */
class PrayerMailService
{
    private string $toEmail;
    private ?string $ccEmail;
    private string $fromEmail;
    private string $fromName;

    public function __construct()
    {
        $this->toEmail = getenv('CHURCH_PRAYER_EMAIL')
            ?: ($_ENV['CHURCH_PRAYER_EMAIL'] ?? 'pastor@unionchurch.in');

        $this->ccEmail = getenv('CHURCH_PRAYER_CC_EMAIL')
            ?: ($_ENV['CHURCH_PRAYER_CC_EMAIL'] ?? 'secretary@unionchurch.in');

        $this->fromEmail = getenv('MAIL_FROM_ADDRESS')
            ?: ($_ENV['MAIL_FROM_ADDRESS'] ?? 'noreply@unionchurch.in');

        $this->fromName = 'Church of Christ Union Church Prayer Ministry';
    }

    /**
     * Sanitizes email headers to prevent header injection.
     */
    private function cleanHeader(string $val): string
    {
        return trim(str_replace(["\r", "\n", "%0a", "%0d"], '', $val));
    }

    /**
     * Send individual prayer request notification email in a clean bullet-point layout.
     */
    public function sendIndividualNotification(array $requestData): bool
    {
        $name = htmlspecialchars($requestData['name'] ?? 'Anonymous', ENT_QUOTES, 'UTF-8');
        $email = htmlspecialchars($requestData['email'] ?? 'Not provided', ENT_QUOTES, 'UTF-8');
        $phone = htmlspecialchars($requestData['phone'] ?? 'Not provided', ENT_QUOTES, 'UTF-8');
        $category = htmlspecialchars($requestData['category'] ?? 'General Prayer', ENT_QUOTES, 'UTF-8');
        $locality = htmlspecialchars($requestData['locality'] ?? 'Not specified', ENT_QUOTES, 'UTF-8');
        $request = nl2br(htmlspecialchars($requestData['request'] ?? '', ENT_QUOTES, 'UTF-8'));
        $additional = !empty($requestData['additional_info'])
            ? nl2br(htmlspecialchars($requestData['additional_info'], ENT_QUOTES, 'UTF-8'))
            : '';
        $submittedOn = date('D, d M Y - h:i A') . ' IST';

        $subject = $this->cleanHeader("New Prayer Request – Church of Christ Union Church ({$category})");

        // Plain text version for standard mail clients
        $plainBody = "A new prayer request has been submitted on the church website:\n\n" .
            "* Name: {$name}\n" .
            "* Email: {$email}\n" .
            "* Phone: {$phone}\n" .
            "* Prayer Category: {$category}\n" .
            "* Locality: {$locality}\n" .
            "* Submitted On: {$submittedOn}\n\n" .
            "PRAYER REQUEST / INTERCESSION NEED:\n" .
            "--------------------------------------------------\n" .
            ($requestData['request'] ?? '') . "\n" .
            "--------------------------------------------------\n" .
            ($additional ? "* Additional Information: " . ($requestData['additional_info'] ?? '') . "\n" : "") . "\n" .
            "Church of Christ (Union Church), Bhubaneswar\nWebsite Intercessory Ministry";

        // Professional HTML Layout with brand color #800000
        $htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Prayer Request</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #1f2937; margin: 0; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #800000; padding: 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">Church of Christ (Union Church)</h1>
            <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.85;">Intercessory Prayer Ministry &bull; Bhubaneswar, Odisha</p>
        </div>

        <div style="padding: 24px;">
            <div style="display: inline-block; background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
                New Prayer Petition
            </div>

            <h2 style="font-size: 18px; margin: 0 0 16px 0; color: #111827;">Prayer Request Details</h2>

            <ul style="list-style-type: none; padding: 0; margin: 0 0 20px 0; font-size: 14px; line-height: 1.8;">
                <li style="padding: 6px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #4b5563; display: inline-block; width: 140px;">&bull; Name:</strong> <span style="color: #111827; font-weight: 600;">{$name}</span></li>
                <li style="padding: 6px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #4b5563; display: inline-block; width: 140px;">&bull; Email:</strong> <span style="color: #111827;">{$email}</span></li>
                <li style="padding: 6px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #4b5563; display: inline-block; width: 140px;">&bull; Phone:</strong> <span style="color: #111827;">{$phone}</span></li>
                <li style="padding: 6px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #4b5563; display: inline-block; width: 140px;">&bull; Category / Zone:</strong> <span style="color: #800000; font-weight: 600;">{$category}</span></li>
                <li style="padding: 6px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #4b5563; display: inline-block; width: 140px;">&bull; Locality / Area:</strong> <span style="color: #111827;">{$locality}</span></li>
                <li style="padding: 6px 0;"><strong style="color: #4b5563; display: inline-block; width: 140px;">&bull; Submitted On:</strong> <span style="color: #6b7280;">{$submittedOn}</span></li>
            </ul>

            <div style="background-color: #fdf6f6; border-left: 4px solid #800000; border-radius: 4px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #800000; text-transform: uppercase; letter-spacing: 0.5px;">Prayer Request / Intercession Need:</p>
                <div style="font-size: 15px; line-height: 1.6; color: #1f2937;">{$request}</div>
            </div>

            {$this->renderAdditionalHtml($additional)}

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; font-style: italic;">
                "Therefore confess your sins to each other and pray for each other so that you may be healed. The prayer of a righteous person is powerful and effective." &mdash; James 5:16
            </div>
        </div>

        <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
            This email was sent automatically from the Church of Christ (Union Church) Bhubaneswar website.
        </div>
    </div>
</body>
</html>
HTML;

        return $this->sendMail($this->toEmail, $subject, $htmlBody, $plainBody, null, $this->ccEmail);
    }

    private function renderAdditionalHtml(string $additional): string
    {
        if (!$additional) return '';
        return <<<HTML
            <div style="margin: 14px 0; padding: 12px; background-color: #f9fafb; border-radius: 6px; font-size: 13px; color: #4b5563;">
                <strong>Additional Information:</strong> {$additional}
            </div>
HTML;
    }

    /**
     * Send the weekly compilation email with the generated PDF attached.
     */
    public function sendWeeklyCompilation(
        string $startDate,
        string $endDate,
        string $pdfPath,
        int $requestCount
    ): bool {
        $startFormatted = date('d M Y', strtotime($startDate));
        $endFormatted = date('d M Y', strtotime($endDate));
        $subject = $this->cleanHeader("Weekly Prayer Requests – Church of Christ Union Church ({$endFormatted})");

        $plainBody = "Dear Pastors & Intercessory Prayer Team,\n\n" .
            "Please find attached the weekly compilation of prayer requests submitted through the Church of Christ (Union Church) website for the period: {$startFormatted} to {$endFormatted}.\n\n" .
            "Total Requests Submitted: {$requestCount}\n\n" .
            "May the Lord bless this intercession ministry and bring comfort and answers to all families.\n\n" .
            "In His Service,\n" .
            "Church of Christ (Union Church), Bhubaneswar\n" .
            "Website Prayer Ministry";

        $htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Weekly Prayer Requests</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #1f2937; margin: 0; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #800000; padding: 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 700;">Church of Christ (Union Church)</h1>
            <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.85;">Weekly Intercessory Prayer Document &bull; Saturday Report</p>
        </div>

        <div style="padding: 24px;">
            <h2 style="font-size: 18px; margin: 0 0 12px 0; color: #111827;">Weekly Prayer Requests Compilation</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 16px;">
                Please find attached the official prayer requests document submitted during this week's prayer period (<strong>{$startFormatted}</strong> &mdash; <strong>{$endFormatted}</strong>).
            </p>

            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 14px; color: #991b1b; font-weight: 600;">
                    &bull; Total Petitions in Period: {$requestCount}
                </p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #6b7280;">
                    Attached Document: <em>weekly-prayer-requests-{$endDate}.pdf</em>
                </p>
            </div>

            <p style="font-size: 13px; line-height: 1.6; color: #6b7280;">
                The attached document contains the clean bullet-point summary, contact details, and full prayer text of all petitions received. It is prepared for Sunday pastoral intercession and weekly prayer cell coordination.
            </p>

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; font-style: italic;">
                "The prayer of a righteous person is powerful and effective." &mdash; James 5:16
            </div>
        </div>

        <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
            Church of Christ (Union Church), Bhubaneswar &bull; Automated Saturday Evening Report
        </div>
    </div>
</body>
</html>
HTML;

        return $this->sendMail($this->toEmail, $subject, $htmlBody, $plainBody, $pdfPath, $this->ccEmail);
    }

    /**
     * Dispatch email using standard PHP mail() with MIME multipart formatting.
     */
    private function sendMail(
        string $to,
        string $subject,
        string $htmlContent,
        string $plainContent,
        ?string $attachmentPath = null,
        ?string $cc = null
    ): bool {
        $boundary = '==_Multipart_Boundary_x' . md5((string)microtime(true)) . 'x';
        $subBoundary = '==_Alternative_Boundary_x' . md5((string)microtime(true)) . 'x';

        $headers = [];
        $headers[] = "From: " . $this->cleanHeader($this->fromName) . " <" . $this->cleanHeader($this->fromEmail) . ">";
        $headers[] = "Reply-To: " . $this->cleanHeader($this->fromEmail);
        if ($cc) {
            $headers[] = "Cc: " . $this->cleanHeader($cc);
        }
        $headers[] = "MIME-Version: 1.0";
        $headers[] = "X-Mailer: PHP/" . phpversion();

        if ($attachmentPath && file_exists($attachmentPath)) {
            $headers[] = "Content-Type: multipart/mixed; boundary=\"{$boundary}\"";

            $filename = basename($attachmentPath);
            $attachmentData = chunk_split(base64_encode(file_get_contents($attachmentPath)));

            $body = "--{$boundary}\r\n";
            $body .= "Content-Type: multipart/alternative; boundary=\"{$subBoundary}\"\r\n\r\n";

            $body .= "--{$subBoundary}\r\n";
            $body .= "Content-Type: text/plain; charset=\"UTF-8\"\r\n";
            $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
            $body .= $plainContent . "\r\n\r\n";

            $body .= "--{$subBoundary}\r\n";
            $body .= "Content-Type: text/html; charset=\"UTF-8\"\r\n";
            $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
            $body .= $htmlContent . "\r\n\r\n";
            $body .= "--{$subBoundary}--\r\n\r\n";

            $body .= "--{$boundary}\r\n";
            $body .= "Content-Type: application/pdf; name=\"{$filename}\"\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n";
            $body .= "Content-Disposition: attachment; filename=\"{$filename}\"\r\n\r\n";
            $body .= $attachmentData . "\r\n\r\n";
            $body .= "--{$boundary}--";
        } else {
            $headers[] = "Content-Type: multipart/alternative; boundary=\"{$subBoundary}\"";

            $body = "--{$subBoundary}\r\n";
            $body .= "Content-Type: text/plain; charset=\"UTF-8\"\r\n";
            $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
            $body .= $plainContent . "\r\n\r\n";

            $body .= "--{$subBoundary}\r\n";
            $body .= "Content-Type: text/html; charset=\"UTF-8\"\r\n";
            $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
            $body .= $htmlContent . "\r\n\r\n";
            $body .= "--{$subBoundary}--";
        }

        $headerString = implode("\r\n", $headers);

        // Attempt delivery via PHP mail()
        $sent = @mail($this->cleanHeader($to), $subject, $body, $headerString);

        if (!$sent) {
            // Securely log technical info without exposing sensitive user prayer content
            error_log("PrayerMailService: mail() dispatch returned false (Hostinger MTA or local dev). Target: {$to}");
        }

        return $sent;
    }
}
