
//original globals
var gobj = {};
var hobj = {};
var aobj = {};
var hkeysSorted = [];
var premapscounter = 0;
var buildcounter = 0;
var autoTSettings = {};
var version = "0.37b.17T2";
var wasgathering = "";
var badguyMinAtt = 0;
var badguyMaxAtt = 0;
var badguyFast = false;
var mysoldiers = 0;
var mytoughness = 0;
var blockformation = 1;
var healthformation = 1;
var myblock = 0;
var myhealth = 0;
var targetSeconds = 30;

//nice globals
var zonePic = -1;
var PrePic = -1;
var voidPic = -1;
var mapPic = -1;
var spirePic = -1;
var BR = -1;
var BG = -1;
var BB = -1;
var CR = -1;
var CG = -1;
var CB = -1;

function getNiceThingsDone() {
		if (zonePic != -1 && PrePic != -1 && voidPic != -1 && mapPic != -1 && spirePic != -1) {
		//bring the art.
		if (!game.global.preMapsActive && !game.global.mapsActive && !game.global.spireActive) {
		document.getElementById("trimps").insertAdjacentHTML('afterend', '<div id="pic"><img style="max-height: 9000vw; vertical-align; background;" src="zonePic"></div><div');
		} else if (game.global.preMapsActive) {
		document.getElementById("trimps").insertAdjacentHTML('afterend', '<div id="pic"><img style="max-height: 9000vw; vertical-align; background;" src="PrePic"></div><div');
		} else if (game.global.mapsActive && getCurrentMapObject().location == "Void") {
		document.getElementById("trimps").insertAdjacentHTML('afterend', '<div id="pic"><img style="max-height: 9000vw; vertical-align; background;" src="voidPic"></div><div');
		} else if (game.global.mapsActive && getCurrentMapObject().location != "Void") {
		document.getElementById("trimps").insertAdjacentHTML('afterend', '<div id="pic"><img style="max-height: 9000vw; vertical-align; background;" src="mapPic"></div><div');
		} else if (game.global.world == 200 && game.global.spireActive) {
		document.getElementById("trimps").insertAdjacentHTML('afterend', '<div id="pic"><img style="max-height: 9000vw; vertical-align; background;" src="spirePic"></div><div');
		}
		if (!game.global.preMapsActive && !game.global.mapsActive && (new Date().getTime() - game.global.zoneStarted) > 1600 && game.global.gridArray.length != 0) {
			var cells = document.getElementById("grid").getElementsByClassName("battleCell cellColorBeaten"); var oldstyle = cells[0].getAttribute('style'); for (var i=0; i < cells.length; i++) cells[i].setAttribute('style', oldstyle + '; background-color: rgba(0,0,0,0.3);');
		}
		if (game.global.mapsActive && (new Date().getTime() - game.global.mapStarted) > 1600 && game.global.mapGridArray.length != 0) {
			var cells = document.getElementById("mapGrid").getElementsByClassName("battleCell cellColorBeaten"); var oldstyle = cells[0].getAttribute('style'); for (var i=0; i < cells.length; i++) cells[i].setAttribute('style', oldstyle + '; background-color: rgba(0,0,0,0.3);');
		}
	}
	if (BR != -1 && BG != -1 && BB != -1 && CR != -1 && CG != -1 && CB != -1) {
	//bring the light.
	document.getElementById("innerWrapper").style = "background: rgb(" + BR +","+ BG+"," + BB +");";
	document.getElementById("battleContainer").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	document.getElementById("gridContainer").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	document.getElementById("science").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	document.getElementById("selectedMapContainer").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	document.getElementById("helium").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	document.getElementById("achievementWrapper").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	document.getElementById("buyContainer").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	document.getElementById("logContainer").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	document.getElementById("queueContainer").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	document.getElementById("wood").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	document.getElementById("fragments").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	document.getElementById("heirloomWrapper").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	document.getElementById("food").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	document.getElementById("metal").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	document.getElementById("gems").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	document.getElementById("trimps").style = "background: rgb(" + CR +","+ CG+"," + CB +");";
	}
}

//setup talk button
document.getElementById("buildingsQueue").style = "width: 70%; float: left;";
document.getElementById("queueContainer").insertAdjacentHTML('beforeend', '<div style="color: rgb(255, 255, 255); font-size: 1.2em; text-align: center; width: 10%; float: right; margin-left: 1%; margin-right: 1%; vertical-align;"><div id="talkingBtn" class="workBtn pointer noselect" onclick="talk()" style="background: rgb(0, 0, 0) none repeat scroll 0% 0%; margin-top: 0.5vh;">Talk</div></div>');
letMeTalk = document.getElementById("talkingBtn");
letMeTalk.setAttribute("onmouseover", 'tooltip(\"Talk\", \"customText\", event, \"He knows a lot about how Trimps works.\")');
letMeTalk.setAttribute("onmouseout", 'tooltip("hide")');
//setup talk window
document.getElementById("boneWrapper").insertAdjacentHTML('beforebegin', '<div id="autotrimp" style="position: absolute; background: rgb(0, 0, 0) none repeat scroll 0% 0%; border: 2px solid rgb(0, 0, 0); width: 64vw; margin: 6vh 18vw; z-index: 10000000; text-align: center; font-size: 1.3vw; display: none; padding: 0.2vw; color: rgb(255, 255, 255);"><div style="width: 100%; display: table; border-spacing: 0.3vw;" id="autotrimp0"><div style="display: table-row;" id="autorow"><div style="border: 1px solid white; background: rgb(153, 153, 77) none repeat scroll 0% 0%; display: table-cell; width: 20%;" id="pic"><img style="max-height: 13vw;" src="https://cloud.githubusercontent.com/assets/14081390/9893516/d9db4782-5bde-11e5-8791-91638bb6aaae.jpg"></div><div id="qs" style="border: 1px solid white; background: rgb(153, 153, 77) none repeat scroll 0% 0%; display: table-cell; width: 60%; vertical-align: top; padding: 0.5%;"><p style="text-align: left; font-size: 0.9em;" id="q">This is the question.</p><p></p><p style="font-size: 0.8em;"><a style="color: rgb(128, 0, 0); text-decoration: underline;" href="#" id="1" onclick="alert(\'clicked\')">Answer 1</a></p><p style="font-size: 0.8em;"><a style="color: rgb(128, 0, 0); text-decoration: underline;" href="#" id="2" onclick="alert(\'clicked\')">Answer 2</a></p><p style="font-size: 0.8em;"><a style="color: rgb(128, 0, 0); text-decoration: underline;" href="#" id="3" onclick="alert(\'clicked\')"></a></p></div><div id="button" style="display: table-cell; width: 20%; background: rgb(0, 0, 0) none repeat scroll 0% 0%; vertical-align: top;"><div class="boneBtn dangerColor pointer noselect" onclick="document.getElementById(\'autotrimp\').style.display = \'none\'">Close</div></div></div></div></div>');
document.getElementById("autotrimp").insertAdjacentHTML('beforeend', '<div style="width: 100%; display: table; border-spacing:0.3vw;" id="genBTCTrimp"><div style="border: 1px solid white; background: rgb(0, 0, 0) none repeat scroll 0% 0%; width: 100%; padding: .3vw;" id="autosettings0"> <a href="https://discord.gg/0VbWe0dxB9kIfV2C" target="_blank">Join the chat</div></div>');
//setting old
document.getElementById("autotrimp").insertAdjacentHTML('beforeend', '<div style="width: 100%; display: table; border-spacing:0.3vw;" id="autosettings"><div style="border: 1px solid white; background: rgb(0, 0, 0) none repeat scroll 0% 0%; width: 100%; padding: .3vw;" id="autosettings0">Settings</div></div>');
//somthing old
document.getElementById("autotrimp").insertAdjacentHTML('beforeend', '<div style="width: 100%; display: table; border-spacing:0.3vw;" id="genBTCTrimp"><div style="border: 1px solid white; background: rgb(0, 0, 0) none repeat scroll 0% 0%; width: 100%; padding: .3vw;" id="autosettings0">Script Notes</div></div>');

//setup paint button
document.getElementById("queueContainer").insertAdjacentHTML('beforeend', '<div style="color: rgb(255, 255, 255); font-size: 1.2em; text-align: center; width: 10%; float: right; vertical-align;"><div id="paintingBtn" class="workBtn pointer noselect" onclick="paint()" style="background: rgb(0, 0, 0) none repeat scroll 0% 0%; margin-top: 0.5vh;">Paint</div></div>');
letMePaint = document.getElementById("paintingBtn");
letMePaint.setAttribute("onmouseover", 'tooltip(\"Paint\", \"customText\", event, \"She can paint things.\")');
letMePaint.setAttribute("onmouseout", 'tooltip("hide")');
//setup paint window
document.getElementById("buyContainer").insertAdjacentHTML('beforebegin', '<div id="paintTrimp" style="position: absolute; background: rgb(0, 0, 0) none repeat scroll 0% 0%; border: 2px solid rgb(0, 0, 0); width: 64vw; margin: 6vh 18vw; z-index: 10000000; text-align: center; font-size: 1.3vw; display: none; padding: 0.2vw; color: rgb(255, 255, 255);"><div style="width: 100%; display: table; border-spacing: 0.3vw;" id="paintTrimp0"><div style="display: table-row;" id="autorow"><div style="border: 1px solid white; background: rgb(153, 77, 153) none repeat scroll 0% 0%; display: table-cell; width: 20%;" id="pic"><img style="max-height: 13vw;" src="http://orig09.deviantart.net/a8d5/f/2010/266/7/a/fortune_teller_by_sephiroth_art-d2zbmhv.jpg"></div><div id="qs" style="border: 1px solid white; background: rgb(153, 77, 153) none repeat scroll 0% 0%; display: table-cell; width: 60%; vertical-align: top; padding: 0.5%;"><p style="text-align: left; font-size: 0.9em;" id="q">Lets paint.</p><p></p><p id="manualPainting0"></a></p></div><div id="button" style="display: table-cell; width: 20%; background: rgb(0, 0, 0) none repeat scroll 0% 0%; vertical-align: top;"><div class="boneBtn dangerColor pointer noselect" onclick="document.getElementById(\'paintTrimp\').style.display = \'none\'">Close</div></div></div></div></div>');
//beforebegin //afterbegin //beforeend //afterend

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

//setup options
var checking = JSON.parse(localStorage.getItem("autotrimpsave"));
if (checking != null && checking.versioning == version) {
	autoTSettings = checking;
	}else {
	var autobuildings = {enabled: 1, description: "Automatically buy storage buildings when they're 90% full", titles: ["Not Buying", "Buying"]};
	var autogymbutes = {enabled: 0, description: "Automatically buy gyms and tributes when we can afford them", titles: ["Not Buying", "Buying Both", "Gyms Only", "Tributes Only"]};
	var autoupgrades = {enabled: 1, description: "Automatically read certain upgrade books to you and the trimps", titles: ["Not Reading", "Reading", "Reading and Weapons", "Reading and Equipment", "Reading and Armour"]};
	var autobuildhouses = {enabled: 0, description: "Automatically buy housing and nurseries. Cheapest by gems and food", titles: ["Not Buying", "Buying Both", "Houses Only", "Nurseries Only"]};
	var autoworkers = {enabled: 0, description: "Automatically send trimps to work if there are too many idle", titles: ["Not Jobbing", "Jobbing"]};
	//	var autohousing = {enabled: 0, description: "Highlight the most gem-efficient housing in green", titles: ["Not Highlighting", "Highlighting"]};
	//	var autoequipment = {enabled: 0, description: "Highlight the most metal-efficient equipment in blue and red", titles: ["Not Highlighting", "Highlighting"]};
	var autohighlight = {enabled: 0, description: "Highlight the most gem-efficient housing in green and the most metal-efficient equipment in blue and red", titles: ["Not Highlighting", "Highlighting All", "Housing Only", "Equipment Only"]};
	var autopremaps = {enabled: 0, description: "Bring us back to the world if we're in the premaps screen for 30 seconds", titles: ["Not Switching", "Switching"]};
	var autogather = {enabled: 0, description: "I'll make you switch between gathering and building depending on our build queue", titles: ["Not Switching", "Switching"]};
	var autoformations = {enabled: 0, description: "Automatically switch between Heap and Dominance formations based on enemy", titles: ["Not Switching", "Switching"]};
	var autosnimps = {enabled: 0, description: "I'll automatically buy items to help us get past snimps, squimps, and other fast enemies", titles: ["Not Avoiding", "Avoiding"]};
	var automapbmax = {enabled: 0, description: "I'll manage turning map repeat on and off so we can reach the max map bonus", titles: ["Not Managing", "Managing","Buy and Manage"]};
	autoTSettings = {versioning: version, autobuildings: autobuildings, autogymbutes: autogymbutes, autobuildhouses: autobuildhouses, autoworkers: autoworkers, autoupgrades: autoupgrades, autohighlight: autohighlight, autopremaps: autopremaps, automapbmax: automapbmax, autogather: autogather, autosnimps: autosnimps, autoformations: autoformations};
}

//add buttonss
var autosettings = document.getElementById("autosettings0");
var html = "";
for (var item in autoTSettings) {
	if (item != "versioning") {
		var optionItem = autoTSettings[item]; 
		var text = optionItem.titles[optionItem.enabled]; 
		html += "<div class='optionContainer'><div id='toggle" + item + "' class='noselect settingBtn settingBtn" + optionItem.enabled + "' onclick='toggleAutoSetting(\"" + item + "\")'>" + text + "</div><div class='optionItemDescription'>" + optionItem.description + "</div></div> ";
	}
}
autosettings.innerHTML = html;

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

function toggleManualPainting(setting){
	var autoOption = manualPainting[peinting];
	var toggles = autoOption.titles.length;
	autoOption.enabled = (autoOption.enabled) ? 0 : 1;
	if (autoOption.onToggle) autoOption.onToggle();
	var menuElem = document.getElementById("toggle" + setting);
	menuElem.innerHTML = autoOption.titles[autoOption.enabled];
	menuElem.className = "";
	menuElem.className = "settingBtn settingBtn" + autoOption.enabled;
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
