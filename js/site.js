var total_projected_team_score = 0;
var total_projected_team_value = 0;

var total_projected_team_points = 0;
var total_projected_team_rebounds = 0;
var total_projected_team_assists = 0;
var total_projected_team_steals = 0;
var total_projected_team_blocks = 0;
var total_projected_team_turnovers = 0;

var chosen_player_count = 0;

var budget = 60000;

var selected_pgs = [];
var selected_sgs = [];
var selected_sfs = [];
var selected_pfs = [];
var selected_cs = [];

var open_div = '';
var div_to_empty = '';	
var this_status = '';

var player_table_load_count = 0;	

$(document).ready(function() {

	$('[data-toggle="tooltip"]').tooltip(); 

	jQuery("abbr.timeago").timeago();
	
	//$('#popup_container').show();
	$('#popup_container').draggable().resizable();
	
	$(".resizeable").resizable({
	    containment: "#background"
	});

	$(".draggable").draggable({
	    cursor: "crosshair",
	    containment: "#background",
	});

	$('#example_filter').addClass('theme-color-text');

	$('.cf-funnel').each(function(){
	
		// Dummy data for Funnel chart
		funData = ['0.0','0.0','0.0','0.0','0.0','0.0'];
		funLabels = ['Points','Rebounds','Assists','Steals','Blocks','Turnovers'];

		// DEVELOPER NOTE

		// IF YOU ARE INTERESTED IN CUSTOM COLORS

		// customColors:['#66ce39','#66ce39','#66ce39','#66ce39','#66ce39','#f23c25']

		// DOES NOT WORK - I HARDED CODED AN ITERATION COUNTER IN controlfrog-plugins.js

		funOptions = {layout:'left',barOpacity:true,customColors:['#66ce39','#66ce39','#66ce39','#66ce39','#66ce39','#f23c25'] };
		
		cf_rFunnels[$(this).prop('id')] = new FunnelChart($(this).prop('id'), funData, funLabels, funOptions);
	});

} );

function renderPlayerTable(players_array){

	$('#player_table_loading').fadeIn();

	if(!players_array){
		console.log('no players_array');
	}else{

		$('#player_table').html('<tr>'+
									"<td></td>"+
									"<td></td>"+
									"<td></td>"+
									"<td></td>"+
									"<td></td>"+
									"<td></td>"+
									"<td></td>"+
									"<td></td>"+
									"<td></td>"+
									"<td></td>"+
									"<td></td>"+
									"<td></td>"+
									"<td></td>"+
									"<td></td>"+
								'</tr>');
		
		var arrayLength = players_array.length;
		for (var i = 0; i < arrayLength; i++) {
			var opponent = players_array[i]['opponent'].replace(/\s+/g, '');
			
			var points = players_array[i]['projected_fanduel_points'].toString().substring(0, 5);
			var value = players_array[i]['projected_fanduel_value'].toString().substring(0, 5);

			var icon = '';
			if(players_array[i]['top_pick']){
				if(players_array[i]['top_pick'] === 1 || players_array[i]['top_pick'] === '1'){
					icon = '&nbsp;<i class="fa fa-arrow-circle-up" style="color:#66ce39" data-toggle="tooltip" data-placement="right" title="Top Pick"></i>';
				}
			}

			var position = players_array[i]['position'];

			if (/PG/i.test(position)){

				var row_class = 'pg_row';

			}else if (/SG/i.test(position)){

				var row_class = 'sg_row';

			}else if (/SF/i.test(position)){

				var row_class = 'sf_row';

			}else if (/PF/i.test(position)){

				var row_class = 'pf_row';

			}else if (/C/i.test(position)){

				var row_class = 'c_row';

			}

			var score_color = redScaleInterpolate(55,points);
			var value_color = redScaleInterpolate(60,value);
			var minutes_color = redScaleInterpolate(48,parseInt(players_array[i]['minutes']));

			var price = parseInt(players[i]['price_fanduel']);
			
			var table_row = "<tr id='player_table_row"+players_array[i]['id']+"' class='"+row_class+" player_table_row' data-price='"+price+"'>"+
								"<td>"+players_array[i]['position']+"</td>"+
			                	"<td>"+players_array[i]['first_name']+" "+players_array[i]['last_name']+icon+"</td>"+
				                "<td>"+players[i]['price_fanduel']+"</td>"+
								"<td style='color:"+value_color+" !important;'>"+value+"</td>"+
								"<td style='color:"+score_color+" !important;'>"+points+"</td>"+
								"<td>"+opponent+"</td>"+
				                "<td style='color:"+minutes_color+" !important;'>"+players_array[i]['minutes']+"</td>"+
				                "<td>"+players_array[i]['points']+"</td>"+
				                "<td>"+players_array[i]['rebounds']+"</td>"+
				                "<td>"+players_array[i]['assists']+"</td>"+
				                "<td>"+players_array[i]['steals']+"</td>"+
				                "<td>"+players_array[i]['blocks']+"</td>"+
				                "<td>"+players_array[i]['turnovers']+"</td>"+
								"<td>"+'<span class="btn-group btn-group-xs">'+
											'<button class="btn btn-default btn-small add_remove_player_button_'+players_array[i]['id']+'" onclick="updateFunnelChart('+players_array[i]['id']+',1);"><i class="fa fa-plus" style="color:#66ce39"></i></button>&nbsp;'+
											'<button id="table-button-'+players_array[i]['id']+'" style="float:right;" type="button" class="btn btn-default btn-small create-popup" onclick="createOrShowPlayerView(\'player_'+players_array[i]['id']+'\',\'table-button-'+players_array[i]['id']+'\')"><i class="fa fa-search"></i></button>'+
										'</span></td>'+
							"</tr>";

			$('#player_table').append(table_row);
		}
		
	}
	
    $('#example').DataTable( {
        scrollY:        '80vh',
        scrollCollapse: false,
        paging:         false,
        "aoColumns": [
	      null,
	      null,
	      null,
	      null,
	      null,
	      null,
	      null,
	      null,
	      null,
	      null,
	      null,
	      null,
	      null,
	      { "bSortable": false }
	    ],
	    "oLanguage": {
		    "sSearch": "Search Player Results: "
		  },
		"order": [[ 2, "desc" ]]
    } );

    $('#player_table_loading').fadeOut();

    return true;

}

function renderTweets(){
	if(!tweets){
		console.log('no value');
	}else{

		var arrayLength = tweets.length;
		for (var i = 0; i < arrayLength; i++) {
			//var opponent = top_value[i]['opponent'].replace(/\s+/g, '');
			
			var text = tweets[i]['text'].replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
			
			if(tweets[0]['entities']['urls']){
				var url = '<a href="'+tweets[i]['entities']['urls'][0]['expanded_url']+'" target="_blank">'+tweets[i]['entities']['urls'][0]['display_url']+'</a>';
			}else{
				var url = '';
			}
			
			if(i === 0){
				var div_class = 'item active'
			}else{
				var div_class = 'item'
			}

			tweet = '<div class="'+div_class+'" style="padding-top:15px;padding-left:5px;"><br/>'+
						'<blockquote class="twitter-tweet" lang="en"><p>'+text+'</p>'+
						'<span style="font-size:75%;"><abbr class="timeago" title="'+tweets[i]['created_at']+'"></abbr><br/>'+
						'&mdash;'+tweets[i]['user']['name']+
						' <br/>'+url+'</span></blockquote></div>';

			$('#tweet-carousel').append(tweet);
		}

	}
	return true;

}


function renderMarquee(){
	var marquee = $('div.marquee');
	marquee.each(function() {
	    var mar = $(this),indent = mar.width();
		//var mar = $(this),indent = 0;
	    mar.marquee = function() {
	        indent--;
	        mar.css('text-indent',indent);
	        if (indent < -1 * mar.children('div.marquee-text').width()) {
	            indent = mar.width();
	        }
	    };
	    mar.data('interval',setInterval(mar.marquee,1000/60));
	});

	if(!top_value){
		console.log('no top value');
	}else{
	
		var arrayLength = top_value.length;
		var table_row = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Highest Projected Value Players</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		$('#marquee').append(table_row);
		for (var i = 0; i < arrayLength; i++) {
			var opponent = top_value[i]['opponent'].replace(/\s+/g, '');

			var text_color = Interpolate(60,parseInt(top_value[i]['projected_fanduel_value']));

			table_row = "<span style='font-size:85%;color:"+text_color+"; !important'>$"+top_value[i]['price_fanduel']+"</span> "+top_value[i]['first_name']+" "+top_value[i]['last_name']+" v "+opponent+" - "+top_value[i]['projected_fanduel_points']+"<span style='font-size:85%;'> Projected FanDuel points</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

			$('#marquee').append(table_row);
		}
	
	}

	if(!top_points){
		console.log('no top points');
	}else{
	
		var arrayLength = top_points.length;
		var table_row = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Highest Projected Scoring Players</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		$('#marquee').append(table_row);
		for (var i = 0; i < arrayLength; i++) {
			var opponent = top_points[i]['opponent'].replace(/\s+/g, '');

			var text_color = Interpolate(55,parseInt(top_value[i]['projected_fanduel_points']));
			
			table_row = "<span style='font-size:85%;'>$"+top_points[i]['price_fanduel']+"</span> "+top_points[i]['first_name']+" "+top_points[i]['last_name']+" v "+opponent+" - <span style='color:"+text_color+"; !important'>"+top_points[i]['projected_fanduel_points']+"</span><span style='font-size:85%;'> Projected FanDuel points</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

			$('#marquee').append(table_row);
		}
	
	}
	
	$('#banner').fadeIn();

}


function hideThisPopupContainer(id){
	$('#'+id).remove();
}


function createOrShowPlayerView(id,clicked_element_id){
			
	if ($('#player_'+id).length){
        alert('exists');
		return;
    }
	
	var div = $('div[id="popup_container"]');

	var klon = div.clone().prop('id', 'player_'+id );
	
	klon.draggable().resizable();
	
	klon.html('<button style="float:right;z-index:500;" type="button" class="btn btn-default" onclick="hideThisPopupContainer(\'player_'+id+'\')">x</button><img src="http://d2o2vmupkirjgs.cloudfront.net/assets/placeholders/avatar_blank@2x.png" style="height:40px;float:left;"/>&nbsp;&nbsp;(...)');
	
	klon.prependTo( "body" );
	
	var div = document.getElementById(clicked_element_id);
	var rect = div.getBoundingClientRect();
	
	klon.css( "position", "absolute" );
	klon.css( "left", rect.left+'px' );
	klon.css( "top", rect.top+'px' );
	klon.css( "z-index", 50 );
	
	klon.fadeIn();

}

function updateFunnelChart(player_id , add_or_remove){
	//
	//add_or_remove = 1 = add
	//add_or_remove = 0 = remove
	//
	//below are our globals that we need to update
	//
	//total_projected_team_points
	//total_projected_team_value
	//
	//below is what newData needs to be to be pushed to funnel chart
	//newData = [points,rebounds,assists,steals,blocks,turnovers];

	total_projected_team_score = parseFloat(total_projected_team_score);
	total_projected_team_value = parseFloat(total_projected_team_value);
	total_projected_team_points = parseFloat(total_projected_team_points);
	total_projected_team_rebounds = parseFloat(total_projected_team_rebounds);
	total_projected_team_assists = parseFloat(total_projected_team_assists);
	total_projected_team_steals = parseFloat(total_projected_team_steals);
	total_projected_team_blocks = parseFloat(total_projected_team_blocks);
	total_projected_team_turnovers = parseFloat(total_projected_team_turnovers);

	if(add_or_remove === 1 || add_or_remove === '1'){

		//
		if( !updateSelectedPlayers(player_id , 1) ){
			return;
		}
		//

		budget = parseInt(budget);

		budget = parseInt(budget) - parseInt(players_index[player_id][0]['price_fanduel']);

		var budget_percent = ((budget/60000) * 100).toFixed(0);

		chosen_player_count++;

		var score_to_add = parseFloat(players_index[player_id][0]['projected_fanduel_points']);
		var value_to_average_in = parseFloat(players_index[player_id][0]['projected_fanduel_value']);
		total_projected_team_points = total_projected_team_points + parseFloat(players_index[player_id][0]['points']);
		total_projected_team_rebounds = total_projected_team_rebounds + parseFloat(players_index[player_id][0]['rebounds']);
		total_projected_team_assists = total_projected_team_assists + parseFloat(players_index[player_id][0]['assists']);
		total_projected_team_steals = total_projected_team_steals + parseFloat(players_index[player_id][0]['steals']);
		total_projected_team_blocks = total_projected_team_blocks + parseFloat(players_index[player_id][0]['blocks']);
		total_projected_team_turnovers = total_projected_team_turnovers + parseFloat(players_index[player_id][0]['turnovers']);

		total_projected_team_score = total_projected_team_score + score_to_add;
		total_projected_team_value = ( (total_projected_team_value* (parseFloat(chosen_player_count) -1) ) + value_to_average_in) /chosen_player_count;

		var newData = [
						total_projected_team_points.toFixed(1),
						total_projected_team_rebounds.toFixed(1),
						total_projected_team_assists.toFixed(1),
						total_projected_team_steals.toFixed(1),
						total_projected_team_blocks.toFixed(1),
						total_projected_team_turnovers.toFixed(1)
					];

		$('.add_remove_player_button_'+player_id).each(function(i, obj) {
		    $(".add_remove_player_button_"+player_id).attr("onclick","updateFunnelChart("+player_id+",0)");
		    $(".add_remove_player_button_"+player_id).html('<i class="fa fa-times" style="color:#f23c25"></i>');
		});


	}else if(add_or_remove === 0 || add_or_remove === '0'){

		//
		if( !updateSelectedPlayers(player_id , 0) ){
			return;
		}
		//

		budget = parseInt(budget);
		var player_price = parseInt(players_index[player_id][0]['price_fanduel']);
		budget = parseInt( budget + player_price );

		var budget_percent = ((budget/60000) * 100).toFixed(0);

		chosen_player_count--;

		if(chosen_player_count > 0){
			var score_to_add = parseFloat(players_index[player_id][0]['projected_fanduel_points']);
			var value_to_average_in = parseFloat(players_index[player_id][0]['projected_fanduel_value']);
			total_projected_team_points = total_projected_team_points - parseFloat(players_index[player_id][0]['points']);
			total_projected_team_rebounds = total_projected_team_rebounds - parseFloat(players_index[player_id][0]['rebounds']);
			total_projected_team_assists = total_projected_team_assists - parseFloat(players_index[player_id][0]['assists']);
			total_projected_team_steals = total_projected_team_steals - parseFloat(players_index[player_id][0]['steals']);
			total_projected_team_blocks = total_projected_team_blocks - parseFloat(players_index[player_id][0]['blocks']);
			total_projected_team_turnovers =  total_projected_team_turnovers - parseFloat(players_index[player_id][0]['turnovers']);
			total_projected_team_value = ( (total_projected_team_value*parseFloat(chosen_player_count+1)) - value_to_average_in) /chosen_player_count;
			total_projected_team_score = total_projected_team_score - score_to_add;
		}else{
			var score_to_add = 0;
			var value_to_average_in = 0;
			total_projected_team_points = 0;
			total_projected_team_rebounds = 0;
			total_projected_team_assists = 0;
			total_projected_team_steals = 0;
			total_projected_team_blocks = 0;
			total_projected_team_turnovers =  0;
			total_projected_team_value = 0;
			total_projected_team_score = 0;
		}


		var newData = [
						total_projected_team_points.toFixed(1),
						total_projected_team_rebounds.toFixed(1),
						total_projected_team_assists.toFixed(1),
						total_projected_team_steals.toFixed(1),
						total_projected_team_blocks.toFixed(1),
						total_projected_team_turnovers.toFixed(1)
					];

		$('.add_remove_player_button_'+player_id).each(function(i, obj) {
		    $(".add_remove_player_button_"+player_id).attr("onclick","updateFunnelChart("+player_id+",1)");
		    $(".add_remove_player_button_"+player_id).html('<i class="fa fa-plus" style="color:#66ce39"></i>');
		});

	}


	var formatted_score = total_projected_team_score.toString();
	var formatted_value = total_projected_team_value.toString();
	formatted_score = formatted_score.split('.');
	formatted_value = formatted_value.split('.');

	var value_decimal = formatted_value[1];

	if(formatted_value[1]){
		var value_decimal = formatted_value[1];
		value_decimal = value_decimal.substring(0, 2);
	}else{
		var value_decimal = 0;
	}

	if(formatted_score[1]){
		var score_decimal = formatted_score[1];
		score_decimal = score_decimal.substring(0, 2);
	}else{
		var score_decimal = 0;
	}

	var value_color = generateValueColor(formatted_value[0]);
	var points_color = generatePointsColor(formatted_score[0]);

	$('#current_projected_points').html('<span class="large" style="color: '+points_color+' !important">'+formatted_score[0]+'<span class="small">.'+score_decimal+'</span></span>');
	$('#current_projected_value').html('<span class="large" style="color: '+value_color+' !important">'+formatted_value[0]+'<span class="small">.'+value_decimal+'</span></span>');

	$("#current_projected_points").effect( "bounce", {times:3}, 300 );
	$("#current_projected_value").effect( "bounce", {times:3}, 300 );
	$("#remaining_budget_text").effect( "bounce", {times:3}, 300 );

	cf_rFunnels['cf-funnel-1'].update(newData);

	//global budget
	$('#svp-1 .chart').attr('data-percent', budget_percent);
	// Update the UI metric
	var budget_color = calculateBudgetColor();
	$('#svp-1 .metric').html('<span style="color:'+budget_color+'">$'+budget+'</span>');

	$('.cf-svp').each(function(){
		cf_rSVPs[$(this).prop('id')] = {};
		rSVP($(this));
	});

	$('[data-toggle="tooltip"]').tooltip(); 

}

function exportLineupsToCSV(){

	var A = [['n','sqrt(n)']];

	for(var j=1; j<10; ++j){ 
	    A.push([j, Math.sqrt(j)]);
	}

	var csvRows = [];

	for(var i=0, l=A.length; i<l; ++i){
	    csvRows.push(A[i].join(','));
	}

	var csvString = csvRows.join("%0A");
	var a         = document.createElement('a');
	a.href        = 'data:attachment/csv,' +  encodeURIComponent(csvString);
	a.target      = '_blank';
	a.download    = 'myFile.csv';

	document.body.appendChild(a);
	a.click();

}

function updateSelectedPlayers(player_id , add_or_remove){
	// var selected_pgs = [];
	// var selected_sgs = [];
	// var selected_sfs = [];
	// var selected_pfs = [];
	// var selected_cs = [];

	//add_or_remove === 1 add
	//add_or_remove === 0 remove

	var pg_count = selected_pgs.length;
	var sg_count = selected_sgs.length;
	var sf_count = selected_sfs.length;
	var pf_count = selected_pfs.length;
	var c_count = selected_cs.length;

	var this_player = players_index[player_id][0];

	this_player['projected_fanduel_points'] = parseFloat(this_player['projected_fanduel_points']);
	this_player['projected_fanduel_points'] = this_player['projected_fanduel_points'].toFixed(2);

	var icon = '';
	if(this_player['top_pick']){
		if(this_player['top_pick'] === 1 || this_player['top_pick'] === '1'){
			icon = '&nbsp;<i class="fa fa-arrow-circle-up" style="color:#66ce39" data-toggle="tooltip" data-placement="right" title="Top Pick"></i>';
		}
	}

	if(add_or_remove === 1 || add_or_remove === '1'){

		var new_temp_budget = budget-parseInt(this_player['price_fanduel']);

		if (/PG/i.test(this_player['position'])){

			if(pg_count < 2){

				$( ".selected_pg_slot" ).each(function( index ) {
					var this_status = $( this ).attr("data-status");
					if(this_status === 0 || this_status === '0'){
						open_div = $( this ).attr("id");
					}
				});
				$('#'+open_div).attr("data-status",this_player['id']);

				selected_pgs.push(this_player);

				var points = parseInt(this_player['projected_fanduel_points']);
				var value = parseInt(this_player['projected_fanduel_value']);

				var score_color = redScaleInterpolate(55,points);
				var value_color = redScaleInterpolate(60,value);


				$('#'+open_div).html('<td>PG</td>'+
	                                    '<td>'+this_player['first_name']+' '+this_player['last_name']+icon+'</td>'+
	                                    '<td style="color:'+value_color+' !important;">$'+this_player['price_fanduel']+'</td>'+
	                                    '<td style="color:'+score_color+' !important;">'+this_player['projected_fanduel_points']+'</td>'+
										'<td>'+
											'<span style="cursor: pointer; cursor: hand;" onclick="updateFunnelChart('+this_player['id']+',0);">'+
													'<i class="fa fa-times" style="color:#f23c25"></i>'+
											'</span>'+
										'</td>');
			}else{
				return false
			}

		}else if(/SG/i.test(this_player['position'])){

			if(sg_count < 2){

				$( ".selected_sg_slot" ).each(function( index ) {
					var this_status = $( this ).attr("data-status");
					if(this_status === 0 || this_status === '0'){
						open_div = $( this ).attr("id");
					}
				});
				$('#'+open_div).attr("data-status",this_player['id']);

				var points = parseInt(this_player['projected_fanduel_points']);
				var value = parseInt(this_player['projected_fanduel_value']);
				var score_color = redScaleInterpolate(55,points);
				var value_color = redScaleInterpolate(60,value);

				selected_sgs.push(this_player);
				$('#'+open_div).html('<td>SG</td>'+
	                                    '<td>'+this_player['first_name']+' '+this_player['last_name']+icon+'</td>'+
	                                    '<td style="color:'+value_color+' !important;">$'+this_player['price_fanduel']+'</td>'+
	                                    '<td style="color:'+score_color+' !important;">'+this_player['projected_fanduel_points']+'</td>'+
										'<td>'+
											'<span style="cursor: pointer; cursor: hand;" onclick="updateFunnelChart('+this_player['id']+',0);">'+
													'<i class="fa fa-times" style="color:#f23c25"></i>'+
											'</span>'+
										'</td>');
			}else{
				return false
			}

		}else if(/SF/i.test(this_player['position'])){

			if(sf_count < 2){

				$( ".selected_sf_slot" ).each(function( index ) {
					var this_status = $( this ).attr("data-status");
					if(this_status === 0 || this_status === '0'){
						open_div = $( this ).attr("id");
					}
				});
				$('#'+open_div).attr("data-status",this_player['id']);

				var points = parseInt(this_player['projected_fanduel_points']);
				var value = parseInt(this_player['projected_fanduel_value']);
				var score_color = redScaleInterpolate(55,points);
				var value_color = redScaleInterpolate(60,value);

				selected_sfs.push(this_player);
				$('#'+open_div).html('<td>SF</td>'+
	                                    '<td>'+this_player['first_name']+' '+this_player['last_name']+icon+'</td>'+
	                                    '<td style="color:'+value_color+' !important;">$'+this_player['price_fanduel']+'</td>'+
	                                    '<td style="color:'+score_color+' !important;">'+this_player['projected_fanduel_points']+'</td>'+
										'<td>'+
											'<span style="cursor: pointer; cursor: hand;" onclick="updateFunnelChart('+this_player['id']+',0);">'+
													'<i class="fa fa-times" style="color:#f23c25"></i>'+
											'</span>'+
										'</td>');
			}else{
				return false
			}

		}else if(/PF/i.test(this_player['position'])){

			if(pf_count < 2){

				$( ".selected_pf_slot" ).each(function( index ) {
					var this_status = $( this ).attr("data-status");
					if(this_status === 0 || this_status === '0'){
						open_div = $( this ).attr("id");
					}
				});
				$('#'+open_div).attr("data-status",this_player['id']);

				var points = parseInt(this_player['projected_fanduel_points']);
				var value = parseInt(this_player['projected_fanduel_value']);
				var score_color = redScaleInterpolate(55,points);
				var value_color = redScaleInterpolate(60,value);

				selected_pfs.push(this_player);
				$('#'+open_div).html('<td>PF</td>'+
	                                    '<td>'+this_player['first_name']+' '+this_player['last_name']+icon+'</td>'+
	                                    '<td style="color:'+value_color+' !important;">$'+this_player['price_fanduel']+'</td>'+
	                                    '<td style="color:'+score_color+' !important;">'+this_player['projected_fanduel_points']+'</td>'+
										'<td>'+
											'<span style="cursor: pointer; cursor: hand;" onclick="updateFunnelChart('+this_player['id']+',0);">'+
													'<i class="fa fa-times" style="color:#f23c25"></i>'+
											'</span>'+
										'</td>');
			}else{
				return false
			}

		}else if(/C/i.test(this_player['position'])){

			if(c_count < 1){

				$( ".selected_c_slot" ).each(function( index ) {
					var this_status = $( this ).attr("data-status");
					if(this_status === 0 || this_status === '0'){
						open_div = $( this ).attr("id");
					}
				});
				$('#'+open_div).attr("data-status",this_player['id']);

				var points = parseInt(this_player['projected_fanduel_points']);
				var value = parseInt(this_player['projected_fanduel_value']);
				var score_color = redScaleInterpolate(55,points);
				var value_color = redScaleInterpolate(60,value);

				selected_cs.push(this_player);
				$('#'+open_div).html('<td>C</td>'+
	                                    '<td>'+this_player['first_name']+' '+this_player['last_name']+icon+'</td>'+
	                                    '<td style="color:'+value_color+' !important;">$'+this_player['price_fanduel']+'</td>'+
	                                    '<td style="color:'+score_color+' !important;">'+this_player['projected_fanduel_points']+'</td>'+
										'<td>'+
											'<span style="cursor: pointer; cursor: hand;" onclick="updateFunnelChart('+this_player['id']+',0);">'+
													'<i class="fa fa-times" style="color:#f23c25"></i>'+
											'</span>'+
										'</td>');
			}else{
				return false
			}

		}

	}else{

		var new_temp_budget = budget+parseInt(this_player['price_fanduel']);

		removePlayerFromSelectedTable(this_player['id']);

	}

	$('#player_table_row'+this_player['id']).toggleClass('selected_row');

	var pg_count = selected_pgs.length;
	var sg_count = selected_sgs.length;
	var sf_count = selected_sfs.length;
	var pf_count = selected_pfs.length;
	var c_count = selected_cs.length;

	tableRowOpacities(pg_count,sg_count,sf_count,pf_count,c_count,new_temp_budget);

	$('[data-toggle="tooltip"]').tooltip(); 
	return true;

}

function tableRowOpacities(pg_count,sg_count,sf_count,pf_count,c_count,new_budget){

	var total_count = pg_count + sg_count + sf_count + pf_count + c_count;

	var new_average = new_budget / (9-total_count) ;

	if(pg_count < 2){
		$('.pg_row').css('opacity','1');
	}else{
		$('.pg_row').css('opacity','0.5');
	}

	if(sg_count < 2){
		$('.sg_row').css('opacity','1');
	}else{
		$('.sg_row').css('opacity','0.5');
	}

	if(sf_count < 2){
		$('.sf_row').css('opacity','1');
	}else{
		$('.sf_row').css('opacity','0.5');
	}

	if(pf_count < 2){
		$('.pf_row').css('opacity','1');
	}else{
		$('.pf_row').css('opacity','0.5');
	}

	if(c_count < 1){
		$('.c_row').css('opacity','1');
	}else{
		$('.c_row').css('opacity','0.5');
	}

	$('.player_table_row').each(function() {

	    var price = $(this).attr("data-price");
	    var theoretical_new_average = (new_budget-price) / ( 9 - (total_count+1) );

	    if( (price > new_budget) || (price === 0) ){
	    	$(this).css('opacity','0.5');
		}

		if(new_average <= 3500){
			if(price > 3500){
				$(this).css('opacity','0.5');
			}
	    }

	    if(theoretical_new_average < 3500){
	    	$(this).css('opacity','0.5');
	    }

		if($(this).hasClass("selected_row")){
			$(this).css('opacity','1');
		}


	});

}


function removePlayerFromSelectedTable(player_id){

	// var selected_pgs = [];
	// var selected_sgs = [];
	// var selected_sfs = [];
	// var selected_pfs = [];
	// var selected_cs = [];

	var this_player = players_index[player_id][0];
	var position = this_player['position'];
	var player_id = this_player['id'];

	if (/PG/i.test(this_player['position'])){

		$( ".selected_pg_slot" ).each(function( index ) {
			this_status = $( this ).attr("data-status");
			if(parseInt(this_status) === parseInt(this_player['id'])){
				div_to_empty = $( this ).attr("id");
			}
		});

		var arrayLength = selected_pgs.length;
		for (var i = 0; i < arrayLength; i++) {
			if(selected_pgs[i]['id'].length > 0){
				var iteration_player_id = parseInt(selected_pgs[i]['id']);
				if(iteration_player_id === parseInt(player_id) ){
					selected_pgs.splice(i, 1);
					arrayLength = arrayLength-1;
					break;
				}
			}
		}

		$('#'+div_to_empty).html('<td>PG</td>'+
                                    '<td></td>'+
                                    '<td></td>'+
                                    '<td></td>'+
									'<td></td>');

		$( '#'+div_to_empty ).attr("data-status",0);

	}else if(/SG/i.test(this_player['position'])){

		$( ".selected_sg_slot" ).each(function( index ) {
			this_status = $( this ).attr("data-status");
			if(parseInt(this_status) === parseInt(this_player['id'])){
				div_to_empty = $( this ).attr("id");
			}
		});

		var arrayLength = selected_sgs.length;
		//console.log('array length: '+arrayLength);
		for (var i = 0; i < arrayLength; i++) {
			//console.log('i: '+i);
			if(selected_sgs[i]['id'].length > 0){
				var iteration_player_id = parseInt(selected_sgs[i]['id']);
				//console.log('iteration player id: '+iteration_player_id);
				if(iteration_player_id === parseInt(player_id) ){
					//console.log('here '+iteration_player_id);
					selected_sgs.splice(i, 1);
					arrayLength = arrayLength-1;
					break;
				}
			}
		}

		$('#'+div_to_empty).html('<td>SG</td>'+
                                    '<td></td>'+
                                    '<td></td>'+
                                    '<td></td>'+
									'<td></td>');

		$( '#'+div_to_empty ).attr("data-status",0);
		

	}else if(/SF/i.test(this_player['position'])){

		$( ".selected_sf_slot" ).each(function( index ) {
			this_status = $( this ).attr("data-status");
			if(parseInt(this_status) === parseInt(this_player['id'])){
				div_to_empty = $( this ).attr("id");
			}
		});

		var arrayLength = selected_sfs.length;
		for (var i = 0; i < arrayLength; i++) {
			if(selected_sfs[i]['id'].length > 0){
				var iteration_player_id = parseInt(selected_sfs[i]['id']);
				if(iteration_player_id === parseInt(player_id) ){
					selected_sfs.splice(i, 1);
					arrayLength = arrayLength-1;
					break;
				}
			}
		}

		$('#'+div_to_empty).html('<td>SF</td>'+
                                    '<td></td>'+
                                    '<td></td>'+
                                    '<td></td>'+
									'<td></td>');

		$( '#'+div_to_empty ).attr("data-status",0);		

	}else if(/PF/i.test(this_player['position'])){

		$( ".selected_pf_slot" ).each(function( index ) {
			this_status = $( this ).attr("data-status");
			if(parseInt(this_status) === parseInt(this_player['id'])){
				div_to_empty = $( this ).attr("id");
			}
		});

		var arrayLength = selected_pfs.length;
		for (var i = 0; i < arrayLength; i++) {
			if(selected_pfs[i]['id'].length > 0){
				var iteration_player_id = parseInt(selected_pfs[i]['id']);
				if(iteration_player_id === parseInt(player_id) ){
					selected_pfs.splice(i, 1);
					arrayLength = arrayLength-1;
					break;
				}
			}
		}

		$('#'+div_to_empty).html('<td>PF</td>'+
                                    '<td></td>'+
                                    '<td></td>'+
                                    '<td></td>'+
									'<td></td>');

		$( '#'+div_to_empty ).attr("data-status",0);

	}else if(/C/i.test(this_player['position'])){

		$( ".selected_c_slot" ).each(function( index ) {
			this_status = $( this ).attr("data-status");
			if(parseInt(this_status) === parseInt(this_player['id'])){
				div_to_empty = $( this ).attr("id");
			}
		});

		var arrayLength = selected_cs.length;
		for (var i = 0; i < arrayLength; i++) {
			if(selected_cs[i]['id'].length > 0){
				var iteration_player_id = parseInt(selected_cs[i]['id']);
				if(iteration_player_id === parseInt(player_id) ){
					selected_cs.splice(i, 1);
					arrayLength = arrayLength-1;
					break;
				}
			}
		}

		$('#'+div_to_empty).html('<td>C</td>'+
                                    '<td></td>'+
                                    '<td></td>'+
                                    '<td></td>'+
									'<td></td>');

		$( '#'+div_to_empty ).attr("data-status",0);

	}

	$('[data-toggle="tooltip"]').tooltip(); 

}

function generateValueColor (value){

	value = parseInt(value);

    return Interpolate(100,value);

}

function generatePointsColor(value){

	value = parseInt(value);

    return Interpolate(500,value);

}

function Interpolate(scale_max,value) {

	var increment = parseInt(scale_max/10);
	var place_in_range = parseInt(value/increment);

	if(place_in_range == 0){
		place_in_range == 1;
	}if(place_in_range > 10){
		place_in_range = 10;
	}

	return greyToGreenColor(place_in_range);
    
}

function greyToGreenColor(place_in_range) {

	switch (place_in_range) {

	    case 1:
	    	var color = '#A3A3A3';
	    	break;
	    case 2:
			var color = '#9CA797';
			break;
		case 3:
			var color = '#95AC8B';
			break;
		case 4:
			var color = '#8EB17F';
			break;
		case 5:
			var color = '#87B673';
			break;
		case 6:
			var color = '#81BA68';
			break;
		case 7:
			var color = '#7ABF5C';
			break;
		case 8:
			var color = '#73C450';
			break;
		case 9:
			var color = '#6CC944';
			break;
		case 10:
			var color = '#66CE39';
			break;
		default: 
	        var color = '#A3A3A3';
	        break;
	}

	return color;
    
}

function redScaleInterpolate(scale_max,value) {

	var increment = parseInt(scale_max/10);
	var place_in_range = parseInt(value/increment);

	if(place_in_range == 0){
		place_in_range == 1;
	}if(place_in_range > 10){
		place_in_range = 10;
	}

	return redToGreenColor(place_in_range);
   
}

function greenScaleInterpolate(scale_max,value) {

	var increment = parseInt(scale_max/10);
	var place_in_range = parseInt(value/increment);

	if(place_in_range == 0){
		place_in_range == 1;
	}if(place_in_range > 10){
		place_in_range = 10;
	}

	return greenToRedColor(place_in_range);
   
}

function redToGreenColor(place_in_range) {

	switch (place_in_range) {

	    case 1:
	    	var color = '#F23C25';
	    	break;
	    case 2:
			var color = '#E24C27';
			break;
		case 3:
			var color = '#D25C29';
			break;
		case 4:
			var color = '#C36C2B';
			break;
		case 5:
			var color = '#B37C2D';
			break;
		case 6:
			var color = '#A48D30';
			break;
		case 7:
			var color = '#949D32';
			break;
		case 8:
			var color = '#85AD34';
			break;
		case 9:
			var color = '#75BD36';
			break;
		case 10:
			var color = '#66CE39';
			break;
		default: 
	        var color = '#F23C25';
	        break;
	}

	return color;
    
}

function greenToRedColor(place_in_range) {

	switch (place_in_range) {

	    case 1:
	    	var color = '#66CE39';
	    	break;
	    case 2:
			var color = '#75BD36';
			break;
		case 3:
			var color = '#85AD34';
			break;
		case 4:
			var color = '#949D32';
			break;
		case 5:
			var color = '#B37C2D';
			break;
		case 6:
			var color = '#C36C2B';
			break;
		case 7:
			var color = '#949D32';
			break;
		case 8:
			var color = '#D25C29';
			break;
		case 9:
			var color = '#E24C27';
			break;
		case 10:
			var color = '#F23C25';
			break;
		default: 
	        var color = '#66CE39';
	        break;
	}

	return color;
    
}

function countCurrentSelectedPlayers(){

	// var selected_pgs = [];
	// var selected_sgs = [];
	// var selected_sfs = [];
	// var selected_pfs = [];
	// var selected_cs = [];

	// var this_player = players_index[player_id][0];
	// var position = this_player['position'];
	// var player_id = this_player['id'];

	var count = 0;

	count = count + selected_pgs.length;
	count = count + selected_sgs.length;
	count = count + selected_sfs.length;
	count = count + selected_pfs.length;
	count = count + selected_cs.length;

	return(count);

}

function calculateBudgetColor(){
	var current_selected_player_count = countCurrentSelectedPlayers();
	var players_left = 9-current_selected_player_count;

	if(players_left === 0){
		var average = budget;
		console.log(1);
	}else{
		var average = parseInt(budget/players_left);
		console.log(2);
	}

	if(players_left === 9){
		var color = redScaleInterpolate(6667,1);
		var salaryAverageColor = greenScaleInterpolate(3500,1);
		console.log(3);
	}else{

			if(average > 14000){
				console.log(4);
				var color = redScaleInterpolate(6667,6667);
				var salaryAverageColor = greenScaleInterpolate(3500,3500);

			}else{

				if(players_left === 0 && budget > 0){
					console.log(5);
					var color = greenScaleInterpolate( 1000 , budget );
					var salaryAverageColor = greenScaleInterpolate(1000,budget);

				}else{
					console.log(7);
					var color = redScaleInterpolate( 6667 , average );
					var salaryAverageColor = redScaleInterpolate(8000,average);
				}

			}

	}

	if(average < 0){
		average = 0;
	}

	$('#avg_remaining_salary').css('color',salaryAverageColor);
	$('#avg_remaining_salary').html('$'+average);

	if(budget >= 60000){
		var color = redScaleInterpolate(6667,6667);
	}

	return color;

}

