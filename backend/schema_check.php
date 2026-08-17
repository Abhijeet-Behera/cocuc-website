<?php
require 'db_config.php';
$stmt = $pdo->query('DESCRIBE speaking_schedule_uploads');
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
