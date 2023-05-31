<?php

require('./app/CreateFolder.php');
require('./app/CreateFile.php');

$obj = new CreateFolder();

$obj->Create();