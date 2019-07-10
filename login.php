<?php
	header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

	ini_set("session.cookie_httponly", 1);//to prevent session hijacking

	//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
	$json_str = file_get_contents('php://input');
	//This will store the data into an associative array
	$json_obj = json_decode($json_str, true);

	//Variables can be accessed as such:
	$username = $json_obj['username'];
	$password = $json_obj['password'];
	//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

	// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)
	require 'database.php'; //establish a database connection to execute sql commands
					
	// Use a prepared statement
	$stmt = $mysqli->prepare("SELECT COUNT(*), id, hashed_password FROM users WHERE username=?");

	// Bind the parameter
	$stmt->bind_param('s', $username);      
	$stmt->execute();

	// Bind the results
	$stmt->bind_result($cnt, $user_id, $pwd_hash);
	$stmt->fetch();


	if($cnt == 1 && password_verify($password, $pwd_hash)){
		session_start();
		$_SESSION['username'] = $username;
		$_SESSION['userid']=$user_id;
		$_SESSION["isLoggedIn"]=true; 
		$isLoggedIn=true;
		// create a token to prevent CSRF
		$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 

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

		echo json_encode(array(
			"success" => true,
			"user_id" => $user_id,
			"isLoggedIn" => $isLoggedIn,
			"username" => $username,
			"token" => $_SESSION["token"]
		));
		//echo("<p>success</p>");
		exit;
	}else{
		echo json_encode(array(
			"success" => false,
			"message" => "Incorrect Username or Password"
		));
		exit;
	}   
?>