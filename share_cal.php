<?php
    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

    ini_set("session.cookie_httponly", 1);//to prevent session hijacking
    session_start(); //start a session for the user

    //Because you are posting the data via fetch(), php has to retrieve it elsewhere.
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);

    // get variables from js
    // $title=$json_obj['title'];
    // $time=$json_obj["time"];
    // //$time=$time+":00";
    // $date=$json_obj["date"];
    // $tag = $json_obj["tag"];

    $user_id = $json_obj["user_id"];
    $length = sizeof($json_obj);
    $eventArray = array(); 
    // the loop to acquire data from json obj
    for ($i = 0; $i<$length-2; $i++){
        $eventIte = "event_".$i;
        $eventArray[$i]["event_title"]=$json_obj[$eventIte]["event_title"]; 
        $eventArray[$i]["event_date"]=$json_obj[$eventIte]["event_date"];
        $eventArray[$i]["event_time"]=$json_obj[$eventIte]["event_time"];
        $eventArray[$i]["event_tag"]=$json_obj[$eventIte]["event_tag"];
    }
    

    // check if use logged in
    if ($_SESSION['isLoggedIn']){
        //session_start(); //start a session for the user
        // $user_id=$_SESSION["userid"];
        
        require 'database.php'; //establish a database connection to execute sql commands
       
        // Use a prepared statement
        $stmt = $mysqli->prepare("insert into events (title, user_id, date, time, tag) values (?, ?, ?, ?, ?)");

        // print a error if sql failed        
        if(!$stmt){
            echo json_encode(array(
                "success" => false,
                "message" => "Query Prep Failed: $mysqli->error"
            ));
            exit;
        }

        // Bind the parameter
        // $stmt->bind_param('sssss', $title, $user_id, $date, $time, $tag);
        // $stmt->execute();
        // for loop to bind param into stmt
        for ($i = 0; $i<$length-1; $i++){
            $stmt->bind_param('sssss', $eventArray[$i]["event_title"], $user_id,  $eventArray[$i]["event_date"],  $eventArray[$i]["event_time"],  $eventArray[$i]["event_tag"]);
            $stmt->execute();
        }

        $stmt->close();

        echo json_encode(array(
            "success" => true,
            "message" =>  "Your event has been added."
        ));
        exit;

    }else{
        echo json_encode(array(
            "success" => false,
            "message" => "Please log in to add events. "
        ));
        exit;
    }


    // session_start(); //start a session for the user

    // require 'database.php'; //establish a database connection to execute sql commands
    // $password=password_hash($password, PASSWORD_DEFAULT);//hash the password input
    
    // // Use a prepared statement
    // $stmt = $mysqli->prepare("insert into events (username, hashed_password) values (?, ?)");
?>