<?php
    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

    ini_set("session.cookie_httponly", 1);//to prevent session hijacking
    session_start(); //start a session for the user

    //Because you are posting the data via fetch(), php has to retrieve it elsewhere.
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);

    


    // check if use logged in
    if ($_SESSION['isLoggedIn']){
        //session_start(); //start a session for the user
        $user_id=$_SESSION["userid"];
        
        require 'database.php'; //establish a database connection to execute sql commands
       
        // Use a prepared statement
        $stmt = $mysqli->prepare("SELECT username, id
                                    FROM users");

        // print a error if sql failed        
        if(!$stmt){
            echo json_encode(array(
                "success" => false,
                "message" => "Query Prep Failed: $mysqli->error"
            ));
            exit;
        }

        // Bind the parameter
        $stmt->execute();
        $stmt->bind_result($username, $user_id);

        $response_array=array();

        $ite=0;
        while($stmt->fetch()){

            if ($user_id != $_SESSION['userid']){
                // $current_event=array(
                //     "response_id" => $ite, 
                //     "event_id" => $events_id,
                //     "event_title" => $events_title, 
                //     "event_date" => $events_date,
                //     "event_time" => $events_time, 
                //     "event_tag" => $events_tag,
                //     "event_user_id" => $events_user_id, 
                //     "user_username" => $user_username
                // );
                $current_user = array();
                $current_user["username"] = $username; 
                $current_user["user_id"] = $user_id; 
                array_push($response_array, $current_user);
                //$current_response=array("event_$ite" => $current_event);
                //array_push($response_array, $current_response);
                // $current_event_id="event_".$ite;
                // $response_array[$current_event_id]=$current_event;
                // $ite=$ite+1; 
            }
        }

        $stmt->close();

        // if success
        //$response_message=array("success" => true);
        //$response_array.push($response_message);
        //array_push($response_array, "success" => true);
        $response_array["success"]=true;
        echo json_encode($response_array);
        
        // echo json_encode(array(
        //     "success" => true,
        //     "message" =>  "Your event has been added."
        // ));
        // exit;

    }else{
        echo json_encode(array(
            "success" => false,
            "message" => "Please log in to add events. "
        ));
        exit;
    }
    ?>