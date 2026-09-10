<?php

declare(strict_types=1);

/**
 * Storage service for prayer requests.
 * Connects to Hostinger MySQL PDO when available, and seamlessly falls back
 * to a local JSON data store in offline/local development environments.
 */
class PrayerStorageService
{
    private ?PDO $pdo = null;
    private string $jsonFilePath;
    private string $reportJsonFilePath;

    public function __construct()
    {
        $this->jsonFilePath = __DIR__ . '/../data/prayer_requests.json';
        $this->reportJsonFilePath = __DIR__ . '/../data/weekly_prayer_pdfs.json';

        // Try initializing PDO if configured
        $this->initPdo();
    }

    private function initPdo(): void
    {
        // Check if environment variables are loaded
        $dbHost = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? ($_SERVER['DB_HOST'] ?? ''));
        $dbName = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? ($_SERVER['DB_NAME'] ?? ''));
        $dbUser = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? ($_SERVER['DB_USER'] ?? ''));
        $dbPass = getenv('DB_PASS') ?: ($_ENV['DB_PASS'] ?? ($_SERVER['DB_PASS'] ?? ''));

        if (!empty($dbHost) && !empty($dbName) && in_array('mysql', PDO::getAvailableDrivers(), true)) {
            try {
                $this->pdo = new PDO(
                    "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4",
                    $dbUser,
                    $dbPass,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    ]
                );
                // Ensure table exists
                $this->ensureTables();
            } catch (Throwable $e) {
                // PDO connection failed, will use JSON fallback
                $this->pdo = null;
            }
        }
    }

    private function ensureTables(): void
    {
        if (!$this->pdo) return;

        try {
            $this->pdo->exec("
                CREATE TABLE IF NOT EXISTS prayer_requests (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NULL,
                    phone VARCHAR(50) NULL,
                    category VARCHAR(150) NOT NULL,
                    zone_id INT NULL,
                    locality VARCHAR(255) NULL,
                    request TEXT NOT NULL,
                    additional_info TEXT NULL,
                    status ENUM('pending', 'processed', 'archived') DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    processed_at TIMESTAMP NULL,
                    INDEX idx_status_created (status, created_at)
                );

                CREATE TABLE IF NOT EXISTS weekly_prayer_pdfs (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    period_start DATE NOT NULL,
                    period_end DATE NOT NULL,
                    pdf_filename VARCHAR(255) NOT NULL,
                    pdf_path VARCHAR(255) NOT NULL,
                    request_count INT DEFAULT 0,
                    email_sent TINYINT(1) DEFAULT 0,
                    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            ");
        } catch (Throwable $e) {
            // Ignore if tables cannot be auto-created
        }
    }

    /**
     * Save a new prayer request record.
     */
    public function saveRequest(array $data): array
    {
        $record = [
            'name' => trim((string)($data['name'] ?? '')),
            'email' => trim((string)($data['email'] ?? '')),
            'phone' => trim((string)($data['phone'] ?? '')),
            'category' => trim((string)($data['category'] ?? 'General Prayer')),
            'zone_id' => !empty($data['zone_id']) ? (int)$data['zone_id'] : null,
            'locality' => trim((string)($data['locality'] ?? '')),
            'request' => trim((string)($data['request'] ?? '')),
            'additional_info' => trim((string)($data['additional_info'] ?? '')),
            'status' => 'pending',
            'created_at' => date('Y-m-d H:i:s'),
            'processed_at' => null,
        ];

        if ($this->pdo) {
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO prayer_requests (name, email, phone, category, zone_id, locality, request, additional_info, status, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
                ");
                $stmt->execute([
                    $record['name'],
                    $record['email'] ?: null,
                    $record['phone'] ?: null,
                    $record['category'],
                    $record['zone_id'],
                    $record['locality'] ?: null,
                    $record['request'],
                    $record['additional_info'] ?: null,
                ]);
                $record['id'] = (int)$this->pdo->lastInsertId();
                return $record;
            } catch (Throwable $e) {
                // Fall back to JSON if database write fails
            }
        }

        // JSON Fallback Store
        $list = $this->readJsonStore($this->jsonFilePath);
        $newId = count($list) > 0 ? max(array_column($list, 'id') ?: [0]) + 1 : 1;
        $record['id'] = $newId;
        array_unshift($list, $record);
        $this->writeJsonStore($this->jsonFilePath, $list);

        return $record;
    }

    /**
     * Retrieve unprocessed prayer requests for a given date period.
     */
    public function getUnprocessedRequests(string $startDate, string $endDate): array
    {
        $startStamp = $startDate . ' 00:00:00';
        $endStamp = $endDate . ' 23:59:59';

        if ($this->pdo) {
            try {
                $stmt = $this->pdo->prepare("
                    SELECT * FROM prayer_requests
                    WHERE status = 'pending'
                      AND created_at >= ? AND created_at <= ?
                    ORDER BY created_at ASC
                ");
                $stmt->execute([$startStamp, $endStamp]);
                return $stmt->fetchAll();
            } catch (Throwable $e) {
                // fallback
            }
        }

        // JSON Fallback
        $list = $this->readJsonStore($this->jsonFilePath);
        $filtered = [];

        foreach ($list as $item) {
            if (($item['status'] ?? 'pending') === 'pending') {
                $createdAt = $item['created_at'] ?? '';
                if ($createdAt >= $startStamp && $createdAt <= $endStamp) {
                    $filtered[] = $item;
                }
            }
        }

        usort($filtered, fn($a, $b) => strcmp($a['created_at'] ?? '', $b['created_at'] ?? ''));
        return $filtered;
    }

    /**
     * Mark requests as processed to avoid duplicates across weekly PDFs.
     */
    public function markRequestsProcessed(array $ids): void
    {
        if (empty($ids)) return;

        if ($this->pdo) {
            try {
                $placeholders = implode(',', array_fill(0, count($ids), '?'));
                $stmt = $this->pdo->prepare("
                    UPDATE prayer_requests
                    SET status = 'processed', processed_at = NOW()
                    WHERE id IN ({$placeholders})
                ");
                $stmt->execute($ids);
                return;
            } catch (Throwable $e) {
                // fallback
            }
        }

        // JSON Fallback
        $list = $this->readJsonStore($this->jsonFilePath);
        $now = date('Y-m-d H:i:s');
        foreach ($list as &$item) {
            if (in_array($item['id'] ?? 0, $ids, true)) {
                $item['status'] = 'processed';
                $item['processed_at'] = $now;
            }
        }
        $this->writeJsonStore($this->jsonFilePath, $list);
    }

    /**
     * Record a generated weekly report.
     */
    public function recordWeeklyReport(
        string $startDate,
        string $endDate,
        string $filename,
        string $path,
        int $count,
        bool $emailSent
    ): int {
        if ($this->pdo) {
            try {
                $stmt = $this->pdo->prepare("
                    INSERT INTO weekly_prayer_pdfs (period_start, period_end, pdf_filename, pdf_path, request_count, email_sent, generated_at)
                    VALUES (?, ?, ?, ?, ?, ?, NOW())
                ");
                $stmt->execute([
                    $startDate,
                    $endDate,
                    $filename,
                    $path,
                    $count,
                    $emailSent ? 1 : 0
                ]);
                return (int)$this->pdo->lastInsertId();
            } catch (Throwable $e) {
                // fallback
            }
        }

        // JSON Fallback
        $reports = $this->readJsonStore($this->reportJsonFilePath);
        $newId = count($reports) > 0 ? max(array_column($reports, 'id') ?: [0]) + 1 : 1;
        $reportRecord = [
            'id' => $newId,
            'period_start' => $startDate,
            'period_end' => $endDate,
            'pdf_filename' => $filename,
            'pdf_path' => $path,
            'request_count' => $count,
            'email_sent' => $emailSent ? 1 : 0,
            'generated_at' => date('Y-m-d H:i:s'),
        ];
        array_unshift($reports, $reportRecord);
        $this->writeJsonStore($this->reportJsonFilePath, $reports);
        return $newId;
    }

    private function readJsonStore(string $path): array
    {
        if (!file_exists($path)) {
            return [];
        }
        $content = file_get_contents($path);
        if (!$content) return [];
        $data = json_decode($content, true);
        return is_array($data) ? $data : [];
    }

    private function writeJsonStore(string $path, array $data): void
    {
        $dir = dirname($path);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
    }
}
