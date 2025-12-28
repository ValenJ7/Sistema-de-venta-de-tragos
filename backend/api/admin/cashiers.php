<?php
header("Content-Type: application/json; charset=utf-8");
require_once __DIR__ . "/../config/cors.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
  http_response_code(405);
  echo json_encode(["error" => "Method not allowed"]);
  exit;
}

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/require_auth.php";

$auth = require_auth_access();
if (($auth["role"] ?? "") !== "admin") {
  http_response_code(403);
  echo json_encode(["error" => "Forbidden"]);
  exit;
}

try {
  $stmt = $pdo->query("
    SELECT id, username, role
    FROM users
    WHERE role IN ('caja')
    ORDER BY username ASC
  ");
  $rows = $stmt->fetchAll();

  echo json_encode([
    "cashiers" => array_map(fn($r) => [
      "id" => (int)$r["id"],
      "username" => $r["username"],
      "role" => $r["role"],
    ], $rows),
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(["error" => "Failed to load cashiers", "message" => $e->getMessage()]);
}
