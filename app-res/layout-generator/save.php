<?php

function zipFolder($folderPath, $zipName) {
    // Vérifier si le dossier existe
    if (is_dir($folderPath)) {
      // Créer une instance de l'archive ZIP
      $zip = new ZipArchive();
  
      // Ouvrir l'archive ZIP avec le nom spécifié
      if ($zip->open($zipName, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
        // Ajouter le dossier lui-même à l'archive ZIP
        $zip->addEmptyDir(basename($folderPath));
  
        // Récupérer la liste de tous les fichiers et dossiers dans le dossier source
        $files = new RecursiveIteratorIterator(
          new RecursiveDirectoryIterator($folderPath),
          RecursiveIteratorIterator::SELF_FIRST
        );
  
        // Parcourir tous les fichiers et dossiers
        foreach ($files as $name => $file) {
            // Ignorer le dossier lui-même
            if ($name === $folderPath) {
            continue;
          }
  
          // Obtenir le chemin relatif du fichier par rapport au dossier source
          $relativePath = substr($name, strlen($folderPath) + 1);
  
          if ($file->isDir()) {
            // Ajouter un dossier à l'archive ZIP
            $zip->addEmptyDir($relativePath);
          } else {
            // Ajouter un fichier à l'archive ZIP
            $zip->addFile($name, $relativePath);
          }
        }
  
        // Fermer l'archive ZIP
        $zip->close();
  
        // Définir les en-têtes pour le téléchargement
        header("Content-type: application/zip");
        header("Content-Disposition: attachment; filename=\"$zipName\"");
        header("Content-length: " . filesize($zipName));
        header("Pragma: no-cache");
        header("Expires: 0");
  
        // Envoyer le contenu de l'archive ZIP au navigateur pour le téléchargement
        readfile($zipName);
  
        // Supprimer le fichier d'archive après l'envoi
        unlink($zipName);
  
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  
  // Exemple d'utilisation
  $folderPath = './'.$_POST['path'].'/';
  $zipName = "archive.zip";
  
  if (zipFolder($folderPath, $zipName)) {
    echo "L'archive ZIP a été créée et téléchargée avec succès.";
  } else {
    echo "Erreur lors de la création de l'archive ZIP.";
  }
  