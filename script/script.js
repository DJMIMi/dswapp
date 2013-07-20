// ==UserScript==
// @name        dswRep
// @namespace   dsw_rep
// @require  	  https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @include     http://www.erepublik.com/*
// @include     https://www.erepublik.com/*
// @version     1
// ==/UserScript==
$ = jQuery = jQuery.noConflict(true);

var img_rank = new Array;
img_rank["recruit_0"] = 1;
img_rank["private_0"] = 2;
img_rank["private_1"] = 3;
img_rank["private_2"] = 4;
img_rank["private_3"] = 5;
img_rank["corporal_0"] = 6;
img_rank["corporal_1"] = 7;
img_rank["corporal_2"] = 8;
img_rank["corporal_3"] = 9;
img_rank["sergeant_0"] = 10;
img_rank["sergeant_1"] = 11;
img_rank["sergeant_2"] = 12;
img_rank["sergeant_3"] = 13;
img_rank["lieutenant_0"] = 14;
img_rank["lieutenant_1"] = 15;
img_rank["lieutenant_2"] = 16;
img_rank["lieutenant_3"] = 17;
img_rank["captain_0"] = 18;
img_rank["captain_1"] = 19;
img_rank["captain_2"] = 20;
img_rank["captain_3"] = 21;
img_rank["major_0"] = 22;
img_rank["major_1"] = 23;
img_rank["major_2"] = 24;
img_rank["major_3"] = 25;
img_rank["commander_0"] = 26;
img_rank["commander_1"] = 27;
img_rank["commander_2"] = 28;
img_rank["commander_3"] = 29;
img_rank["lt_colonel_0"] = 30;
img_rank["lt_colonel_1"] = 31;
img_rank["lt_colonel_2"] = 32;
img_rank["lt_colonel_3"] = 33;
img_rank["colonel_0"] = 34;
img_rank["colonel_1"] = 35;
img_rank["colonel_2"] = 36;
img_rank["colonel_3"] = 37;
img_rank["general_0"] = 38;
img_rank["general_1"] = 39;
img_rank["general_2"] = 40;
img_rank["general_3"] = 41;
img_rank["field_marshal_0"] = 42;
img_rank["field_marshal_1"] = 43;
img_rank["field_marshal_2"] = 44;
img_rank["field_marshal_3"] = 45;
img_rank["supreme_marshal_0"] = 46;
img_rank["supreme_marshal_1"] = 47;
img_rank["supreme_marshal_2"] = 48;
img_rank["supreme_marshal_3"] = 49;
img_rank["national_force_0"] = 50;
img_rank["national_force_1"] = 51;
img_rank["national_force_2"] = 52;
img_rank["national_force_3"] = 53;
img_rank["world_class_force_0"] = 54;
img_rank["world_class_force_1"] = 55;
img_rank["world_class_force_2"] = 56;
img_rank["world_class_force_3"] = 57;
img_rank["legendary_force_0"] = 58;
img_rank["legendary_force_1"] = 59;
img_rank["legendary_force_2"] = 60;
img_rank["legendary_force_3"] = 61;
img_rank["god_of_war_0"] = 62;
img_rank["god_of_war_1"] = 63;
img_rank["god_of_war_2"] = 64;
img_rank["god_of_war_3"] = 65;
img_rank["titan_0"] = 66;
img_rank["titan_1"] = 67;
img_rank["titan_2"] = 68;
img_rank["titan_3"] = 69;

var LANG = typeof unsafeWindow.erepublik.settings.culture == "undefined" ? unsafeWindow.culture : unsafeWindow.erepublik.settings.culture;
var temp = $(".user_name").attr("href").split("/");
var citizenID = temp[temp.length-1];

function calcHit(){
	GM_xmlhttpRequest({
		method: "GET",
		url: "http://www.erepublik.com/"+LANG+"/citizen/profile/"+citizenID,
		dataType: "html",
		onload: function (e) {
			var data = e.responseText;
			var strength = parseInt($(data).find(".citizen_military").eq(0).find(".stat small strong").text().split("/")[0].trim().replace(",", ""));
			var rank = img_rank[$(data).find(".citizen_military").eq(1).find("h4 img").attr("src").split("/")[6].split(".")[0]];
			var s = Math.round(10 * (1 + strength / 400) * (1 + rank / 5) * (1 + 200 / 100));
			calcInflu(s)
		}
	})
}

function calcInflu(hit){
	GM_xmlhttpRequest({
		method: "GET",
		url: "http://www.erepublik.com/"+LANG+"/economy/inventory",
		dataType: "html",
		onload: function (e) {
			var data = e.responseText;
			var bars,bars2,factoryRockets,FRInflu,bigBombs,smallBombs,hitFF,hitBars,hitRockets;
			var ff = parseInt($("#current_health").text().split("/")[0].trim())+parseInt($(".tooltip_health_limit").text().trim());
			bars = $(data).find("#stock_1_10").length > 0 ? parseInt($(data).find("#stock_1_10").text()) : 0;
			bars2 = $(data).find("#stock_1_11").length > 0 ? parseInt($(data).find("#stock_1_11").text()) : 0;
			factoryRockets = $(data).find("#stock_2_141").length > 0 ? parseInt($(data).find("#stock_2_141").text()) : 0;
			FRInflu = $(data).find("#stock_2_141").length > 0 ? parseInt($(data).find("#product_details_2_141 .defense strong").text().split("+")[1].split(" ")[0].replace(/,/g,'')) : 0;
			bigBombs = $(data).find("#stock_2_131").length > 0 ? parseInt($(data).find("#stock_2_131").text()) : 0;
			smallBombs = $(data).find("#stock_2_121").length > 0 ? parseInt($(data).find("#stock_2_121").text()) : 0;
			
			hitFF = hit*ff/10;
			hitBars = hit*(bars*10+bars2*20);
			hitRockets = factoryRockets*FRInflu + bigBombs*5000000 + smallBombs*1500000;
			
			report(hitFF,hitBars,hitRockets);
			
		}
	})
}

function report(hitFF,hitBars,hitRockets){
	var name = $(".user_name").text();
    var data = {name: name, foodfight: hitFF, bars: hitBars, rockets: hitRockets, status:1};
	GM_xmlhttpRequest({
		method: "POST",
		url: "http://localhost:8001/buggy/index.php",
        data: "data="+JSON.stringify(data),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },        
		onload: function (e) {
			var data = e.responseText;
			$("#dswStatus").text("Ready");
			setTimeout(reset,300000);
		}
	})	
}

function reset(){
	$("#dswStatus").removeAttr("disabled");
	$("#dswStatus").text("Not Ready");	
}

$(document).ready(function () {	
	$(".user_identity").after('<div class="user_identity" style="text-align:center; margin:0;"><button id="dswStatus">Not Ready</button></div>');
	$("#dswStatus").click(function(){
		$(this).attr("disabled","disabled");
        $(this).text("Please wait");
        calcHit();        
	});
})
