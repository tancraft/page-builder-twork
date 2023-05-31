<?php

// Récupération du code HTML, CSS, et images du canvas
$html = $_POST['html'];
$css = $_POST['css'];
$images = array();
foreach ($_FILES as $key => $value) {
	if (strpos($key, 'image') === 0) {
		$images[] = array(
			'name' => $value['name'],
			'tmp_name' => $value['tmp_name']
		);
	}
}

// Génération des noms de fichiers uniques
$htmlFilename = 'page-' . time() . '.html';
$cssFilename = 'page-' . time() . '.css';
$imageFilenames = array();
foreach ($images as $image) {
	$imageFilenames[] = 'image-' . time() . '-' . $image['name'];
}

// Enregistrement du code HTML, CSS, et images dans des fichiers temporaires
file_put_contents($htmlFilename, $html);
file_put_contents($cssFilename, $css);
foreach ($images as $i => $image) {
	$imageFilename = $imageFilenames[$i];
	file_put_contents($imageFilename, file_get_contents($image['tmp_name']));
}

// Création d'une archive ZIP contenant les fichiers HTML, CSS, et images
$zip = new ZipArchive();
$zipFilename = 'page-' . time() . '.zip';
if ($zip->open($zipFilename, ZipArchive::CREATE) === TRUE) {
	$zip->addFile($htmlFilename, 'index.html');
	$zip->addFile($cssFilename, 'style.css');
	foreach ($imageFilenames as $imageFilename) {
		$zip->addFile($imageFilename);
	}
	$zip->close();

	// Envoyer les en-têtes HTTP pour le téléchargement du fichier
	header('Content-Type: application/zip');
	header('Content-Disposition: attachment; filename="' . $zipFilename . '"');
	header('Content-Length: ' . filesize($zipFilename));

	// Envoyer le contenu du fichier ZIP au navigateur et supprimer les fichiers temporaires
	readfile($zipFilename);
	unlink($htmlFilename);
	unlink($cssFilename);
	foreach ($imageFilenames as $imageFilename) {
		unlink($imageFilename);
	}
} else {
	echo 'Erreur lors de la création de l\'archive ZIP';
}


