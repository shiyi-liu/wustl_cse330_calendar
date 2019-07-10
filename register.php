<?php
    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

    ini_set("session.cookie_httponly", 1);//to prevent session hijacking
    
    //Because you are posting the data via fetch(), php has to retrieve it elsewhere.
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);

    //Get variables from js 
    $username = $json_obj['username'];
    $password = $json_obj['password'];

    // check if user input valid
    if( !preg_match('/^[\w_\.\-]+$/', $username) ){
        echo json_encode(array(
            "success" => false,
            "message" => "Invalid username"
        ));
        exit;
    }
    if( !preg_match('/^[\w_\.\-]+$/', $password) ){
        echo json_encode(array(
            "success" => false,
            "message" => "Invalid password"
        ));
        exit;
    }

    session_start(); //start a session for the user

    require 'database.php'; //establish a database connection to execute sql commands
    $password=password_hash($password, PASSWORD_DEFAULT);//hash the password input
    
    // Use a prepared statement
    $stmt = $mysqli->prepare("insert into users (username, hashed_password) values (?, ?)");

    // print a error if sql failed        
    if(!$stmt){
        //printf("<p class='error'>Query Prep Failed: %s\n </p>", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Query Prep Failed: $mysqli->error"
        ));
        exit;
    }

    // Bind the parameter
    $stmt->bind_param('ss', $username, $password);
    $stmt->execute();
    $stmt->close();
    //echo"ahhh";
    //return to js
    echo json_encode(array(
        "success" => true
    ));

?>