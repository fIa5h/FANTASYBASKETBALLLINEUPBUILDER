<?php


function colorize($text, $status) {
 $out = "";
 switch($status) {
  case "SUCCESS":
   $out = "[1;37;42m"; //Green background
   break;
  case "FAILURE":
   $out = "[1;37;41m"; //Red background
   break;
  case "WARNING":
   $out = "[1;37;43m"; //Yellow background
   break;
  case "NOTE":
   $out = "[1;37;44m"; //Blue background
   break;
  default:
   throw new Exception("Invalid status: " . $status);
 }
 return chr(27) . "$out" . "$text" . chr(27) . "[0m";
}


//
//
//
//
// READ ME
// YOU NEED TO DELETE THE TITLES
// THIS ONLY WORKS FOR FANDUEL
echo "\n";
echo "\n";
echo  " _ .-') _               .-')    
( (  OO) )             ( OO ).  
 \     .'_    ,------.(_)---\_) 
 ,`'--..._)('-| _.---'/    _ |  
 |  |  \  '(OO|(_\    \  :` `.  
 |  |   ' |/  |  '--.  '..`''.) 
 |  |   / :\_)|  .--' .-._)   \ 
 |  '--'  /  \|  |_)  \       / 
 `-------'    `--'     `-----'  ";
echo "\n";
echo "\n";
echo " Welcome to DFS Line-up Ghost";
sleep(1);
echo "\n";
echo " . ";
sleep(1);
echo "\n";
echo " . ";
sleep(1);
echo "\n";
echo " . ";
sleep(1);
echo "\n";
echo "\n";
echo " I need you enter the name of a CSV file";
sleep(1);
echo "\n";
echo " . ";
sleep(1);
echo "\n";
echo " . ";
echo "\n";
echo " The CSV should be in the same\n directory/folder as this file.\n (i.e. both on your desktop)";
sleep(1);
echo "\n";
echo "\n";
echo colorize(" Please enter the full .csv file name: ", "NOTE");
$handle = fopen ("php://stdin","r");
$line = fgets($handle);
$file_name = trim($line);
if( strpos($file_name, '.csv') === false){
  echo colorize(" Please give me a .csv file name...\nExiting... ", "FAILURE");
  exit;
}else{
  echo colorize(" Ok... Looking for ".$file_name, "SUCCESS");
  echo "\n\n";

  $csv = array_map('str_getcsv', file($file_name));
 
  if(!$csv){
    echo colorize(" Please give me a .csv file in the same folder/directory as this file...\n(Put them both on your desktop?)...\nExiting... ", "FAILURE");
    exit;
  }else{
    echo colorize(" File found...", "SUCCESS");
    echo "\n\n";
  }
  echo colorize(" Importing raw CSV ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo colorize(" . ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo colorize(" . ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo colorize(" . ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo "\n";
}

/*

  [0]=>
  string(2) "id"
  [1]=>
  string(9) "last_name"
  [2]=>
  string(10) "first_name"
  [5]=>
  string(8) "opponent"
  [6]=>
  string(7) "minutes"
  [7]=>
  string(6) "points"
  [9]=>
  string(8) "rebounds"
  [10]=>
  string(7) "assists"
  [11]=>
  string(6) "steals"
  [12]=>
  string(6) "blocks"
  [13]=>
  string(9) "turnovers"
  [21]=>
  string(13) "price_fanduel"
  [30]=>
  string(17) "positions_fanduel"

*/
  $formatted_player_array = [];
  $formatted_player_array_counter = 0;

  echo colorize(" Reformatting data ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo colorize(" . ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo colorize(" . ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo colorize(" . ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo "\n";
  echo " Next, you have the option to limit players based upon your projections";
  echo "\n";
  echo " **** VALUE = (projected_points/cost) * 10000 ";
  echo "\n";
  echo colorize(" If you don't limit your search the program can take a VERY long time... ", "FAILURE");
  echo "\n";
  echo "\n";
  sleep(2);
  echo colorize(" Would you like to limit your potential lineups based on minimum projected POINTS (enter: points), best projected VALUE minimum (enter: value), BOTH (enter: both) or NONE (enter: none) : ", "NOTE");
  $handle = fopen ("php://stdin","r");
  $line = fgets($handle);
  $input = trim($line);
  if( $input != 'both' && $input != 'points' && $input != 'value' && $input != 'none'){
    echo colorize(" You have to enter a valid choice... Exiting... ", "FAILURE");
    exit;
  }else{

  }
  echo "\n";
  echo colorize(" . ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo colorize(" . ", "SUCCESS");
  echo "\n";
  echo colorize(" Please enter your MINIMUM allowed individual player projected POINTS: ", "NOTE");
  $handle = fopen ("php://stdin","r");
  $line = fgets($handle);
  $minimum_points = trim($line);
  if(  is_numeric($minimum_points) === false){
    echo colorize(" You have to enter a number... Exiting... ", "FAILURE");
    exit;
  }

  echo "\n";
  echo colorize(" . ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo colorize(" . ", "SUCCESS");
  echo "\n";
  echo colorize(" Please enter your MINIMUM allowed individual player projected VALUE: ", "NOTE");
  $handle = fopen ("php://stdin","r");
  $line = fgets($handle);
  $minimum_value = trim($line);
  if(  is_numeric($minimum_value) === false){
    echo colorize(" You have to enter a number... Exiting... ", "FAILURE");
    exit;
  }

  foreach($csv as $player){

    $projected_points = $player[7] + ($player[9] * 1.2) + ($player[10] * 1.5) + ($player[11] * 2) + ($player[12] * 2) - $player[13] ;
    $projected_value = ($projected_points/$player[21]) * 10000;

    if($projected_points > $minimum_points || $projected_value > $minimum_value){

        $formatted_player_array[$formatted_player_array_counter][0] = $player[0];
        //[0]=>string(2) "id"

        $formatted_player_array[$formatted_player_array_counter][1] = $player[1];
        //[1]=>string(9) "last_name"

        $formatted_player_array[$formatted_player_array_counter][2] = $player[2];
        //[2]=>string(10) "first_name"

        $formatted_player_array[$formatted_player_array_counter][3] = $player[5];
        //[5]=>string(8) "opponent"

        $formatted_player_array[$formatted_player_array_counter][4] = $player[6];
        //[6]=>string(7) "minutes" 

        $formatted_player_array[$formatted_player_array_counter][5] = $player[7];
        //[7]=>string(6) "points"

        $formatted_player_array[$formatted_player_array_counter][7] = $player[9];
        //[9]=>string(8) "rebounds"

        $formatted_player_array[$formatted_player_array_counter][8] = $player[10];
        //[10]=>string(7) "assists"

        $formatted_player_array[$formatted_player_array_counter][9] = $player[11];
        //[11]=>string(6) "steals"

        $formatted_player_array[$formatted_player_array_counter][10] = $player[12];
        //[12]=>string(6) "blocks"

        $formatted_player_array[$formatted_player_array_counter][11] = $player[13];
        //[13]=>string(9) "turnovers"

        $formatted_player_array[$formatted_player_array_counter][12] = $player[21];
        //[21]=>string(13) "price_fanduel"

        $formatted_player_array[$formatted_player_array_counter][13] = $player[30];
        //[30]=>string(17) "positions_fanduel"

        $formatted_player_array[$formatted_player_array_counter][14] = $projected_points;
        //projected fanduel points

        $formatted_player_array[$formatted_player_array_counter][15] = $projected_value;
        //projected value

        $formatted_player_array_counter++;

    }

  }
  echo "\n";
  echo colorize(" Making positional pairs ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo colorize(" . ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo colorize(" . ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo colorize(" . ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo "\n";

  $salary_cap = 60000;
  $memo_array = [];
  $unsuccesful_memo_array = [];
  $top_value_teams = [];

  $pg_array = [];
  $pg_pairs = [];
  $pg_counter = 0;

  $sg_array = [];
  $sg_pairs = [];
  $sg_counter = 0;

  $sf_array = [];
  $sf_pairs = [];
  $sf_counter = 0;

  $pf_array = [];
  $pf_pairs = [];
  $pf_counter = 0;

  $c_array = [];
  //$c_pairs = [];
  $c_counter = 0;

  foreach($formatted_player_array as $palyer_by_position){

    if($palyer_by_position[13] == 'PG'){

      $pg_array[$pg_counter][0] = $palyer_by_position[12];
      //price
      $pg_array[$pg_counter][1] = $palyer_by_position[14];
      //points
      $pg_array[$pg_counter][2] = $palyer_by_position[15];
      //value
      $pg_array[$pg_counter][3] = $palyer_by_position[0];
      //unique_id
      $pg_array[$pg_counter][4] = $palyer_by_position[2].' '.$palyer_by_position[1];
      //first_last

      $pg_counter++;

    }elseif($palyer_by_position[13] == 'SG'){

      $sg_array[$sg_counter][0] = $palyer_by_position[12];
      //price
      $sg_array[$sg_counter][1] = $palyer_by_position[14];
      //points
      $sg_array[$sg_counter][2] = $palyer_by_position[15];
      //value
      $sg_array[$sg_counter][3] = $palyer_by_position[0];
      //unique_id
      $sg_array[$sg_counter][4] = $palyer_by_position[2].' '.$palyer_by_position[1];
      //first_last

      $sg_counter++;

    }elseif($palyer_by_position[13] == 'SF'){

      $sf_array[$sf_counter][0] = $palyer_by_position[12];
      //price
      $sf_array[$sf_counter][1] = $palyer_by_position[14];
      //points
      $sf_array[$sf_counter][2] = $palyer_by_position[15];
      //value
      $sf_array[$sf_counter][3] = $palyer_by_position[0];
      //unique_id
      $sf_array[$sf_counter][4] = $palyer_by_position[2].' '.$palyer_by_position[1];
      //first_last

      $sf_counter++;
      
    }elseif($palyer_by_position[13] == 'PF'){

      $pf_array[$pf_counter][0] = $palyer_by_position[12];
      //price
      $pf_array[$pf_counter][1] = $palyer_by_position[14];
      //points
      $pf_array[$pf_counter][2] = $palyer_by_position[15];
      //value
      $pf_array[$pf_counter][3] = $palyer_by_position[0];
      //unique_id
      $pf_array[$pf_counter][4] = $palyer_by_position[2].' '.$palyer_by_position[1];
      //first_last

      $pf_counter++;
      
    }elseif($palyer_by_position[13] == 'C'){

      $c_array[$c_counter][0] = $palyer_by_position[12];
      //price
      $c_array[$c_counter][1] = $palyer_by_position[14];
      //points
      $c_array[$c_counter][2] = $palyer_by_position[15];
      //value
      $c_array[$c_counter][3] = $palyer_by_position[0];
      //unique_id
      $c_array[$c_counter][4] = $palyer_by_position[2].' '.$palyer_by_position[1];
      //first_last

      $c_counter++;
      
    }

  }

  //let's start making our positional memos
  foreach($pg_array as $pg){

    foreach($pg_array as $possible_pg_pair){

        if(!array_key_exists($pg[3].':'.$possible_pg_pair[3], $pg_pairs) && !array_key_exists($possible_pg_pair[3].':'.$pg[3], $pg_pairs) && $possible_pg_pair[3] != $pg[3]){

          $pg_pairs[$pg[3].':'.$possible_pg_pair[3]]['value'] = $pg[2] + $possible_pg_pair[2];
          $pg_pairs[$pg[3].':'.$possible_pg_pair[3]]['points'] = $pg[1] + $possible_pg_pair[1];
          $pg_pairs[$pg[3].':'.$possible_pg_pair[3]]['price'] = $pg[0] + $possible_pg_pair[0];
          $pg_pairs[$pg[3].':'.$possible_pg_pair[3]]['key'] = $pg[3].':'.$possible_pg_pair[3];
          $pg_pairs[$pg[3].':'.$possible_pg_pair[3]]['names'] = $pg[4].'__'.$possible_pg_pair[4];

        }

    }

  }

  foreach($sg_array as $sg){

    foreach($sg_array as $possible_sg_pair){

        if(!array_key_exists($sg[3].':'.$possible_sg_pair[3], $sg_pairs) && !array_key_exists($possible_sg_pair[3].':'.$sg[3], $sg_pairs) && $possible_sg_pair[3] != $sg[3]){

          $sg_pairs[$sg[3].':'.$possible_sg_pair[3]]['value'] = $sg[2] + $possible_sg_pair[2];
          $sg_pairs[$sg[3].':'.$possible_sg_pair[3]]['points'] = $sg[1] + $possible_sg_pair[1];
          $sg_pairs[$sg[3].':'.$possible_sg_pair[3]]['price'] = $sg[0] + $possible_sg_pair[0];
          $sg_pairs[$sg[3].':'.$possible_sg_pair[3]]['key'] = $sg[3].':'.$possible_sg_pair[3];
          $sg_pairs[$sg[3].':'.$possible_sg_pair[3]]['names'] = $sg[4].'__'.$possible_sg_pair[4];
        }

    }

  }

  foreach($sf_array as $sf){

    foreach($sf_array as $possible_sf_pair){

        if(!array_key_exists($sf[3].':'.$possible_sf_pair[3], $sf_pairs) && !array_key_exists($possible_sf_pair[3].':'.$sf[3], $sf_pairs) && $possible_sf_pair[3] != $sf[3]){

          $sf_pairs[$sf[3].':'.$possible_sf_pair[3]]['value'] = $sf[2] + $possible_sf_pair[2];
          $sf_pairs[$sf[3].':'.$possible_sf_pair[3]]['points'] = $sf[1] + $possible_sf_pair[1];
          $sf_pairs[$sf[3].':'.$possible_sf_pair[3]]['price'] = $sf[0] + $possible_sf_pair[0];
          $sf_pairs[$sf[3].':'.$possible_sf_pair[3]]['key'] = $sf[3].':'.$possible_sf_pair[3];
          $sf_pairs[$sf[3].':'.$possible_sf_pair[3]]['names'] = $sf[4].'__'.$possible_sf_pair[4];
        }

    }

  }

  foreach($pf_array as $pf){

    foreach($pf_array as $possible_pf_pair){


        if(!array_key_exists($pf[3].':'.$possible_pf_pair[3], $pf_pairs) && !array_key_exists($possible_pf_pair[3].':'.$pf[3], $pf_pairs) && $possible_pf_pair[3] != $pf[3]){

          $pf_pairs[$pf[3].':'.$possible_pf_pair[3]]['value'] = $pf[2] + $possible_pf_pair[2];
          $pf_pairs[$pf[3].':'.$possible_pf_pair[3]]['points'] = $pf[1] + $possible_pf_pair[1];
          $pf_pairs[$pf[3].':'.$possible_pf_pair[3]]['price'] = $pf[0] + $possible_pf_pair[0];
          $pf_pairs[$pf[3].':'.$possible_pf_pair[3]]['key'] = $pf[3].':'.$possible_pf_pair[3];
          $pf_pairs[$pf[3].':'.$possible_pf_pair[3]]['names'] = $pf[4].'__'.$possible_pf_pair[4];
        }

    }

  }

  echo "\n";
  ini_set('memory_limit', '-1');
  echo colorize(" Comparing potential lineups ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo colorize(" . ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo colorize(" . ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo colorize(" . ", "SUCCESS");
  sleep(1);
  echo "\n";
  echo "\n";
  $iteration_counter = 0;


  foreach($pg_pairs as $pg_pair){

    //good

    foreach($sg_pairs as $sg_pair){

      //good

      foreach($sf_pairs as $sf_pair){

        //good

        foreach($pf_pairs as $pf_pair){

          //good

          foreach($c_array as $c){

            // $memo_array = [];
            // $unsuccesful_memo_array = [];

            $pairing_price = $pg_pair['price'] + $sg_pair['price'] + $sf_pair['price'] + $pf_pair['price'] + $c[0];
            $pairing_value = $pg_pair['points'] + $sg_pair['points'] + $sf_pair['points'] + $pf_pair['points'] + $c[1];
            $key = $pg_pair['key'].':'.$sg_pair['key'].':'.$sf_pair['key'].':'.$pf_pair['key'].':'.$c[3];

            // $pg_QA_memo = [];
            // $sg_QA_memo = [];
            // $sf_QA_memo = [];
            // $pf_QA_memo = [];

            if($pairing_price <= $salary_cap && $pairing_price >= 57500 && !array_key_exists($key, $unsuccesful_memo_array) && !array_key_exists($key, $memo_array)){

              $memo_array[$key]['price'] = $pairing_price;
              $memo_array[$key]['points'] = $pairing_value;
              $memo_array[$key]['names'] = $pg_pair['names'].'__'.$sg_pair['names'].'__'.$sf_pair['names'].'__'.$pf_pair['names'].'__'.$c[4];
              echo "\n";

              if($iteration_counter < 10){
                $pretty_console = 'Lineups analyzed: 0000000000';
              }elseif($iteration_counter < 100){
                $pretty_console = 'Lineups analyzed: 000000000';
              }elseif($iteration_counter < 1000){
                $pretty_console = 'Lineups analyzed: 00000000';
              }elseif($iteration_counter < 10000){
                $pretty_console = 'Lineups analyzed: 0000000';
              }elseif($iteration_counter < 100000){
                $pretty_console = 'Lineups analyzed: 000000';
              }elseif($iteration_counter < 1000000){
                $pretty_console = 'Lineups analyzed: 00000';
              }elseif($iteration_counter < 10000000){
                $pretty_console = 'Lineups analyzed: 0000';
              }elseif($iteration_counter < 1000000000){
                $pretty_console = 'Lineups analyzed: 000';
              }

              echo $pretty_console.''.$iteration_counter;
              $iteration_counter++;

            }elseif(!array_key_exists($key, $unsuccesful_memo_array)){

              $unsuccesful_memo_array[$key]['price'] = $pairing_price;
              $unsuccesful_memo_array[$key]['points'] = $pairing_value;
              echo "\n";
              if($iteration_counter < 10){
                $pretty_console = 'Lineups analyzed: 0000000000';
              }elseif($iteration_counter < 100){
                $pretty_console = 'Lineups analyzed: 000000000';
              }elseif($iteration_counter < 1000){
                $pretty_console = 'Lineups analyzed: 00000000';
              }elseif($iteration_counter < 10000){
                $pretty_console = 'Lineups analyzed: 0000000';
              }elseif($iteration_counter < 100000){
                $pretty_console = 'Lineups analyzed: 000000';
              }elseif($iteration_counter < 1000000){
                $pretty_console = 'Lineups analyzed: 00000';
              }elseif($iteration_counter < 10000000){
                $pretty_console = 'Lineups analyzed: 0000';
              }elseif($iteration_counter < 1000000000){
                $pretty_console = 'Lineups analyzed: 000';
              }

              echo $pretty_console.''.$iteration_counter;
              $iteration_counter++;

            }

          }

        }

      }

    }

  }
  

// unblock below if the file doesn't exist
// otherwise you can't rewrite headers
// header("Content-type: text/csv");
// header("Content-Disposition: attachment; filename=results.csv");
// header("Pragma: no-cache");
// header("Expires: 0"); 
echo "\n";
echo "\n";
echo 'Printing csv...';
echo "\n"; 
echo "\n";
$file = fopen('results.csv', 'w');

function cmp( $a, $b )
{ 
  if(  $a['points'] >  $b['points'] ){ return $a ; }
  else{ return $b ; } 
} 
//usort($memo_array,'cmp');
//$count = 250;
//while($count > 0){
  foreach ($memo_array as $row) {
    if($row['points'] > 250){
      fputcsv($file, $row);
    }
    //$count = $count-1;              
  }
//}
echo colorize(" Done! ", "SUCCESS");
echo "\n";
echo "\n";
echo " Check your desktop for ";
echo colorize(" results.csv ", "FAILURE");
echo "\n";
echo "\n"; 
exit();

?>