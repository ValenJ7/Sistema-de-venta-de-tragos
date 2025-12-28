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
  // reloj MySQL
  $nowRow = $pdo->query("
    SELECT 
      NOW() as now_dt,
      DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00') as day_start
  ")->fetch();

  $to = $nowRow["now_dt"];
  $dayStart = $nowRow["day_start"];

  // lista de cajas
  $cashiers = $pdo->query("
    SELECT id, username
    FROM users
    WHERE role IN ('caja')
    ORDER BY username ASC
  ")->fetchAll();

  // totales del día global
  $stmtDay = $pdo->prepare("
    SELECT 
      COUNT(*) AS salesCount,
      COALESCE(SUM(total),0) AS totalAmount
    FROM sales
    WHERE status='completed'
      AND created_at >= :dayStart
      AND created_at <= :to
  ");
  $stmtDay->execute([":dayStart" => $dayStart, ":to" => $to]);
  $dayAgg = $stmtDay->fetch();

  // helpers (último cierre y agregados por caja)
  $stmtLastClose = $pdo->prepare("
    SELECT to_datetime
    FROM cash_closings
    WHERE cashier_user_id = :uid
    ORDER BY to_datetime DESC
    LIMIT 1
  ");

  $stmtShiftAgg = $pdo->prepare("
    SELECT 
      COUNT(*) AS salesCount,
      COALESCE(SUM(total),0) AS totalAmount,
      MAX(created_at) AS lastSaleAt
    FROM sales
    WHERE status='completed'
      AND cashier_user_id = :uid
      AND created_at >= :from
      AND created_at <= :to
  ");

  $stmtDayByCashier = $pdo->prepare("
    SELECT 
      COUNT(*) AS salesCount,
      COALESCE(SUM(total),0) AS totalAmount
    FROM sales
    WHERE status='completed'
      AND cashier_user_id = :uid
      AND created_at >= :dayStart
      AND created_at <= :to
  ");

  $result = [];

  foreach ($cashiers as $c) {
    $uid = (int)$c["id"];

    // last close
    $stmtLastClose->execute([":uid" => $uid]);
    $last = $stmtLastClose->fetch();
    $lastCloseTo = $last ? $last["to_datetime"] : null;

    // from (si cierre futuro => ignorar y usar dayStart)
    $from = $dayStart;
    if ($lastCloseTo && strtotime($lastCloseTo) <= strtotime($to)) {
      $from = $lastCloseTo;
    }

    // shift agg
    $stmtShiftAgg->execute([
      ":uid" => $uid,
      ":from" => $from,
      ":to" => $to
    ]);
    $shiftAgg = $stmtShiftAgg->fetch();

    // day agg by cashier
    $stmtDayByCashier->execute([
      ":uid" => $uid,
      ":dayStart" => $dayStart,
      ":to" => $to
    ]);
    $dayBy = $stmtDayByCashier->fetch();

    $lastSaleAt = $shiftAgg["lastSaleAt"] ?? null;

    // estado: abierta si hubo venta después del último cierre (o no hay cierre y hubo ventas)
    $isOpen = false;
    if ($lastSaleAt) {
      if (!$lastCloseTo) $isOpen = true;
      else $isOpen = strtotime($lastSaleAt) > strtotime($lastCloseTo);
    }

    $result[] = [
      "cashier" => [
        "id" => $uid,
        "username" => $c["username"],
      ],
      "status" => $isOpen ? "open" : "closed",
      "range" => [
        "from" => $from,
        "to" => $to,
        "lastCloseTo" => $lastCloseTo,
      ],
      "shift" => [
        "salesCount" => (int)$shiftAgg["salesCount"],
        "totalAmount" => (float)$shiftAgg["totalAmount"],
        "lastSaleAt" => $lastSaleAt,
      ],
      "day" => [
        "salesCount" => (int)$dayBy["salesCount"],
        "totalAmount" => (float)$dayBy["totalAmount"],
      ]
    ];
  }

  echo json_encode([
    "now" => $to,
    "dayStart" => $dayStart,
    "dayTotals" => [
      "salesCount" => (int)$dayAgg["salesCount"],
      "totalAmount" => (float)$dayAgg["totalAmount"],
    ],
    "cashiers" => $result
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(["error" => "Failed to load overview", "message" => $e->getMessage()]);
}
