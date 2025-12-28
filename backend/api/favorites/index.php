<?php
header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/cors.php";
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/require_auth.php"; // ✅ tu auth central

// ✅ obtiene userId desde access token (Authorization: Bearer ...)
$auth = require_auth_access();
$userId = (int)($auth["userId"] ?? 0);

try {
  global $pdo;

  $method = $_SERVER["REQUEST_METHOD"];

  // ✅ GET: lista de ids
  if ($method === "GET") {
    $stmt = $pdo->prepare("SELECT drink_id FROM favorites WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$userId]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $ids = array_map(fn($r) => (int)$r["drink_id"], $rows);

    echo json_encode(["favoriteIds" => $ids]);
    exit;
  }

  // ✅ POST: agrega (body: { drink_id })
  if ($method === "POST") {
    $body = json_decode(file_get_contents("php://input"), true);
    $drinkId = isset($body["drink_id"]) ? (int)$body["drink_id"] : 0;

    if ($drinkId <= 0) {
      http_response_code(400);
      echo json_encode(["message" => "drink_id requerido"]);
      exit;
    }

    $stmt = $pdo->prepare("INSERT IGNORE INTO favorites (user_id, drink_id) VALUES (?, ?)");
    $stmt->execute([$userId, $drinkId]);

    echo json_encode(["ok" => true]);
    exit;
  }

  // ✅ DELETE: /api/favorites/?drink_id=123
  if ($method === "DELETE") {
    $drinkId = isset($_GET["drink_id"]) ? (int)$_GET["drink_id"] : 0;

    if ($drinkId <= 0) {
      http_response_code(400);
      echo json_encode(["message" => "drink_id requerido"]);
      exit;
    }

    $stmt = $pdo->prepare("DELETE FROM favorites WHERE user_id = ? AND drink_id = ?");
    $stmt->execute([$userId, $drinkId]);

    echo json_encode(["ok" => true]);
    exit;
  }

  http_response_code(405);
  echo json_encode(["message" => "Method Not Allowed"]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(["message" => "Server error"]);
}
