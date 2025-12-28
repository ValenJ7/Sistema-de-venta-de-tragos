<?php
// api/sales/shift.php
header("Content-Type: application/json; charset=utf-8");
require_once __DIR__ . "/../config/cors.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
  http_response_code(405);
  echo json_encode(["error" => "Method not allowed"]);
  exit;
}

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/require_auth.php";

$auth = require_auth_access();

// 🔒 MULTI-CAJA (modo compatible)
// caja → SIEMPRE su propio userId
// admin → puede consultar otra caja con query param
if ($auth["role"] === "admin" && isset($_GET["cashierUserId"])) {
  $cashierUserId = (int)$_GET["cashierUserId"];
} else {
  $cashierUserId = $auth["userId"];
}

// reloj MySQL + inicio del día
$rowNow = $pdo->query("
  SELECT NOW() as now_dt, DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00') as day_start
")->fetch();

$to = $rowNow["now_dt"];
$dayStart = $rowNow["day_start"];

// último cierre válido
$stmtLast = $pdo->prepare("
  SELECT to_datetime
  FROM cash_closings
  WHERE cashier_user_id = :uid
  ORDER BY to_datetime DESC
  LIMIT 1
");
$stmtLast->execute([":uid" => $cashierUserId]);
$last = $stmtLast->fetch();

$from = $dayStart;
if ($last && strtotime($last["to_datetime"]) <= strtotime($to)) {
  $from = $last["to_datetime"];
}

// ventas del turno
$stmtSales = $pdo->prepare("
  SELECT id, created_at, cashier_user_id, total, status
  FROM sales
  WHERE cashier_user_id = :uid
    AND created_at >= :from
    AND created_at <= :to
    AND status = 'completed'
  ORDER BY id DESC
  LIMIT 200
");
$stmtSales->execute([
  ":uid" => $cashierUserId,
  ":from" => $from,
  ":to" => $to,
]);
$salesRows = $stmtSales->fetchAll();

// items por venta
$stmtItems = $pdo->prepare("
  SELECT drink_id, name_snapshot, qty, price_at_sale, line_total
  FROM sale_items
  WHERE sale_id = :sale_id
  ORDER BY id ASC
");

$result = [];
foreach ($salesRows as $s) {
  $stmtItems->execute([":sale_id" => $s["id"]]);
  $items = $stmtItems->fetchAll();

  $result[] = [
    "id" => (int)$s["id"],
    "createdAt" => $s["created_at"],
    "cashierUserId" => (int)$s["cashier_user_id"],
    "total" => (float)$s["total"],
    "status" => $s["status"],
    "items" => array_map(fn($it) => [
      "drinkId" => (int)$it["drink_id"],
      "name" => $it["name_snapshot"],
      "qty" => (int)$it["qty"],
      "priceAtSale" => (float)$it["price_at_sale"],
      "lineTotal" => (float)$it["line_total"],
    ], $items),
  ];
}

echo json_encode([
  "from" => $from,
  "to" => $to,
  "sales" => $result
]);
