<?php
//This is all you need to configure.
// $twitteruser = "Rotoworld_BK";
// $notweets = 10;
// $consumerkey = "MWRqmd36h5cXRpsx4Gwp7fakv";
// $consumersecret = "ZHpYLyBk0wlUeRvcWK5wx058FUvYVwU0EEdwQY2090GYpvZ0WA";
// $accesstoken = "807486444-qPkvVK9An9dhxUVBSrgmzUyWr3JP1RzucTWbmQsE";
// $accesstokensecret = "b13Woo86mgZGfaUisW6iGoarvBxFN8QqPZ1DVdWI9yRpY";


$app_key = 'MWRqmd36h5cXRpsx4Gwp7fakv';
$app_token = 'ZHpYLyBk0wlUeRvcWK5wx058FUvYVwU0EEdwQY2090GYpvZ0WA';
//These are our constants.
$api_base = 'https://api.twitter.com/';
$bearer_token_creds = base64_encode($app_key.':'.$app_token);
//Get a bearer token.
$opts = array(
  'http'=>array(
    'method' => 'POST',
    'header' => 'Authorization: Basic '.$bearer_token_creds."\r\n".
               'Content-Type: application/x-www-form-urlencoded;charset=UTF-8',
    'content' => 'grant_type=client_credentials'
  )
);
$context = stream_context_create($opts);
$json = file_get_contents($api_base.'oauth2/token',false,$context);
$result = json_decode($json,true);
if (!is_array($result) || !isset($result['token_type']) || !isset($result['access_token'])) {
  die("Something went wrong. This isn't a valid array: ".$json);
}
if ($result['token_type'] !== "bearer") {
  die("Invalid token type. Twitter says we need to make sure this is a bearer.");
}
//Set our bearer token. Now issued, this won't ever* change unless it's invalidated by a call to /oauth2/invalidate_token.
//*probably - it's not documentated that it'll ever change.
$bearer_token = $result['access_token'];
//Try a twitter API request now.
$opts = array(
  'http'=>array(
    'method' => 'GET',
    'header' => 'Authorization: Bearer '.$bearer_token
  )
);
$context = stream_context_create($opts);
$json = file_get_contents($api_base.'1.1/statuses/user_timeline.json?count=10&screen_name=Rotoworld_BK',false,$context);
$tweets = json_decode($json,true);


// No errors exist. Write tweets to json/txt file.
$file = "cache/processed_tweets.js";
$fh = fopen($file, 'w') or die("can't open file");
fwrite($fh, "var tweets = ".json_encode($tweets));
fclose($fh);
  
if (file_exists($file)) {
   echo $file . " successfully written (" .round(filesize($file)/1024)."KB)";
} else {
    echo "Error encountered. File could not be written.";
}

//echo "@lgladdy's last tweet was: ".$tweets[0]['text']."\r\n";
?>








