<?php
    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

    ini_set("session.cookie_httponly", 1);//to prevent session hijacking
    session_start(); //start a session for the user

     //Because you are posting the data via fetch(), php has to retrieve it elsewhere.
     $json_str = file_get_contents('php://input');
     //This will store the data into an associative array
     $json_obj = json_decode($json_str, true);

     //Get variables from js 
    $eventId = $json_obj['event_id'];
    $userId = $json_obj['user_id'];
    $eventTitle = $json_obj['event_title'];
    $eventDate = $json_obj['event_date'];
    $eventTime = $json_obj['event_time'];
    $eventTag = $json_obj['event_tag'];
    $token = $json_obj['token'];

    // verify token and if token changed, exit the script
    if (!hash_equals($_SESSION["token"], $token)){
        echo json_encode(array(
            "success" => false,
            "message" => "Request forgery detected."

        ));
        exit; 
    }

    // verify if user logged and is the author of the event to be deleted
    if ($_SESSION['isLoggedIn'] && $_SESSION['userid']==$userId){
        // establish database connection
        require "database.php"; 

        // Use a prepared statement
        $stmt = $mysqli->prepare("UPDATE events SET title=?, date=?, time=?, tag=? where id=?");

        // print a error if sql failed        
        if(!$stmt){
            echo json_encode(array(
                "success" => false,
                "message" => "Query Prep Failed: $mysqli->error"
            ));
            exit;
        }

        // Bind the parameter
        $stmt->bind_param('sssss', $eventTitle, $eventDate, $eventTime, $eventTag, $eventId);      
        $stmt->execute();
        $stmt->close();
        // if execute succeeded, return true
        echo json_encode(array(
            "success" => true,
            "message" => "This event has been modified. "
        ));
        exit; 
    
    }else{
        // print error message if user not owner
        echo json_encode(array(
            "success" => false,
            "message" => "Oops, it seems you are not the owner of this event. "
        ));
        exit;
    }
?>