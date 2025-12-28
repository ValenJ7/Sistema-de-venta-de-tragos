<?php
require_once __DIR__ . "/../config/cors.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

require_once __DIR__ . "/../config/db.php";

$method = $_SERVER["REQUEST_METHOD"];

/* =======================
   GET – listar tragos
======================= */
if ($method === "GET") {
  $stmt = $pdo->query(
    "SELECT id, name, category, is_alcoholic, price, ingredients, instructions, image_path
     FROM drinks
     ORDER BY created_at DESC"
  );
  echo json_encode($stmt->fetchAll());
  exit;
}

/* =======================
   POST – crear trago
======================= */
if ($method === "POST") {
  $name = $_POST["name"] ?? "";
  $category = $_POST["category"] ?? "";
  $price = $_POST["price"] ?? "0";

  $isAlcoholic = isset($_POST["is_alcoholic"]) ? (int)$_POST["is_alcoholic"] : 0;
  $ingredients = $_POST["ingredients"] ?? null;
  $instructions = $_POST["instructions"] ?? null;

  if (trim($name) === "") {
    http_response_code(400);
    echo json_encode(["error" => "El nombre es obligatorio"]);
    exit;
  }

  // Normalizaciones importantes
  $isAlcoholic = $isAlcoholic ? 1 : 0;

  // price: si viene "" o algo no numérico => 0
  $price = is_numeric($price) ? $price : "0";

  // ingredients/instructions: si vienen "" => NULL (para no romper constraints)
  if ($ingredients !== null && trim($ingredients) === "") $ingredients = null;
  if ($instructions !== null && trim($instructions) === "") $instructions = null;

  $imagePathDB = null;

  if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . "/../../uploads/drinks/";
    if (!is_dir($uploadDir)) {
      mkdir($uploadDir, 0777, true);
    }

    $ext = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
    $allowed = ["jpg", "jpeg", "png", "webp"];

    if (!in_array($ext, $allowed, true)) {
      http_response_code(400);
      echo json_encode(["error" => "Formato inválido"]);
      exit;
    }

    $fileName = uniqid("drink_") . "." . $ext;
    $dest = $uploadDir . $fileName;

    if (!move_uploaded_file($_FILES["image"]["tmp_name"], $dest)) {
      http_response_code(500);
      echo json_encode(["error" => "No se pudo guardar la imagen"]);
      exit;
    }

    $imagePathDB = "uploads/drinks/" . $fileName;
  }

  try {
    $stmt = $pdo->prepare(
      "INSERT INTO drinks (name, category, is_alcoholic, price, ingredients, instructions, image_path)
       VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
      $name,
      $category,
      $isAlcoholic,
      $price,
      $ingredients,
      $instructions,
      $imagePathDB
    ]);

    echo json_encode([
      "success" => true,
      "id" => (int)$pdo->lastInsertId()
    ]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
      "error" => "Error al insertar en la base de datos",
      "details" => $e->getMessage()
    ]);
  }
  exit;
}

/* =======================
   PUT – editar trago
======================= */
if ($method === "PUT") {
  $id = isset($_GET["id"]) ? (int)$_GET["id"] : 0;

  if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "ID inválido"]);
    exit;
  }

  parse_str(file_get_contents("php://input"), $putData);

  $name = $putData["name"] ?? "";
  $category = $putData["category"] ?? "";
  $price = $putData["price"] ?? "0";

  $isAlcoholic = isset($putData["is_alcoholic"]) ? (int)$putData["is_alcoholic"] : 0;
  $ingredients = $putData["ingredients"] ?? null;
  $instructions = $putData["instructions"] ?? null;

  if (trim($name) === "") {
    http_response_code(400);
    echo json_encode(["error" => "El nombre es obligatorio"]);
    exit;
  }

  // Normalizaciones importantes
  $isAlcoholic = $isAlcoholic ? 1 : 0;
  $price = is_numeric($price) ? $price : "0";
  if ($ingredients !== null && trim($ingredients) === "") $ingredients = null;
  if ($instructions !== null && trim($instructions) === "") $instructions = null;

  $stmt = $pdo->prepare("SELECT image_path FROM drinks WHERE id = ?");
  $stmt->execute([$id]);
  $current = $stmt->fetch();

  if (!$current) {
    http_response_code(404);
    echo json_encode(["error" => "Trago no encontrado"]);
    exit;
  }

  try {
    $stmt = $pdo->prepare(
      "UPDATE drinks
       SET name = ?, category = ?, is_alcoholic = ?, price = ?, ingredients = ?, instructions = ?
       WHERE id = ?"
    );
    $stmt->execute([
      $name,
      $category,
      $isAlcoholic,
      $price,
      $ingredients,
      $instructions,
      $id
    ]);

    echo json_encode(["success" => true]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
      "error" => "Error al actualizar en la base de datos",
      "details" => $e->getMessage()
    ]);
  }
  exit;
}

/* =======================
   DELETE – eliminar trago
======================= */
if ($method === "DELETE") {
  $id = isset($_GET["id"]) ? (int)$_GET["id"] : 0;

  if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "ID inválido"]);
    exit;
  }

  $stmt = $pdo->prepare("SELECT image_path FROM drinks WHERE id = ?");
  $stmt->execute([$id]);
  $drink = $stmt->fetch();

  if (!$drink) {
    http_response_code(404);
    echo json_encode(["error" => "Trago no encontrado"]);
    exit;
  }

  try {
    $del = $pdo->prepare("DELETE FROM drinks WHERE id = ?");
    $del->execute([$id]);

    if (!empty($drink["image_path"])) {
      $file = __DIR__ . "/../../" . $drink["image_path"];
      if (file_exists($file)) {
        unlink($file);
      }
    }

    echo json_encode(["success" => true]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
      "error" => "Error al eliminar en la base de datos",
      "details" => $e->getMessage()
    ]);
  }
  exit;
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
