<?php
	include_once 'db.inc.php';

	//_______________________________________________________________________________

	function addMessage($message)
	{
		$link = mysql_connect(DB_INFO, DB_USER, DB_PASS);
		if(!$link)
			die('Connection failed: ' . mysql_error());

		$db = mysql_select_db(DB_NAME);

		$sql = sprintf("INSERT INTO messages (body, sent) VALUES('%s', 'NO')",
				mysql_real_escape_string($message));
		$result = mysql_query($sql);
	}

	//_______________________________________________________________________________

	function markMessage($message)
	{
		$link = mysql_connect(DB_INFO, DB_USER, DB_PASS);
		if(!$link)
			die('Connection failed: ' . mysql_error());

		$db = mysql_select_db(DB_NAME);

		$sql = sprintf("UPDATE message SET processed=1 WHERE processed=0 AND body='%s'",
					   mysql_real_escape_string($message));

		$result = mysql_query($sql);
	}

	//_______________________________________________________________________________

	function getMessage()
	{
		$link = mysql_connect(DB_INFO, DB_USER, DB_PASS);
		if(!$link)
			die('Connection failed: ' . mysql_error());

		$db = mysql_select_db(DB_NAME);

		$sql = "SELECT body FROM messages WHERE sent='NO' LIMIT 1";
		$result = mysql_query($sql);
		if(!$result)
			die('empty!');

		$row = mysql_fetch_array($result, MYSQL_NUM);

		mysql_free_result($result);
		return $row[0];
	}

	//__________________________________ setRequest _______________________________

	function setHitRequest($requestId, $id, $x, $y, $result){
		//echo 'received ' . $x . $y;

		$link = mysql_connect(DB_INFO, DB_USER, DB_PASS);
		if(!$link)
			die('Connection failed: ' . mysql_error());

		$db = mysql_select_db(DB_NAME);

		if($result == null)
			$sql = sprintf("INSERT INTO message (requestId, userFrom, x, y) VALUES(%d, '%s', %d, %d)", $requestId, $id, $x, $y);
		else
			$sql = sprintf("INSERT INTO message (requestId, userFrom, x, y, reply, result) VALUES(%d, '%s', %d, %d, 1, %d)", $requestId, $id, $x, $y, $result);

		// $sql = "INSERT INTO message (userFrom, x, y) VALUES('7', 7, 7)";
		$result = mysql_query($sql, $link);

		if(!$result)
			die(mysql_error());

		mysql_close($link);
		return $result;
	}

	//__________________________________ getHitResponse __________________________

	function getHitResponse($user){
		$link = mysql_connect(DB_INFO, DB_USER, DB_PASS);
		if(!$link)
			die('Connection failed: ' . mysql_error());

		$db = mysql_select_db(DB_NAME);

		$sql = sprintf("SELECT * FROM message WHERE processed=0 AND userFrom != %d LIMIT 1", $user);
		$result = mysql_query($sql);

		//return $sql;


		if(!$result)
			die(mysql_error());

		$rows = array();
		while($r = mysql_fetch_assoc($result)) {
    	$rows[] = $r;
		}
		mysql_free_result($result);

		// mark as read
		if(count($rows) > 0){
			$sql = sprintf("UPDATE message SET processed=1 WHERE processed=0 AND requestId=%d", $rows[0]['requestId']);
			$result = mysql_query($sql);

			// return JSON string
			return json_encode($rows);
		}
	}

	//__________________________________ getEnemyId ______________________________

	function getEnemyId($user){
		$link = mysql_connect(DB_INFO, DB_USER, DB_PASS);
		if(!$link)
			die('Connection failed: ' . mysql_error());

		$db = mysql_select_db(DB_NAME);

		// try to get empty slot to start the game
		$sql = "SELECT requestId, userA FROM battle WHERE userA IS NOT NULL AND userB IS NULL AND started = 0";
		$result = mysql_query($sql);


		if(mysql_num_rows($result) == 0){
			$requestId = time();
			// if empty - create a record and set userA
			$sql = sprintf("INSERT INTO battle (requestId, userA) VALUES(%d, %d)", $requestId, $user);
			$result = mysql_query($sql, $link);
		}
		else{
			$row = mysql_fetch_assoc($result);

			// commit the game
			$sql = sprintf("UPDATE battle SET userB=%d WHERE requestId=%d", $user, $row['requestId']);
			$result = mysql_query($sql, $link);

			// return enemy id
			return json_encode($row);
		}
	}

	//__________________________________ waitEnemyId _____________________________

	function waitEnemyId($user){
		$link = mysql_connect(DB_INFO, DB_USER, DB_PASS);
		if(!$link)
			die('Connection failed: ' . mysql_error());

		$db = mysql_select_db(DB_NAME);

		// get enemy for given user
		$sql = sprintf("SELECT requestId, userB FROM battle WHERE userA = %d", $user);
		$result = mysql_query($sql);

		if(mysql_num_rows($result) != 0){
			$row = mysql_fetch_assoc($result);
			return json_encode($row);
		}
	}

?>
