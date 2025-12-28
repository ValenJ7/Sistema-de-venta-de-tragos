<?php
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

require_once __DIR__ . "/../config/jwt.php";
require_once __DIR__ . "/../config/jwt_utils.php"; // jwt_sign
require_once __DIR__ . "/../config/require_auth.php"; // jwt_verify_raw

$refresh = $_COOKIE["refreshToken"] ?? "";
if ($refresh === "") {
  http_response_code(401);
  echo json_encode(["error" => "Missing refresh token"]);
  exit;
}

try {
  $payload = jwt_verify_raw($refresh, JWT_REFRESH_SECRET);

  if (($payload["typ"] ?? "") !== "refresh") {
    throw new Exception("Invalid token type");
  }

  $userId = (int)($payload["sub"] ?? 0);
  $role = (string)($payload["role"] ?? "");
  if ($userId <= 0) throw new Exception("Invalid sub");

  $now = time();
  $accessPayload = [
    "iss" => JWT_ISSUER,
    "iat" => $now,
    "exp" => $now + JWT_TTL_SECONDS,
    "typ" => "access",
    "sub" => $userId,
    "role" => $role,
  ];

  $newAccess = jwt_sign($accessPayload, JWT_SECRET);

  echo json_encode([
    "accessToken" => $newAccess
  ]);
} catch (Throwable $e) {
  http_response_code(401);
  echo json_encode(["error" => "Invalid refresh token", "message" => $e->getMessage()]);
}
