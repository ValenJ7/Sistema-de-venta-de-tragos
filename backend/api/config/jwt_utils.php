<?php

function base64url_encode(string $data): string {
  return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function jwt_sign(array $payload, string $secret): string {
  $header = ["alg" => "HS256", "typ" => "JWT"];

  $segments = [];
  $segments[] = base64url_encode(json_encode($header));
  $segments[] = base64url_encode(json_encode($payload));

  $signing_input = implode('.', $segments);
  $signature = hash_hmac('sha256', $signing_input, $secret, true);

  $segments[] = base64url_encode($signature);
  return implode('.', $segments);
}
