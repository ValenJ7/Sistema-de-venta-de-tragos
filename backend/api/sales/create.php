<?php
// api/sales/create.php
header("Content-Type: application/json; charset=utf-8");
require_once __DIR__ . "/../config/cors.php";
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode(["error" => "Method not allowed"]);
  exit;
}

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/require_auth.php";

// 🔐 Auth JWT
$auth = require_auth_access();

// leer body
$input = json_decode(file_get_contents("php://input"), true);
if (!is_array($input)) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid JSON"]);
  exit;
}

$items = $input["items"] ?? [];

// 🔒 MULTI-CAJA (modo compatible)
// caja → SIEMPRE su propio userId
// admin → puede overridear (opcional)
if ($auth["role"] === "admin" && isset($input["cashierUserId"])) {
  $cashierUserId = (int)$input["cashierUserId"];
} else {
  $cashierUserId = $auth["userId"];
}

if ($cashierUserId <= 0) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid cashierUserId"]);
  exit;
}

if (!is_array($items) || count($items) === 0) {
  http_response_code(400);
  echo json_encode(["error" => "items is required"]);
  exit;
}

try {
  $pdo->beginTransaction();

  // crear venta
  $stmtSale = $pdo->prepare("
    INSERT INTO sales (cashier_user_id, total, status, created_at)
    VALUES (:uid, 0, 'completed', NOW())
  ");
  $stmtSale->execute([":uid" => $cashierUserId]);
  $saleId = (int)$pdo->lastInsertId();

  $stmtItem = $pdo->prepare("
    INSERT INTO sale_items (sale_id, drink_id, name_snapshot, qty, price_at_sale, line_total)
    VALUES (:sale_id, :drink_id, :name, :qty, :price, :line_total)
  ");

  $total = 0.0;

  foreach ($items as $it) {
    $drinkId = (int)($it["drinkId"] ?? 0);
    $name = (string)($it["name"] ?? "Producto");
    $qty = (int)($it["qty"] ?? 0);
    $price = (float)($it["priceAtSale"] ?? 0);

    if ($drinkId <= 0 || $qty <= 0) {
      throw new Exception("Invalid item payload");
    }

    $lineTotal = $price * $qty;
    $total += $lineTotal;

    $stmtItem->execute([
      ":sale_id" => $saleId,
      ":drink_id" => $drinkId,
      ":name" => $name,
      ":qty" => $qty,
      ":price" => $price,
      ":line_total" => $lineTotal,
    ]);
  }

  $stmtUpd = $pdo->prepare("UPDATE sales SET total = :total WHERE id = :id");
  $stmtUpd->execute([":total" => $total, ":id" => $saleId]);

  $pdo->commit();

  echo json_encode([
    "id" => $saleId,
    "cashierUserId" => $cashierUserId,
    "total" => $total,
    "status" => "completed",
  ]);
} catch (Throwable $e) {
  if ($pdo->inTransaction()) $pdo->rollBack();
  http_response_code(500);
  echo json_encode(["error" => "Failed to create sale", "message" => $e->getMessage()]);
}
