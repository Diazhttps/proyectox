<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ❗ SIN espacios en nombre de base de datos
$mysqli = new mysqli("localhost", "root", "", "proyectox");

if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit();
}

$username = $mysqli->real_escape_string($_POST['usuario'] ?? '');
$email = $mysqli->real_escape_string($_POST['correo'] ?? '');
$passwordRaw = $_POST['contrasena'] ?? '';

if (!$username || !$email || !$passwordRaw) {
    echo json_encode(["success" => false, "message" => "Faltan datos obligatorios"]);
    exit();
}

$password = password_hash($passwordRaw, PASSWORD_DEFAULT);

// Validación de existencia previa
$check = $mysqli->query("SELECT id FROM usuarios WHERE email = '$email'");
if ($check && $check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Correo ya registrado."]);
    exit();
}

$query = "INSERT INTO usuarios (usuario, email, password) VALUES ('$username', '$email', '$password')";
if ($mysqli->query($query)) {
    echo json_encode(["success" => true, "message" => "Registro exitoso"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al registrar: " . $mysqli->error]);
}
?>
