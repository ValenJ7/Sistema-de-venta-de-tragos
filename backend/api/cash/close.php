<?php
// api/cash/close.php
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

$auth = require_auth_access();

// leer JSON (tu front manda JSON)
$input = json_decode(file_get_contents("php://input"), true);
if (!is_array($input)) $input = [];

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

try {
  // reloj MySQL + inicio del día
  $stmtNow = $pdo->query("SELECT NOW() as now_dt, DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00') as day_start");
  $nowRow = $stmtNow->fetch();
  $to = $nowRow["now_dt"];
  $dayStart = $nowRow["day_start"];

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
  if ($last) {
    $lastTo = $last["to_datetime"];
    if (strtotime($lastTo) <= strtotime($to)) {
      $from = $lastTo;
    }
  }

  // sumar ventas del rango
  $stmtAgg = $pdo->prepare("
    SELECT COUNT(*) AS sales_count, COALESCE(SUM(total), 0) AS total_amount
    FROM sales
    WHERE cashier_user_id = :uid
      AND created_at > :from
      AND created_at <= :to
      AND status = 'completed'
  ");
  $stmtAgg->execute([
    ":uid" => $cashierUserId,
    ":from" => $from,
    ":to" => $to
  ]);
  $agg = $stmtAgg->fetch();

  $salesCount = (int)$agg["sales_count"];
  $totalAmount = (float)$agg["total_amount"];

  // insertar cierre
  $stmtIns = $pdo->prepare("
    INSERT INTO cash_closings (cashier_user_id, from_datetime, to_datetime, sales_count, total_amount)
    VALUES (:uid, :from, :to, :sales_count, :total_amount)
  ");
  $stmtIns->execute([
    ":uid" => $cashierUserId,
    ":from" => $from,
    ":to" => $to,
    ":sales_count" => $salesCount,
    ":total_amount" => $totalAmount,
  ]);

  $closingId = (int)$pdo->lastInsertId();

  echo json_encode([
    "id" => $closingId,
    "cashierUserId" => $cashierUserId,
    "from" => $from,
    "to" => $to,
    "salesCount" => $salesCount,
    "totalAmount" => $totalAmount,
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode([
    "error" => "Failed to close cash",
    "message" => $e->getMessage()
  ]);
}
