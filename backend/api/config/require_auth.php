<?php
require_once __DIR__ . "/jwt.php";

function base64url_decode(string $data): string {
  $data = strtr($data, '-_', '+/');
  $padLen = (4 - (strlen($data) % 4)) % 4;
  if ($padLen) $data .= str_repeat('=', $padLen);

  $decoded = base64_decode($data, true);
  if ($decoded === false) throw new Exception("Invalid base64");
  return $decoded;
}

function get_bearer_token(): ?string {
  $header = $_SERVER["HTTP_AUTHORIZATION"] ?? "";

  if ($header === "" && function_exists("getallheaders")) {
    $headers = getallheaders();
    $header = $headers["Authorization"] ?? ($headers["authorization"] ?? "");
  }

  if ($header && preg_match('/Bearer\s(\S+)/', $header, $m)) return $m[1];
  return null;
}

function jwt_verify_raw(string $jwt, string $secret): array {
  $parts = explode('.', $jwt);
  if (count($parts) !== 3) throw new Exception("Invalid token format");

  [$hB64, $pB64, $sB64] = $parts;

  $payloadJson = base64url_decode($pB64);
  $payload = json_decode($payloadJson, true);
  if (!is_array($payload)) throw new Exception("Invalid payload");

  $signature = base64url_decode($sB64);
  $expected = hash_hmac('sha256', "$hB64.$pB64", $secret, true);
  if (!hash_equals($expected, $signature)) throw new Exception("Invalid signature");

  if (isset($payload["exp"]) && time() > (int)$payload["exp"]) throw new Exception("Token expired");

  return $payload;
}

function require_auth_access(): array {
  $token = get_bearer_token();
  if (!$token) {
    http_response_code(401);
    echo json_encode(["error" => "Missing Authorization token"]);
    exit;
  }

  try {
    $payload = jwt_verify_raw($token, JWT_SECRET);

    // ✅ access-only
    if (($payload["typ"] ?? "access") !== "access") {
      throw new Exception("Invalid token type");
    }

    $userId = (int)($payload["sub"] ?? 0);
    if ($userId <= 0) throw new Exception("Invalid sub");

    return [
      "userId" => $userId,
      "role" => (string)($payload["role"] ?? ""),
      "username" => $payload["username"] ?? null,
    ];
  } catch (Throwable $e) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid or expired token", "message" => $e->getMessage()]);
    exit;
  }
}
