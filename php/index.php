<?php

	// Initialize session data
	session_start();


	if($_SERVER['REQUEST_METHOD']=='GET')
	{
		$method = $_GET['method'];
		$user = $_GET['id'];

		// Include database credentials and connect to the database
		include_once 'inc/functions.inc.php';

		if($method == 'postmessage'){
			$x = $_GET['x'];
			$y = $_GET['y'];

			$requestId = time();
			$ret = setHitRequest($requestId, $user, $x, $y);
		}
		else if($method == 'getmessage'){
			$ret = getHitResponse($user);
		}
		else if($method == 'getenemyid'){
			$ret = getEnemyId($user);
		}

		echo $ret;
		exit;
	}
?>
