<?php
function Autoloader($classe)
{
    if (file_exists("app/" . $classe . ".php")) {
        require "app/" . $classe . ".php";
    }
}
spl_autoload_register("Autoloader");

function loadpage($page)
{
    $nom = $page[0];
    $titre = $page[1];
    if ($page[2]) // C'est une API
    {
        include $nom . '.php';
    } else {
        include $nom . '.php';
    }
}

$routes = [
    "Default" => ["home", "Accueil", false],
    "404" => ["404", "Accueil", false],
    "app" => ["app", "app", false],

];

if (isset($_GET["page"])) {

	$page = $_GET["page"];

	if (isset($routes[$page])) {
		loadpage($routes[$page]);
	} else {
		loadpage($routes["404"]);
	}
} else {
	loadpage($routes["Default"]);
}