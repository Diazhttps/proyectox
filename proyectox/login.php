<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Conexión a la base de datos
$mysqli = new mysqli("localhost", "root", "", "proyectox");

if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit();
}

// Obtener datos del formulario enviados por POST
$email = $mysqli->real_escape_string($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(["success" => false, "message" => "Faltan datos obligatorios"]);
    exit();
}

// Buscar usuario por correo
$query = "SELECT * FROM usuarios WHERE email = '$email'";
$result = $mysqli->query($query);

if ($result && $result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Verificar contraseña
    if (password_verify($password, $user['password'])) {
        echo json_encode(["success" => true, "username" => $user['usuario']]);
    } else {
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
}
?>
