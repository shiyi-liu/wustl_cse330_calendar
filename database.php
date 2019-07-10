<?php
    //Establish database connection
    $mysqli = new mysqli('localhost', 'wustl_inst', 'wustl_pass', 'calendar');
    if($mysqli->connect_errno) {
        printf("<p class='error'>Connection Failed: %s\n </p>", $mysqli->connect_error);
        exit;
    }
    
?>  