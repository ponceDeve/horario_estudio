<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

$host = "localhost";
$user = "root";
$pass = "";
$db   = "pomodoro_db";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Conexión fallida: " . $conn->connect_error]);
  exit();
}

$action = $_GET['action'] ?? '';

// ── GET: obtener todos los repasos ────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'get_repasos') {
  $result = $conn->query("SELECT * FROM repasos ORDER BY fecha_completado DESC");
  $rows = [];
  while ($row = $result->fetch_assoc()) {
    $row['repasosDone'] = json_decode($row['repasos_done']);
    $row['fechaCompletado'] = $row['fecha_completado'];
    unset($row['repasos_done']);
    unset($row['fecha_completado']);
    $rows[] = $row;
  }
  echo json_encode($rows);
  exit();
}

// ── POST: guardar un repaso nuevo ─────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'save_repaso') {
  $data = json_decode(file_get_contents("php://input"), true);

  $subject  = $conn->real_escape_string($data['subject'] ?? '');
  $day      = $conn->real_escape_string($data['day'] ?? '');
  $level    = $conn->real_escape_string($data['level'] ?? '');
  $tema     = $conn->real_escape_string($data['tema'] ?? '');
  $fecha    = $conn->real_escape_string($data['fechaCompletado'] ?? date('Y-m-d'));
  $repasos  = $conn->real_escape_string(json_encode($data['repasosDone'] ?? []));

  // Evitar duplicados del mismo día
  $check = $conn->query("SELECT id FROM repasos WHERE subject='$subject' AND day='$day' AND fecha_completado='$fecha'");
  if ($check->num_rows > 0) {
    $row = $check->fetch_assoc();
    $id = $row['id'];
    if ($tema) {
      $conn->query("UPDATE repasos SET tema='$tema' WHERE id=$id");
    }
    echo json_encode(["ok" => true, "id" => $id, "updated" => true]);
  } else {
    $conn->query("INSERT INTO repasos (subject, day, level, tema, fecha_completado, repasos_done) VALUES ('$subject','$day','$level','$tema','$fecha','$repasos')");
    echo json_encode(["ok" => true, "id" => $conn->insert_id, "updated" => false]);
  }
  exit();
}

// ── PUT: marcar repaso como hecho ─────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'marcar_repaso') {
  $data = json_decode(file_get_contents("php://input"), true);

  $id           = intval($data['id'] ?? 0);
  $repasosDone  = $conn->real_escape_string(json_encode($data['repasosDone'] ?? []));

  $conn->query("UPDATE repasos SET repasos_done='$repasosDone' WHERE id=$id");
  echo json_encode(["ok" => true]);
  exit();
}

http_response_code(404);
echo json_encode(["error" => "Acción no encontrada"]);
$conn->close();
?>