<?php
class CreateFolder {
    public $folder = "folder-de-test";


    public function Create(){
        $chemin = '';

        $arbo = ['Html','Js', 'Css','Svg'];

        try {
            foreach ($arbo as $key) {
                if ($key != 'Html'){
                    $chemin = $this->folder.'/'. strtolower($key). '/';
                }else {
                    $chemin = $this->folder.'/';
                }
                $obj = new $key();
                mkdir('./' . $chemin, 0755, true);
                file_put_contents('./' . $chemin . $obj->name, $obj->create());
            }
        } catch (Exception $e) {
          var_dump($e->getMessage());
          die();
        }
        $zip = new ZipArchive();
        $zipname = $this->folder.'.zip';
        if ($zip->open($zipname, ZipArchive::CREATE) === TRUE) {
            $this->addFolderToZip($this->folder, $zip);
            $zip->close();
            header('Content-Type: application/zip');
            header('Content-disposition: attachment; filename='.$zipname);
            header('Content-Length: ' . filesize($zipname));
            readfile($zipname);
            unlink($zipname);
        }
        if(file_exists($this->folder)){
            $this->deleteDir($this->folder);
        }

    }
    private function addFolderToZip($folder, $zipArchive) {
        if (is_dir($folder)) {
            if ($dh = opendir($folder)) {
                $folder = str_replace("//", "/", $folder);
                $zipArchive->addEmptyDir(str_replace("../", "", $folder));
                while (($file = readdir($dh)) !== false) {
                    if (!is_file($folder . "/" . $file)) {
                        if ( ($file !== ".") && ($file !== "..") ) {
                            $this->addFolderToZip($folder . "/" . $file, $zipArchive);
                        }
                    } else {
                        $zipArchive->addFile($folder . "/" . $file);
                    }
                }
            }
        }
    }
    public function deleteDir($dirPath) {
        if (! is_dir($dirPath)) {
            throw new InvalidArgumentException("$dirPath must be a directory");
        }
        if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
            $dirPath .= '/';
        }
        $files = glob($dirPath . '*', GLOB_MARK);
        foreach ($files as $file) {
            if (is_dir($file)) {
                self::deleteDir($file);
            } else {
                unlink($file);
            }
        }
        rmdir($dirPath);
    }
}