<?php
require_once __DIR__ . "/../config/cors.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode(["error" => "Method not allowed"]);
  exit;
}

$id = isset($_POST["id"]) ? (int)$_POST["id"] : 0;

if ($id <= 0) {
  http_response_code(400);
  echo json_encode(["error" => "ID inválido"]);
  exit;
}

if (!isset($_FILES["image"]) || $_FILES["image"]["error"] !== UPLOAD_ERR_OK) {
  http_response_code(400);
  echo json_encode(["error" => "Imagen obligatoria"]);
  exit;
}

// 1) Buscar el trago y su imagen actual
$stmt = $pdo->prepare("SELECT image_path FROM drinks WHERE id = ?");
$stmt->execute([$id]);
$current = $stmt->fetch();

if (!$current) {
  http_response_code(404);
  echo json_encode(["error" => "Trago no encontrado"]);
  exit;
}

// 2) Validar extensión
$ext = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
$allowed = ["jpg", "jpeg", "png", "webp"];

if (!in_array($ext, $allowed, true)) {
  http_response_code(400);
  echo json_encode(["error" => "Formato inválido"]);
  exit;
}

// 3) Guardar archivo
$uploadDir = __DIR__ . "/../../uploads/drinks/";
if (!is_dir($uploadDir)) {
  mkdir($uploadDir, 0777, true);
}

$fileName = "drink_" . $id . "_" . time() . "." . $ext;
$dest = $uploadDir . $fileName;

if (!move_uploaded_file($_FILES["image"]["tmp_name"], $dest)) {
  http_response_code(500);
  echo json_encode(["error" => "No se pudo guardar la imagen"]);
  exit;
}

$newPathDB = "uploads/drinks/" . $fileName;

try {
  // 4) Actualizar DB
  $upd = $pdo->prepare("UPDATE drinks SET image_path = ?, updated_at = NOW() WHERE id = ?");
  $upd->execute([$newPathDB, $id]);

  // 5) Borrar imagen anterior (si existía)
  if (!empty($current["image_path"])) {
    $oldFile = __DIR__ . "/../../" . $current["image_path"];
    if (file_exists($oldFile)) {
      unlink($oldFile);
    }
  }

  echo json_encode([
    "success" => true,
    "image_path" => $newPathDB
  ]);
} catch (PDOException $e) {
  // Si falló DB, limpiamos la imagen nueva para no dejar basura
  $newFile = __DIR__ . "/../../" . $newPathDB;
  if (file_exists($newFile)) {
    unlink($newFile);
  }

  http_response_code(500);
  echo json_encode([
    "error" => "Error al actualizar imagen en la base de datos",
    "details" => $e->getMessage()
  ]);
}
