<?php

$host = "127.0.0.1";   // mejor que localhost en Windows para evitar líos de socket
$port = "3307";        // si en XAMPP figura 3307, cambialo
$db   = "drinks_db";
$user = "root";
$pass = "";
$charset = "utf8mb4";

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database connection failed",
        "message" => $e->getMessage()
    ]);
    exit;
}
