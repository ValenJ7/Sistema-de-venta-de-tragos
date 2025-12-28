<?php
header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/cors.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode(["message" => "Method Not Allowed"]);
  exit;
}

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/jwt.php";
require_once __DIR__ . "/../config/jwt_utils.php"; // jwt_sign

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$username = isset($data["username"]) ? trim($data["username"]) : "";
$password = isset($data["password"]) ? (string)$data["password"] : "";

if ($username === "" || $password === "") {
  http_response_code(400);
  echo json_encode(["message" => "username y password son requeridos"]);
  exit;
}

$stmt = $pdo->prepare("SELECT id, username, password_hash, role FROM users WHERE username = :username LIMIT 1");
$stmt->execute([":username" => $username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user["password_hash"])) {
  http_response_code(401);
  echo json_encode(["message" => "Credenciales inválidas"]);
  exit;
}

$now = time();

// ✅ access token
$accessPayload = [
  "iss" => JWT_ISSUER,
  "iat" => $now,
  "exp" => $now + JWT_TTL_SECONDS,
  "typ" => "access",
  "sub" => (int)$user["id"],
  "role" => $user["role"],
  "username" => $user["username"],
];
$accessToken = jwt_sign($accessPayload, JWT_SECRET);

// ✅ refresh token (cookie HttpOnly)
$refreshPayload = [
  "iss" => JWT_ISSUER,
  "iat" => $now,
  "exp" => $now + JWT_REFRESH_TTL_SECONDS,
  "typ" => "refresh",
  "sub" => (int)$user["id"],
  "role" => $user["role"],
];
$refreshToken = jwt_sign($refreshPayload, JWT_REFRESH_SECRET);

// Cookie (dev localhost: sin Secure)
// En prod HTTPS: poné 'secure' => true y SameSite=None
setcookie("refreshToken", $refreshToken, [
  "expires" => $now + JWT_REFRESH_TTL_SECONDS,
  "path" => "/",
  "httponly" => true,
  "secure" => false,
  "samesite" => "Lax",
]);

http_response_code(200);
echo json_encode([
  "accessToken" => $accessToken,
  "user" => [
    "id" => (int)$user["id"],
    "username" => $user["username"],
    "role" => $user["role"],
  ],
]);
