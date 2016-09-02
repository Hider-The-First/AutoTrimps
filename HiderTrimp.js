
//original globals
var buildcounter = 0;
var autoTSettings = {};
var version = "0.37b.17T2";

//nice globals
var zonePic = null;
var zonePic = document.getElementById('zonePic');
var PrePic = null;
var PrePic = document.getElementById('PrePic');
var voidPic = null;
var voidPic = document.getElementById('voidPic');
var mapPic = null;
var mapPic = document.getElementById('mapPic');
var spirePic = null;
var spirePic = document.getElementById('spirePic');
var BR = 0;
var BR = document.getElementById('BR');
var BG = 0;
var BG = document.getElementById('BG');
var BB = 0;
var BB = document.getElementById('BB');
var CR = 0;
var CR = document.getElementById('CR');
var CG = 0;
var CG = document.getElementById('CG');
var CB = 0;
var CB = document.getElementById('CB');

//making the var work
	var BR = {enabled: 0, description: "Background RGB R",				titles: ["Not Switching", "Switching"]};
	var BG = {enabled: 0, description: "Background RGB G",				titles: ["Not Switching", "Switching"]};
	var BB = {enabled: 0, description: "Background RGB B",				titles: ["Not Switching", "Switching"]};
	var CR = {enabled: 0, description: "Containers RGB R",				titles: ["Not Switching", "Switching"]};
	var CG = {enabled: 0, description: "Containers RGB G",				titles: ["Not Switching", "Switching"]};
	var CB = {enabled: 0, description: "Containers RGB B",				titles: ["Not Switching", "Switching"]};
	var zonePic = {enabled: 0, description: "Background picture for Zones",		titles: ["Not Switching", "Switching"]};
	var mapPic = {enabled: 0, description: "Background picture for Maps",		titles: ["Not Switching", "Switching"]};
	var PrePic = {enabled: 0, description: "Background picture for PreMaps",	titles: ["Not Switching", "Switching"]};
	var voidPic = {enabled: 0, description: "Background picture for VoidMaps",	titles: ["Not Switching", "Switching"]};
 	var spirePic = {enabled: 0, description: "Background picture for Spire",	titles: ["Not Switching", "Switching"]};
 	
//setup talk button
document.getElementById("buildingsQueue").style = "width: 70%; float: left;";
document.getElementById("queueContainer").insertAdjacentHTML('beforeend', '<div style="color: rgb(255, 255, 255); font-size: 1.2em; text-align: center; width: 10%; float: right; margin-left: 1%; margin-right: 1%; vertical-align;"><div id="talkingBtn" class="workBtn pointer noselect" onclick="talk()" style="background: rgb(0, 0, 0) none repeat scroll 0% 0%; margin-top: 0.5vh;">Talk</div></div>');
letMeTalk = document.getElementById("talkingBtn");
letMeTalk.setAttribute("onmouseover", 'tooltip(\"Talk\", \"customText\", event, \"It knows a lot about how Trimps works.\")');
letMeTalk.setAttribute("onmouseout", 'tooltip("hide")');
//setup talk window
document.getElementById("boneWrapper").insertAdjacentHTML('beforebegin', '<div id="autotrimp" style="position: absolute; background: rgb(0, 0, 0) none repeat scroll 0% 0%; border: 2px solid rgb(0, 0, 0); width: 64vw; margin: 6vh 18vw; z-index: 10000000; text-align: center; font-size: 1.3vw; display: none; padding: 0.2vw; color: rgb(255, 255, 255);"><div style="width: 100%; display: table; border-spacing: 0.3vw;" id="autotrimp0"><div style="display: table-row;" id="autorow"><div style="border: 1px solid white; background: rgb(153, 153, 77) none repeat scroll 0% 0%; display: table-cell; width: 20%;" id="pic"><img style="max-height: 13vw;" src="https://cloud.githubusercontent.com/assets/14081390/9893516/d9db4782-5bde-11e5-8791-91638bb6aaae.jpg"></div><div id="qs" style="border: 1px solid white; background: rgb(153, 153, 77) none repeat scroll 0% 0%; display: table-cell; width: 60%; vertical-align: top; padding: 0.5%;"><p style="text-align: left; font-size: 0.9em;" id="q">This is the question.</p><p></p><p style="font-size: 0.8em;"><a style="color: rgb(128, 0, 0); text-decoration: underline;" href="#" id="1" onclick="alert(\'clicked\')">Answer 1</a></p><p style="font-size: 0.8em;"><a style="color: rgb(128, 0, 0); text-decoration: underline;" href="#" id="2" onclick="alert(\'clicked\')">Answer 2</a></p><p style="font-size: 0.8em;"><a style="color: rgb(128, 0, 0); text-decoration: underline;" href="#" id="3" onclick="alert(\'clicked\')"></a></p></div><div id="button" style="display: table-cell; width: 20%; background: rgb(0, 0, 0) none repeat scroll 0% 0%; vertical-align: top;"><div class="boneBtn dangerColor pointer noselect" onclick="document.getElementById(\'autotrimp\').style.display = \'none\'">Close</div></div></div></div></div>');
document.getElementById("autotrimp").insertAdjacentHTML('beforeend', '<div style="width: 100%; display: table; border-spacing:0.3vw;" id="genBTCTrimp"><div style="border: 1px solid white; background: rgb(0, 0, 0) none repeat scroll 0% 0%; width: 100%; padding: .3vw;" id="autosettings0"> <a href="https://discord.gg/0VbWe0dxB9kIfV2C" target="_blank">Join the chat</div></div>');

//setup paint button
document.getElementById("queueContainer").insertAdjacentHTML('beforeend', '<div style="color: rgb(255, 255, 255); font-size: 1.2em; text-align: center; width: 10%; float: right; vertical-align;"><div id="paintingBtn" class="workBtn pointer noselect" onclick="paint()" style="background: rgb(0, 0, 0) none repeat scroll 0% 0%; margin-top: 0.5vh;">Paint</div></div>');
letMePaint = document.getElementById("paintingBtn");
letMePaint.setAttribute("onmouseover", 'tooltip(\"Paint\", \"customText\", event, \"It can paint things.\")');
letMePaint.setAttribute("onmouseout", 'tooltip("hide")');
//setup paint window
document.getElementById("queueContainer").insertAdjacentHTML('beforebegin', '<div id="paintTrimp" style="position: absolute; background: black none repeat scroll 0% 0%; border: 2px solid black; width: 64vw; margin: 7vh 18vw; z-index: 10000000; text-align: center; font-size: 1.3vw; display: none; padding: 0.2vw; color: white;"><div style="width: 100%; display: table; border-spacing: 0.3vw;" id="paintTrimp0"><div style="display: table-row;" id="autorow"><div style="border: 1px solid white; background: rgb(153, 77, 153) none repeat scroll 0% 0%; display: table-cell; width: 25%;" id="pic"><img style="max-height: 16vw;" src="https://orig09.deviantart.net/a8d5/f/2010/266/7/a/fortune_teller_by_sephiroth_art-d2zbmhv.jpg"></div><div id="qs" style="border: 1px solid white; background: rgb(153, 77, 153) none repeat scroll 0% 0%; display: table-cell; width: 55%; vertical-align: top; padding: 0.5%;"><p style="text-align: left; font-size: 0.9em;" id="q">Lets paint.</p><div style="display: table-row;text-align: left; font-size: 0.7em; color: SPRINGGREEN;"><div style="width:65%; position:relative; display:table-cell;"><p  ><input id="zonePic">Zone Picture</p><p><input id="mapPic">Map Picture</p><p><input id="prePic">Pre Map Picture</p><p style=""><input id="voidPic">Void Maps Picture</p><p><input id="spirePic">Spire Picture</p></div><div style="width:35%; position:relative; display:table-cell;"><p><input id="BR" style="width:20%;">BR<input id="BG" style="width:20%;">BG<input id="BB" style="width:20%;">BB</p><p><input id="CR" style="width:20%;">CR<input id="CG" style="width:20%;">CG<input id="CB" style="width:20%;">CB<p></div></div></div><div id="button" style="display: table-cell; width: 20%; background: black none repeat scroll 0% 0%; vertical-align: top;"><div class="boneBtn dangerColor pointer noselect" onclick="document.getElementById(\'paintTrimp\').style.display = \'none\'">Close</div></div></div></div></div>');
//HiderTryThatFailed//document.getElementById("boneWrapper").insertAdjacentHTML('beforebegin', '<div id="paintTrimp" style="position: absolute; background: rgb(0, 0, 0) none repeat scroll 0% 0%; border: 2px solid rgb(0, 0, 0); width: 64vw; margin: 6vh 18vw; z-index: 10000000; text-align: center; font-size: 1.3vw; display: none; padding: 0.2vw; color: rgb(255, 255, 255);"><div style="width: 100%; display: table; border-spacing: 0.3vw;" id="paintTrimp0"><div style="display: table-row;" id="autorow"><div style="border: 1px solid white; background: rgb(153, 77, 153) none repeat scroll 0% 0%; display: table-cell; width: 20%;" id="pic"><img style="max-height: 13vw;" src="https://orig09.deviantart.net/a8d5/f/2010/266/7/a/fortune_teller_by_sephiroth_art-d2zbmhv.jpg"></div><div id="qs" style="border: 1px solid white; background: rgb(153, 77, 153) none repeat scroll 0% 0%; display: table-cell; width: 60%; vertical-align: top; padding: 0.5%;"><p style="text-align: left; font-size: 0.9em;" id="q">Lets paint.</p><div style="display: table-row;"><div style="width:65%; position:relative; display:table-cell;"><p style="text-align: left; font-size: 0.6em;" ><input id="zonePic">Zone Picture</p><p style="text-align: left; font-size: 0.6em;"><input id="mapPic">Map Picture</p><p style="text-align: left; font-size: 0.6em; color: rgb(153, 77 153);"><input id="prePic">Pre Map Picture</p><p style="text-align: left; font-size: 0.6em; color: rgb(153, 77 153);"><input id="voidPic">Void Maps Picture</p><p style="text-align: left; font-size: 0.6em; color: rgb(153, 77 153);"><input id="spirePic">Spire Picture</p></div><div style="width:35%; position:relative; display:table-cell;" ><p style="text-align: left; font-size: 0.6em; color: rgb(153, 77 153);"><input id="BR" style="width:10%;">BR</p><p style="text-align: left; font-size: 0.6em; color: rgb(153, 77 153);"><input id="BG" style="width:10%;">BG</p><p style="text-align: left; font-size: 0.6em; color: rgb(153, 77 153);"><input id="BB" style="width:10%;">BB</p><p style="text-align: left; font-size: 0.6em; color: rgb(153, 77 153);"><input id="CR" style="width:10%;">CR<p style="text-align: left; font-size: 0.6em; color: rgb(153, 77 153);"><input id="CG" style="width:10%;">CG</p><p style="text-align: left; font-size: 0.6em; color: rgb(153, 77 153);"><input id="CB" style="width:10%;">CB</p></div></div></div><div id="button" style="display: table-cell; width: 20%; background: rgb(0, 0, 0) none repeat scroll 0% 0%; vertical-align: top;"><div class="boneBtn dangerColor pointer noselect" onclick="document.getElementById(\'paintTrimp\').style.display = \'none\'">Close</div></div></div></div></div>');
//beforebegin //afterbegin //beforeend //afterend

function getNiceThingsDone() {
		if (zonePic != null || PrePic != null || voidPic != null || mapPic != null || spirePic != null ) {
		//bring the art.
		if (zonePic != null && !game.global.preMapsActive && !game.global.mapsActive && !game.global.spireActive) {
		document.getElementById("trimps").insertAdjacentHTML('afterend', '<div id="pic"><img src="' + document.getElementById("zonePic").value + '"></div>');
		} else if (PrePic != null && game.global.preMapsActive) {
		document.getElementById("trimps").insertAdjacentHTML('afterend', '<div id="pic"><img src="' + document.getElementById("PrePic").value + '"></div>');
		} else if (voidPic != null && game.global.mapsActive && getCurrentMapObject().location == "Void") {
		document.getElementById("trimps").insertAdjacentHTML('afterend', '<div id="pic"><img src="' + document.getElementById("voidPic").value + '"></div>');
		} else if (mapPic != null && game.global.mapsActive && getCurrentMapObject().location != "Void") {
		document.getElementById("trimps").insertAdjacentHTML('afterend', '<div id="pic"><img src="' + document.getElementById("mapPic").value + '"></div>');
		} else if (spirePic != null && game.global.world == 200 && game.global.spireActive) {
		document.getElementById("trimps").insertAdjacentHTML('afterend', '<div id="pic"><img src="' + document.getElementById("spirePic").value + '"></div>');
		}
		/*
		if ((spirePic != null || zonePic != null ) && game.resources.trimps.soldiers != 0 && !game.global.preMapsActive && !game.global.mapsActive && (new Date().getTime() - game.global.zoneStarted) > 1600 && game.global.gridArray.length != 0) {
			var cells = document.getElementById("grid").getElementsByClassName("battleCell cellColorBeaten"); var oldstyle = cells[0].getAttribute('style'); for (var i=0; i < cells.length; i++) cells[i].setAttribute('style', oldstyle + '; background-color: rgba(0,0,0,0.3);');
		}
		if ((mapPic != null || voidPic != null ) && game.resources.trimps.soldiers != 0 && game.global.mapsActive && (new Date().getTime() - game.global.mapStarted) > 1600 && game.global.mapGridArray.length != 0) {
			var cells = document.getElementById("mapGrid").getElementsByClassName("battleCell cellColorBeaten"); var oldstyle = cells[0].getAttribute('style'); for (var i=0; i < cells.length; i++) cells[i].setAttribute('style', oldstyle + '; background-color: rgba(0,0,0,0.3);');
		}
		*/
	}
	if ((BR > 0 && BG > 0 && BB > 0 ) || (CR > 0 && CG > 0 && CB > 0 )) {
	//bring the light.
	BR0 = document.getElementById("BR").value*1;
	BG0 = document.getElementById("BG").value*1;
	BB0 = document.getElementById("BB").value*1;
	CR0 = document.getElementById("CR").value*1;
	CG0 = document.getElementById("CG").value*1;
	CB0 = document.getElementById("CB").value*1;
	var colB = "background: rgb(" + BR0 + "," + BG0 + "," + BB0 + ");";
	var colC = "background: rgb(" + CR0 + "," + CG0 + "," + CB0 + ");";
	//document.getElementById("innerWrapper").style = "background: rgb(BR, BG, BB);";
	document.getElementById("innerWrapper").style = 	colB;
	document.getElementById("battleContainer").style =	colC;
	document.getElementById("gridContainer").style =	colC;
	document.getElementById("science").style =		colC;
	document.getElementById("selectedMapContainer").style =	colC;
	document.getElementById("helium").style =		colC;
	document.getElementById("achievementWrapper").style =	colC;
	document.getElementById("buyContainer").style =		colC;
	document.getElementById("logContainer").style =		colC;
	document.getElementById("queueContainer").style =	colC;
	document.getElementById("wood").style =			colC;
	document.getElementById("fragments").style =		colC;
	document.getElementById("heirloomWrapper").style =	colC;
	document.getElementById("food").style =			colC;
	document.getElementById("metal").style =		colC;
	document.getElementById("gems").style =			colC;
	document.getElementById("trimps").style =		colC;
	}
}

//setup options
function createInputSetting(pic,div) {
    var picInput = document.createElement("Input");
    picInput.id = pic + "URL";
    picInput.setAttribute('style', 'text-align: center; width: 60px; color: black;');
    picInput.setAttribute('class', 'picInput');
    var perk1label = document.createElement("Label");
    picLable.id = pic + 'Label';
    picLable.innerHTML = pic;
    picLable.setAttribute('style', 'margin-right: 1vw; width: 120px; color: white;');
    //add to the div.
    div.appendChild(picInput);
    div.appendChild(picLable);
}

//Add new css rule
//document.styleSheets[2].insertRule(".settingBtn3 {background-color: #337AB7;}", 84);

var getPercent = 0;
var reactPercent = 0;
function getStats() {
    reactPercent = 0;
    getPercent = (game.stats.heliumHour.value() / (game.global.totalHeliumEarned - (game.global.heliumLeftover + game.resources.helium.owned)))*100;
    if (getPercent.toFixed(3) > 0.54) {
        reactPercent = " An amazing result, share it with others, they will appriciate it.";
    } else if (getPercent.toFixed(3) > 0.53) {
        reactPercent = " GRATZ, A NEW WORLD RECORD!";
    } else if (getPercent.toFixed(3) > 0.52) {
        reactPercent = " Only a few ever got this far.";
    } else if (getPercent.toFixed(3) > 0.50) {
        reactPercent = " it's not shameful to give up.";
    } else if (getPercent.toFixed(3) > 0.40) {
        reactPercent = " It's the final push.";
    } else if (getPercent.toFixed(3) > 0.30) {
        reactPercent = " Keep it comming...";
    } else if (getPercent.toFixed(3) <= 0.30) {
        reactPercent = " Did you just portal?";
    }
    return getPercent.toFixed(3) + '%'; //return
}

var getGigaDelta = false;
var reactGigaDelta = false;
function getStats2() {
    reactGigaDelta = true;
    getGigaDelta = (getPageSetting('FirstGigastation') > 40 || getPageSetting('DeltaGigastation') > 2);
    if (getGigaDelta == true) {
        reactGigaDelta = "First Gigastation must be under 41 and Min Warpstation must be under two, if you don't know how it works, why don't you click on the chat and ask?";
    } else if (getGigaDelta == false) {
        reactGigaDelta = "You know the Truth.";
    }
    return getGigaDelta;
}

var getAutoPortal = false;
var reactAutoPortal = false;
function getStats3() {
    reactAutoPortal = true;
    getAutoPortal = (getPageSetting('HeliumHrBuffer') > 0 || autoTrimpSettings.AutoPortal.selected != "Helium Per Hour");
    if (getAutoPortal == true) {
        reactAutoPortal = "The Helium/Hr Buffer must be set to 0 and Auto Portal is there in order to help you get better Helium per hour, if you don't know how it works, why don't you click on the chat and ask?";
    } else if (getAutoPortal == false) {
        reactAutoPortal = "You know the Truth.";
    }
    return getAutoPortal;
}

//setup convo array
var conversation = [];
conversation[0] = {Q:"Hello.",R1:"Tell me the Truth.",L1:1,R2:"How am i doing so far?",L2:5,R3:"Tell me what to do.",L3:3};
conversation[1] = {Q:"" +reactGigaDelta,R1:"Be more honest please.",L1:6,R2:"What can go wrong in the Don't Touch Zone?",L2:4,R3:"I know the Truth.",L3:0};
conversation[2] = {Q:"OK.",R1:"Again.",L1:0,R2:"How am i doing so far?",L2:5,R3:"What can go wrong in the Don't Touch Zone?",L3:4};
conversation[3] = {Q:"Please set Auto Portal to Helium Per Hour and set First Gigastation to 40 (or less). Make sure that Min Warpstation is set to two (or less). And notice that some of the Void Maps will be done before your Void Maps settings, so please use it and set the Void Maps to no more then 10 Zones before you predict that you will Auto Portal. Have a nice AutoAutoTrimps experience.",R1:"Wow, HelpfulTrimp!",L1:0};
conversation[4] = {Q:"You.",R1:"Meh.",L1:0};
conversation[5] = {Q:"Your current Helium per hour gain is " + getStats() + "" +reactPercent,R1:"Cool.",L1:0,R2:"What can go wrong in the Don't Touch Zone?",L2:4,R3:"I know the Truth.",L3:0};
conversation[6] = {Q:"" +reactAutoPortal,R1:"Please be much more honest.",L1:7,R2:"What can go wrong in the Don't Touch Zone?",L2:4,R3:"I know the Truth.",L3:0};
conversation[7] = {Q:"I am not a real Trimp.",R1:"I knew the Truth.",L1:0};
updateConvo(0);

/*
conversation[0] = {Q:"Hello.",R1:"What?!?!",L1:3,R2:"Oh.",L2:1};
conversation[1] = {Q:"What do you want to change? Click the buttons below.",R1:"Nothing.",L1:2,R2:"That's it.",L2:2};
conversation[2] = {Q:"Ok.",R1:"Hello?",L1:0};
conversation[3] = {Q:"I figured you'd find me eventually. Before you ask...yes, I can talk. No, none of the other trimps seem to be able to.",R1:"What else do you know?",L1:4};
conversation[4] = {Q:"Not much more than you, unfortunately. Whatever brought you here is also what made me...smarter than the average trimp. Before you got here, I wasn't anymore self-aware than any other trimp.",R1:"What are we doing here?",L1:5};
conversation[5] = {Q:"I don't know--I don't even know where <b>here</b> is. This is all new to me too.",R1:"Well, what do you suggest we do?",L1:6};
conversation[6] = {Q:"Keep going. Maybe we'll find some answers. Since we're friends now, I've picked up a few tricks that will help us.",R1:"Like what?",L1:7};
conversation[7] = {Q:"I can tell the trimps to build storage buildings before they get full. I can also buy Gyms and Tributes as soon as we can afford them, and read some upgrade books to you and the trimps when you're not available.",R1:"Which upgrade books?",L1:8, R2:"What else?", L2:9};
conversation[8] = {Q:"The upgrades I can read are: Speedfarming, Speedlumber, Speedminer, Speedscience, (all the Mega versions too), Efficiency, TrainTacular, Gymystic, Potency, Egg, UberHut, UberHouse, UberMansion, UberHotel, UberResort, and Bounty",R1:"Ok, cool",L1:9};
conversation[9] = {Q:"I can also highlight the housing that makes the most use of our gems, and the equipment that makes the best use of our metal.",R1:"Cool, what else?",L1:10};
conversation[10] = {Q:"I'll bring us back to the world if we idle on the premap screen too long and I'll send you back to science-ing if you stay building on an empty queue. I can also <b>unteach</b> Shieldblock.",R1:"Why unteach Shieldblock?",L1:11, R2:"Anything else?",L2:12};
conversation[11] = {Q:"As we learn more and more Gymystic, our shields becomes less and less useful for blocking. The extra health comes in real handy post z60.",R1:"I get it.",L1:12};
conversation[12] = {Q:"I can help you respec the portal perks if you've already done it this round, and I can automatically flip between Dominance and Heap formations depending on the enemy we're facing.",R1:"Ok.",L1:13};
conversation[13] = {Q:"That's it for now, but I'll let you know if I pick up any more tricks. Use the buttons below to let me know what you'd like done.",R1:"Ok.",L1:2};
updateConvo(0);
*/


//only functions below here
function updateConvo (place) {
  conversation[1] = {Q:"" +reactGigaDelta,R1:"Be more honest please.",L1:6,R2:"What can go wrong in the Don't Touch Zone?",L2:4,R3:"I know the Truth.",L3:0};
  conversation[5] = {Q:"Your current Helium per hour gain is " + getStats() + "" +reactPercent,R1:"Cool.",L1:0,R2:"What can go wrong in the Don't Touch Zone?",L2:4,R3:"I know the Truth.",L3:0};
  conversation[6] = {Q:"" +reactAutoPortal,R1:"Please be much more honest.",L1:7,R2:"What can go wrong in the Don't Touch Zone?",L2:4,R3:"I know the Truth.",L3:0};
  document.getElementById("q").innerHTML = conversation[place].Q;
  document.getElementById("1").innerHTML = conversation[place].R1;
  document.getElementById("1").onclick = (function() { var test = conversation[place].L1; return function() {updateConvo(test + '');}})();
  if ("R2" in conversation[place]) {document.getElementById("2").innerHTML = conversation[place].R2;}
  else {document.getElementById("2").innerHTML = "";}
  if ("L2" in conversation[place]) {document.getElementById("2").onclick = (function() { var test = conversation[place].L2; return function() {updateConvo(test + '');}})();}
  if ("R3" in conversation[place]) {document.getElementById("3").innerHTML = conversation[place].R3;}
  else {document.getElementById("3").innerHTML = "";}
  if ("L3" in conversation[place]) {document.getElementById("3").onclick = (function() { var test = conversation[place].L3; return function() {updateConvo(test + '');}})();}
}

function talk() {
  getStats();
  getStats2();
  getStats3();
  document.getElementById("autotrimp").style.display = "block";
}

function paint() {
  getNiceThingsDone();
  document.getElementById("paintTrimp").style.display = "block";
}
