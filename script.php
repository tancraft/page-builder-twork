<?php
//recup via post et decodeJson pour pourvoir apres traiter l ecriture des fichiers
$structure = json_decode(file_get_contents('php://input'), true)['structure'];

var_dump($structure);
