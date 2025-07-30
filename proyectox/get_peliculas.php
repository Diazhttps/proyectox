<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$mysqli = new mysqli("localhost", "root", "", "empresa");

if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit();
}

$query = "
    SELECT 
        peliculas.titulo AS pelicula,
        peliculas.actor,
        peliculas.presupuesto,
        peliculas.productora,
        directores.nombre AS director,
        directores.patrimonio
    FROM 
        peliculas
    INNER JOIN 
        directores 
    ON 
        peliculas.director_id = directores.id
";

$result = $mysqli->query($query);

$peliculas = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $peliculas[] = $row;
    }
    echo json_encode(["success" => true, "data" => $peliculas]);
} else {
    echo json_encode(["success" => false, "message" => "Error en la consulta"]);
}
?>