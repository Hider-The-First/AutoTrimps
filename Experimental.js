//globals
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

//Line things up, OCD FTW!
document.getElementById("helium").style.height = "32.4%";
document.getElementById("boneFlavorRow").innerHTML = "The Bone Trader trades bones for...bonuses";

//setup talk button
document.getElementById("buildingsQueue").style = "width: 75%; float: left;";
document.getElementById("queueContainer").insertAdjacentHTML('beforeend', '<div style="color: rgb(255, 255, 255); font-size: 1.2em; text-align: center; width: 25%; float: right; padding-left: 1.1vw; padding-right: .45vw;"><div id="buildingsCollectBtn" class="workBtn pointer noselect" onclick="talk()" style="background: rgb(153, 153, 77) none repeat scroll 0% 0%; margin-top: 0.5vh;">HiderTrimp</div></div>');

//setup talk window
document.getElementById("boneWrapper").insertAdjacentHTML('beforebegin', '<div id="autotrimp" style="position: absolute; background: rgb(0, 0, 0) none repeat scroll 0% 0%; border: 2px solid rgb(0, 0, 0); width: 86vw; margin: 3vh 7vw; z-index: 10000000; text-align: center; font-size: 1.3vw; display: none; padding: 0.2vw; color: rgb(255, 255, 255);"><div style="width: 100%; display: table; border-spacing: 0.3vw;" id="autotrimp0"><div style="display: table-row;" id="autorow"><div style="border: 1px solid white; background: rgb(153, 153, 77) none repeat scroll 0% 0%; display: table-cell; width: 15%;" id="pic"><img style="max-height: 30vw;" src="https://cloud.githubusercontent.com/assets/14081390/9893516/d9db4782-5bde-11e5-8791-91638bb6aaae.jpg"></div><div id="qs" style="border: 1px solid white; background: rgb(153, 153, 77) none repeat scroll 0% 0%; display: table-cell; vertical-align: top; padding: 0.5%;"><p style="text-align: left; font-size: 0.9em;" id="q">This is the question.</p><p></p><p style="font-size: 0.8em;"><a style="color: rgb(128, 0, 0); text-decoration: underline;" href="#" id="1" onclick="alert(\'clicked\')">Answer 1</a></p><p style="font-size: 0.8em;"><a style="color: rgb(128, 0, 0); text-decoration: underline;" href="#" id="2" onclick="alert(\'clicked\')">Answer 2</a></p><p style="font-size: 0.8em;"><a style="color: rgb(128, 0, 0); text-decoration: underline;" href="#" id="3" onclick="alert(\'clicked\')"></a></p></div><div id="button" style="display: table-cell; width: 20%; background: rgb(0, 0, 0) none repeat scroll 0% 0%; vertical-align: top;"><div class="boneBtn dangerColor pointer noselect" onclick="document.getElementById(\'autotrimp\').style.display = \'none\'">Close</div></div></div></div></div>');
//document.getElementById("autotrimp").insertAdjacentHTML('beforeend', '<div style="width: 100%; display: table; border-spacing:0.3vw;" id="autosettings"><div style="border: 1px solid white; background: rgb(84, 83, 83) none repeat scroll 0% 0%; width: 100%; padding: .3vw;" id="autosettings0">Settings</div></div>');

//Add new css rule
document.styleSheets[2].insertRule(".settingBtn3 {background-color: #337AB7;}", 84);

//setup convo array
var conversation = [];
conversation[0] = {Q:"HiThere.",R1:"My name is Minty.",L1:1,R2:"Don't take my Helium.",L2:2,R3:"Click Here.",L3:3};
conversation[1] = {Q:"Thanks for the Helium.",R1:" ?(´???`)? ",L1:0,};
conversation[2] = {Q:"OK.",R1:"TY.",L1:0};
conversation[3] = {Q:"Please set Auto Portal to Helium Per Hour and set First Gigastation to 40 (or less). Make sure that Min Warpstation is set to two (or less). And notice that some of the Void Maps will be done before your Void Maps settings, so please use it and set the Void Maps to no more then 10 Zones before you predict that you will Auto Portal. Have a nice AutoAutoTrimps experience. ? \\(????` )/? ",R1:" ???? ?·??·? ???? ",L1:0};
conversation[4] = {Q:"OK2.",R1:"TY.",L0:0};
updateConvo(0);

/*
conversation[0] = {Q: "Hello.", R1: "What?!?!", L1: 3, R2: "Oh.", L2: 1};
conversation[1] = {Q: "What do you want to change? Click the buttons below.", R1: "Nothing.", L1: 2, R2: "That's it.", L2: 2};
conversation[2] = {Q: "Ok.", R1: "Hello?", L1: 0};
conversation[3] = {Q: "I figured you'd find me eventually. Before you ask...yes, I can talk. No, none of the other trimps seem to be able to.", R1: "What else do you know?", L1: 4};
conversation[4] = {Q: "Not much more than you, unfortunately. Whatever brought you here is also what made me...smarter than the average trimp. Before you got here, I wasn't anymore self-aware than any other trimp.", R1: "What are we doing here?", L1: 5};
conversation[5] = {Q: "I don't know--I don't even know where <b>here</b> is. This is all new to me too.", R1: "Well, what do you suggest we do?", L1: 6};
conversation[6] = {Q: "Keep going. Maybe we'll find some answers. Since we're friends now, I've picked up a few tricks that will help us.", R1: "Like what?", L1: 7};
conversation[7] = {Q: "I can tell the trimps to build storage buildings before they get full. I can also buy Gyms and Tributes as soon as we can afford them, and read some upgrade books to you and the trimps when you're not available.", R1: "Which upgrade books?", L1: 8, R2: "What else?", L2: 9};
conversation[8] = {Q: "The upgrades I can read are: Speedfarming, Speedlumber, Speedminer, Speedscience, (all the Mega versions too), Efficiency, TrainTacular, Gymystic, Potency, Egg, UberHut, UberHouse, UberMansion, UberHotel, UberResort, and Bounty", R1: "Ok, cool", L1: 9};
conversation[9] = {Q: "I can also highlight the housing that makes the most use of our gems, and the equipment that makes the best use of our metal.", R1: "Cool, what else?", L1: 10};
conversation[10] = {Q: "I'll bring us back to the world if we idle on the premap screen too long and I'll send you back to science-ing if you stay building on an empty queue. I can also <b>unteach</b> Shieldblock.", R1: "Why unteach Shieldblock?", L1: 11, R2: "Anything else?", L2: 12};
conversation[11] = {Q: "As we learn more and more Gymystic, our shields becomes less and less useful for blocking. The extra health comes in real handy post z60.", R1: "I get it.", L1: 12};
conversation[12] = {Q: "I can help you respec the portal perks if you've already done it this round, and I can automatically flip between Dominance and Heap formations depending on the enemy we're facing.", R1: "Ok.", L1: 13};
conversation[13] = {Q: "That's it for now, but I'll let you know if I pick up any more tricks. Use the buttons below to let me know what you'd like done.", R1: "Ok.", L1: 2};
updateConvo(0);
*/

//setup options
var checking = JSON.parse(localStorage.getItem("autotrimpsave"));
if (checking != null && checking.versioning == version) {
	autoTSettings = checking;
}
else {
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

//add genetics buttons
var breedTimer = document.createElement("span");
var btnShort = document.createElement("div");
var btnModerate = document.createElement("div");
var btnLong = document.createElement("div");
btnShort.className = "pointer noselect";
btnShort.innerHTML = 1.5;
btnShort.style.backgroundColor = "black";
btnShort.style.cssFloat = "left";
btnShort.style.width = "25%";
btnShort.onclick = function(){ targetSeconds = btnShort.innerHTML;};
btnLong.className = "pointer noselect";
btnLong.innerHTML = 30;
btnLong.style.backgroundColor = "black";
btnLong.style.cssFloat = "left";
btnLong.style.width = "25%";
btnLong.onclick = function(){ targetSeconds = btnLong.innerHTML;};
document.getElementById("fireBtn").style.cssFloat = "left";
document.getElementById("fireBtn").style.width = "50%";
document.getElementById("jobsTitleSpan").parentElement.className = "col-xs-2";
document.getElementById("fireBtn").parentElement.className = "col-xs-5";
document.getElementById("fireBtn").parentElement.appendChild(btnShort);
document.getElementById("fireBtn").parentElement.appendChild(btnLong);
document.getElementById("goodGuyAttack").parentElement.insertBefore(breedTimer, document.getElementById("critSpan"));

//create unlearn shieldblock button
autosettings.insertAdjacentHTML('beforeend', "<div class='optionContainer'><div id='remove Shieldblock' class='noselect settingBtn btn-warning' onclick='removeShieldblock()'>Unlearn Shieldblock</div><div class='optionItemDescription'>We'll stop teaching the trimps to use shields to block and we'll use them for health again</div></div>");
autosettings.insertAdjacentHTML('beforeend', "<div class='optionContainer'><div id='add Respec' class='noselect settingBtn btn-warning' onclick='addRespec()'>Add a Respec</div><div class='optionItemDescription'>If you've already used your respec but want to do it again anyway, let me know.</div></div>");



//call loop
var myVar = setInterval(function () { myTimer(); }, 3000);
var newVar = setInterval(function () {newTimer(); }, 1000);

//alert("done");

//only functions below here
function updateConvo (place) {
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

function removeShieldblock() {
	if (game.upgrades.Shieldblock.done == 1) {
		prestigeEquipment("Shield", false, true);
		game.equipment.Shield.blockNow = false;
		game.equipment.Shield.tooltip = "A big, wooden shield. Adds $healthCalculated$ health to each soldier per level.";
		levelEquipment("Shield", 1);
		game.upgrades.Shieldblock.done = 0;	
	}
}

function addRespec() {
	if (game.global.canRespecPerks == false) {
		game.global.canRespecPerks = true;
	}
}

function updateHousingHighlighting() {
	var ahousing = ["Mansion", "Hotel", "Resort", "Collector", "Warpstation"];
	var ghousing = [];
	for (ahouse in ahousing) {
		if (game.buildings[ahousing[ahouse]].locked == 0) {
			ghousing.push(ahousing[ahouse]);
		}
	}
	if (ghousing.length) {
		gobj = {};
		for (ghouse in ghousing) {
			var gbuilding = game.buildings[ghousing[ghouse]];
			var gcost = 0;
			gcost += getBuildingItemPrice(gbuilding, "gems");
			var gratio = gcost / gbuilding.increase.by;
			gobj[ghousing[ghouse]] = gratio;
			if (document.getElementById(ghousing[ghouse]).style.border = "1px solid #00CC00") {
				document.getElementById(ghousing[ghouse]).style.border = "1px solid #FFFFFF";
				document.getElementById(ghousing[ghouse]).removeEventListener("click", updateHousingHighlighting);
			}
		}
		var keysSorted = Object.keys(gobj).sort(function(a,b){return gobj[a]-gobj[b]});
		document.getElementById(keysSorted[0]).style.border = "1px solid #00CC00";
		document.getElementById(keysSorted[0]).addEventListener('click',updateHousingHighlighting,false);
	}
}

function buyGemCheapestHousing() {
	var buyAmt = game.global.buyAmt;
	game.global.buyAmt = 1;
	var ahousing = ["Mansion", "Hotel", "Resort", "Collector", "Warpstation"];
	var ghousing = [];
	for (ahouse in ahousing) {
		if (game.buildings[ahousing[ahouse]].locked == 0) {
			ghousing.push(ahousing[ahouse]);
		}
	}
	if (ghousing.length) {
		gobj = {};
		for (ghouse in ghousing) {
			var gbuilding = game.buildings[ghousing[ghouse]];
			var gcost = 0;
			gcost += getBuildingItemPrice(gbuilding, "gems");
			var gratio = gcost / gbuilding.increase.by;
			gobj[ghousing[ghouse]] = gratio;
		}
		var keysSorted = Object.keys(gobj).sort(function (a, b) {return gobj[a] - gobj[b]; });
		var buildbuilding = game.buildings[keysSorted[0]];
		if (game.upgrades.Gigastation.allowed > game.upgrades.Gigastation.done &&
		    game.buildings.Warpstation.owned >= Math.ceil(game.stats.totalHelium.valueTotal()/10000) + 3*game.upgrades.Gigastation.done) {
			if (canAffordTwoLevel(game.upgrades.Gigastation)) {
				buyUpgrade("Gigastation");
				tooltip("hide");
				message("Got the next Gigastation upgrade, much bigger than the last sort!", "Loot", "*eye2", "exotic");
			}
		} else if (buildbuilding.locked == 0) {
			if (canAffordBuilding(keysSorted[0])) {
				buyBuilding(keysSorted[0]);
				tooltip("hide");
				message("Bought us a new " + keysSorted[0] +".", "Loot", "*eye2", "exotic");
			}
		}
		var grMansion = getBuildingItemPrice(game.buildings.Mansion, "food") / game.buildings.Mansion.increase.by;
		var grHouse = getBuildingItemPrice(game.buildings.House, "food") / game.buildings.House.increase.by;
		var grHut = getBuildingItemPrice(game.buildings.Hut, "food") / game.buildings.Hut.increase.by;
		if (grMansion > grHouse) {
			buildbuilding = game.buildings.House;
			if (canAffordBuilding("House")) {
				buyBuilding("House");
				tooltip("hide");
				message("Bought us more houses. It ain't no mansion though!", "Loot", "*eye2", "exotic");
			}
		}
		if (grMansion > grHut) {
			buildbuilding = game.buildings.House;
			if (canAffordBuilding("Hut")) {
				buyBuilding("Hut");
				tooltip("hide");
				message("Still building huts. Why do they still live there??", "Loot", "*eye2", "exotic");
			}
		}
	} else if (game.buildings.House.locked == 0) {
		grHouse = getBuildingItemPrice(game.buildings.House, "food") / game.buildings.House.increase.by;
		grHut = getBuildingItemPrice(game.buildings.Hut, "food") / game.buildings.Hut.increase.by;
		if (grHouse < grHut) {
			if (canAffordBuilding("House")) {
				buyBuilding("House");
				tooltip("hide");
				message("Bought us more houses, More houses = more trimps!", "Loot", "*eye2", "exotic");
			}
		} else {
			if (canAffordBuilding("Hut")) {
				buyBuilding("Hut");
				tooltip("hide");
				message("Huts for trimps. I bet they would prefer a house!", "Loot", "*eye2", "exotic");
			}
		}
	} else if (canAffordBuilding("Hut")) {
		buyBuilding("Hut");
		tooltip("hide");
		message("And another hut down!", "Loot", "*eye2", "exotic");
	}
	if (game.buildings.Gateway.locked == 0) {
		if (canAffordBuilding("Gateway") && game.buildings.Gateway.owned < 40)  {
			buyBuilding("Gateway");
			tooltip("hide");
			message("More gateways for the masses!!", "Loot", "*eye2", "exotic");
		}
	}
	game.global.buyAmt = buyAmt;
}

// send trimps to work if there are a lot waiting around!!
function sendTrimpsToWork() {
	var workspaces = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
	if (workspaces > game.global.buyAmt) {
		var buyAmt = game.global.buyAmt;
		game.global.buyAmt = Math.ceil((workspaces- game.global.buyAmt)*0.1);
		if (game.jobs.Farmer.owned > 1000000) {
			// if more than 1000000 farmers allocate 3:1:4
			if (game.jobs.Farmer.owned < game.jobs.Lumberjack.owned * 3 && game.jobs.Farmer.owned * 4 < 2 * game.jobs.Miner.owned) {
				buyJob("Farmer");
				tooltip("hide");
			} else if (game.jobs.Lumberjack.owned * 4 < game.jobs.Miner.owned * 1) {
				buyJob("Lumberjack");
				tooltip("hide");
			} else {
				buyJob("Miner");
				tooltip("hide");
			}
		} else if (game.jobs.Farmer.owned > 100000) {
			// if more than 100000 farmers allocate 3:3:5
			if (game.jobs.Farmer.owned * 3 < game.jobs.Lumberjack.owned * 3 && game.jobs.Farmer.owned * 5 < 3 * game.jobs.Miner.owned) {
				buyJob("Farmer");
				tooltip("hide");
			} else if (game.jobs.Lumberjack.owned * 5 < game.jobs.Miner.owned * 3) {
				buyJob("Lumberjack");
				tooltip("hide");
			} else {
				buyJob("Miner");
				tooltip("hide");
			}
		} else {
			// if less than  100000 farmers allocate 1:1:1
			if (game.jobs.Farmer.owned < game.jobs.Lumberjack.owned && game.jobs.Farmer.owned < game.jobs.Miner.owned) {
				buyJob("Farmer");
				tooltip("hide");
			} else if (game.jobs.Lumberjack.owned < game.jobs.Miner.owned) {
				buyJob("Lumberjack");
				tooltip("hide");
			} else  if(game.jobs.Miner.locked == 0){
				buyJob("Miner");
				tooltip("hide");
			}
		}
		game.global.buyAmt = buyAmt;
	}
}

function updateHealthHighlighting() {
	var ahealth = ["Boots", "Helmet", "Pants", "Shoulderguards", "Breastplate", "Gambeson"];
	var ghealth = [];
	for (aheal in ahealth) {
		if (game.equipment[ahealth[aheal]].locked == 0) {
			ghealth.push(ahealth[aheal]);
		}
	}
	if (ghealth.length) {
		for (gheal in ghealth) {
			var hequip = game.equipment[ghealth[gheal]];
			var mcost = 0;
			mcost += getBuildingItemPrice(hequip, "metal", true);
			var mratio = mcost / hequip.healthCalculated;
			hobj[ghealth[gheal]] = mratio;
			if (document.getElementById(ghealth[gheal]).style.border = "1px solid #0000FF") {
				document.getElementById(ghealth[gheal]).style.border = "1px solid #FFFFFF";
				document.getElementById(ghealth[gheal]).removeEventListener("click", updateHealthHighlighting);
			}
		}
		hkeysSorted = Object.keys(hobj).sort(function(a,b){return hobj[a]-hobj[b]});
		document.getElementById(hkeysSorted[0]).style.border = "1px solid #0000FF";
		document.getElementById(hkeysSorted[0]).addEventListener('click',updateHealthHighlighting,false);
	}
}

function updateAttackHighlighting() {
	var aAttacking = ["Dagger", "Mace", "Polearm", "Battleaxe", "Greatsword", "Arbalest"];
	var gAttacking = [];
	for (aAttack in aAttacking) {
		if (game.equipment[aAttacking[aAttack]].locked == 0) {
			gAttacking.push(aAttacking[aAttack]);
		}
	}
	if (gAttacking.length) {
		for (gAttack in gAttacking) {
			var aequip = game.equipment[gAttacking[gAttack]];
			var mcost = 0;
			mcost += getBuildingItemPrice(aequip, "metal", true);
			var mratio = mcost / aequip.attackCalculated;
			aobj[gAttacking[gAttack]] = mratio;
			if (document.getElementById(gAttacking[gAttack]).style.border = "1px solid #FF0000") {
				document.getElementById(gAttacking[gAttack]).style.border = "1px solid #FFFFFF";
				document.getElementById(gAttacking[gAttack]).removeEventListener("click", updateAttackHighlighting);
			}
		}
		var akeysSorted = Object.keys(aobj).sort(function(a,b){return aobj[a]-aobj[b]});
		document.getElementById(akeysSorted[0]).style.border = "1px solid #FF0000";
		document.getElementById(akeysSorted[0]).addEventListener('click',updateAttackHighlighting,false);
	}
}

function toggleAutoSetting(setting){
	var autoOption = autoTSettings[setting];
	var toggles = autoOption.titles.length;
	if (toggles == 2)	autoOption.enabled = (autoOption.enabled) ? 0 : 1;
	else {
		autoOption.enabled++;
		if (autoOption.enabled >= toggles) autoOption.enabled = 0;
	}
	if (autoOption.onToggle) autoOption.onToggle();
	var menuElem = document.getElementById("toggle" + setting);
	menuElem.innerHTML = autoOption.titles[autoOption.enabled];
	menuElem.className = "";
	menuElem.className = "settingBtn settingBtn" + autoOption.enabled;
}

function talk() {
	document.getElementById("autotrimp").style.display = "block";
}

function pprestigeEquipment(what) {
	if (game.upgrades[what].allowed > game.upgrades[what].done) {
		if (canAffordTwoLevel(game.upgrades[what])) {
			buyUpgrade(what);
			message("Prestiged " + what + ". Was a load of rubbish before!", "Loot", "*eye2", "exotic");
			tooltip("hide");
		}
	}
}

function getGeneticistsRequiredToSeconds(seconds) {
	var timeRemaining = getTimeRemaining(0);
	
	if(seconds > timeRemaining) {
		for(var i = 1; i < 2000 + 2; i++) {
			var tempPrev = timeRemaining;
			timeRemaining = getTimeRemaining(i);
			if(timeRemaining > seconds) {
				if(timeRemaining - seconds > tempPrev - seconds) {
					return i - 1;
				} else {
					return i;
				}
			}
		}
		return null;
	} else if(seconds < timeRemaining) {
		for(var i = -1; i > -2000 - 2; i--) {
			var tempPrev = timeRemaining;
			timeRemaining = getTimeRemaining(i);
			if(timeRemaining < seconds) {
				if(timeRemaining - seconds <= tempPrev - seconds) {
					return i + 1;
				} else {
					return i;
				}
			}
		}
		return null;
	}
	else
	return 0;
}

function getTimeRemaining(addGenesAmt) {
	var trimps = game.resources.trimps;
	
	if (trimps.owned - trimps.employed < 2 || game.global.challengeActive == "Trapper") {
		return 0;
	}
	
	var potencyMod = trimps.potency;
	potencyMod = potencyMod * (1 + game.portal.Pheromones.level * game.portal.Pheromones.modifier);

	if (game.unlocks.quickTrimps) {
		potencyMod *= 2;
	}
	if (game.global.brokenPlanet) {
		potencyMod /= 10;
	}
	if (game.jobs.Geneticist.owned > 0) {
		potencyMod *= Math.pow(.98, game.jobs.Geneticist.owned);
	}
	
	var multiplier = 1;
	if(addGenesAmt >= 0) {
		multiplier *= Math.pow(.98, addGenesAmt);
	} else {
		multiplier *= Math.pow((1/0.98), -addGenesAmt);
	}
	
	var soldiers = game.portal.Coordinated.level ? game.portal.Coordinated.currentSend : trimps.maxSoldiers;
	var numerus = (trimps.realMax() - trimps.employed) / (trimps.realMax() - (soldiers + trimps.employed));
	var base = potencyMod * multiplier + 1;

	return Math.log(numerus)/Math.log(base);
}

function hireFireGeneticistToSeconds(seconds) {
	if(game.jobs["Geneticist"].locked) {
		return;
	}
	
	var tempAmt = game.global.buyAmt;
	var tempState = game.global.firing;
	var tempTooltips = game.global.lockTooltip;
	
	game.global.lockTooltip = true;
	game.global.buyAmt = getGeneticistsRequiredToSeconds(seconds);
	
	if(game.global.buyAmt === null) {
		//message("An error occured. Make sure I didn't try to automatically purchase/sell over " + allowedLoops + " Geneticists!", "Notices");
	} else if(game.global.buyAmt === 0) {
		//message("No additional Geneticists were necessary.", "Notices");
	} else {
		if(game.global.buyAmt < 0) {
			game.global.firing = true;
			game.global.buyAmt = -game.global.buyAmt;
			buyJob("Geneticist");
		} else {
			game.global.firing = false;
			
			var workspaces = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
			
			if (canAffordJob("Geneticist", false, workspaces)){
				if (workspaces >= game.global.buyAmt){
					game.global.firing = false;
					buyJob("Geneticist");
				} else if (game.jobs.Lumberjack.owned >= game.global.buyAmt){
					game.global.firing = true;
					buyJob("Lumberjack");
					game.global.firing = false;
					buyJob("Geneticist");
				} else if (game.jobs.Farmer.owned >= game.global.buyAmt){
					game.global.firing = true;
					buyJob("Farmer");
					game.global.firing = false;
					buyJob("Geneticist");
				} else if (game.jobs.Miner.owned >= game.global.buyAmt){
					game.global.firing = true;
					buyJob("Miner");
					game.global.firing = false;
					buyJob("Geneticist");
				}
			}
		}
	}
	
	game.global.buyAmt = tempAmt;
	game.global.firing = tempState;
	game.global.lockTooltip = tempTooltips;
}

function timeTillFull(resourceName) {
	var perSec = 0;
	var job = "";
	switch (resourceName) {
		case "food":
			job = "Farmer";
			break;
		case "wood":
			job = "Lumberjack";
			break;
		case "metal":
			job = "Miner";
			break;
		default:
			return "";
	}
	if (game.jobs[job].owned > 0){
		perSec = (game.jobs[job].owned * game.jobs[job].modifier);
		if (game.portal.Motivation.level > 0) {
			perSec += (perSec * game.portal.Motivation.level * game.portal.Motivation.modifier);
		}
	}
	if (game.global.playerGathering === resourceName){
		if (game.global.turkimpTimer > 0){
			perSec *= 1.5;
		}
		perSec += game.global.playerModifier;
	}
	amount = perSec / game.settings.speed;
	
	if (perSec <= 0){
		return "";
	}
	var remaining = ((game.resources[resourceName].max * (1 + game.portal.Packrat.modifier * game.portal.Packrat.level))) - game.resources[resourceName].owned;
	if (remaining <= 0){
		return "";
	}
	return Math.floor(remaining / perSec);
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
// This loops and updates stuff as things change
function myTimer() {
	//Buy resource buildings
	if (autoTSettings.autobuildings.enabled == 1) {
		var food = game.resources.food.owned / (game.resources.food.max + (game.resources.food.max * game.portal.Packrat.modifier * game.portal.Packrat.level));
		var wood = game.resources.wood.owned / (game.resources.wood.max + (game.resources.wood.max * game.portal.Packrat.modifier * game.portal.Packrat.level));
		var metal = game.resources.metal.owned / (game.resources.metal.max + (game.resources.metal.max * game.portal.Packrat.modifier * game.portal.Packrat.level));
		var foodTime = timeTillFull("food");
		var woodTime = timeTillFull("wood");
		var metalTime = timeTillFull("metal");
		if ((food > 0.9 || foodTime < 600) && canAffordBuilding("Barn")) {
			buyBuilding('Barn');
			tooltip("hide");
			message("Bought us another barn. It's red...hooray.", "Loot", "*eye2", "exotic");
		}
		if ((wood > 0.9 || woodTime < 600) && canAffordBuilding("Shed")) {
			buyBuilding('Shed');
			tooltip("hide");
			message("Bought us another shed. It's very shed-like", "Loot", "*eye2", "exotic");
		}
		if ((metal > 0.9 || metalTime < 600) && canAffordBuilding("Forge")) {
			buyBuilding('Forge');
			tooltip("hide");
			message("Bought us another forge. It's a good forge.", "Loot", "*eye2", "exotic")
		}
	}

	//Buy tributes
	if (autoTSettings.autogymbutes.enabled == 1 || autoTSettings.autogymbutes.enabled == 3) {
		var buyAmt = game.global.buyAmt;
		game.global.buyAmt = 1;
		if (getBuildingItemPrice(game.buildings.Tribute, "food", false) <= game.resources.food.owned && game.buildings.Tribute.locked == 0) {
			buyBuilding('Tribute');
			tooltip("hide");
			message("Bought us a tribute. The gems must flow!", "Loot", "*eye2", "exotic");
		}
		game.global.buyAmt = buyAmt;
	}


	//Buy gyms
	if (autoTSettings.autogymbutes.enabled == 1 || autoTSettings.autogymbutes.enabled == 2) {
		buyAmt = game.global.buyAmt;
		game.global.buyAmt = 1;
		if (getBuildingItemPrice(game.buildings.Gym, "wood", false) <= game.resources.wood.owned && game.buildings.Gym.locked == 0) {
			buyBuilding('Gym');
			tooltip("hide");
			message("Bought us a gym. Open 24/7.", "Loot", "*eye2", "exotic");
		}
		game.global.buyAmt = buyAmt;
	}

	//Buy housing
	if (autoTSettings.autobuildhouses.enabled == 1 || autoTSettings.autobuildhouses.enabled == 2) {
		buyGemCheapestHousing();
	}

	// Buy Nerseries
	if (autoTSettings.autobuildhouses.enabled == 1 || autoTSettings.autobuildhouses.enabled == 3) {
		buyAmt = game.global.buyAmt;
		game.global.buyAmt = 1;
		if (canAffordBuilding("Nursery") && game.buildings.Nursery.locked == 0) {
			buyBuilding("Nursery");
			tooltip("hide");
			message("Nurseries for trimps. Be better if you stopped killing them off so fast though...", "Loot", "*eye2", "exotic");
		}
		game.global.buyAmt = buyAmt;
	}
	//check to see if we're stuck in premap screen
	if (autoTSettings.autopremaps.enabled == 1 && game.global.preMapsActive) {
		switch (premapscounter) {
		case 0:
			premapscounter += 1;
			break;
		case 1:
			premapscounter += 1;
			break;
		case 2:
			premapscounter += 1;
			break;
		case 3:
			premapscounter += 1;
			break;
		case 4:
			premapscounter = 0;
			mapsClicked();
			break;
		}
	} else {
		premapscounter = 0;
	}

	//Manage Map Repeat
	if (autoTSettings.automapbmax.enabled > 0 && game.global.mapsActive && !game.global.preMapsActive) {
		if (game.global.mapsOwnedArray[getMapIndex(game.global.currentMapId)].noRecycle) {
			if (game.global.repeatMap) {
				repeatClicked();
			}
		}else {
			if (game.global.mapBonus == 9 && game.global.repeatMap) {
				repeatClicked();
			} else if (game.global.mapBonus != 9 && !game.global.repeatMap) {
				repeatClicked();
			}
		}
		if (!document.getElementById("repeatBtn").innerHTML.endsWith("*")) {
			document.getElementById("repeatBtn").appendChild(document.createTextNode("*"))
		}
	} else if (autoTSettings.automapbmax.enabled == 0 && game.global.mapsActive && !game.global.preMapsActive) {
		document.getElementById("repeatBtn").innerHTML = (game.global.repeatMap) ? "Repeat On" : "Repeat Off";
	}
	
	if (autoTSettings.automapbmax.enabled == 2 && !game.global.mapsActive && game.global.mapBonus !== 10){

		mapsClicked();
		mapsClicked();
		buyMap();
		var mapID=document.getElementsByClassName('mapThing')[0].id;
		console.log(mapID)
		setTimeout(function(){selectMap(mapID)}, 1000);
		setTimeout(function(){runMap()}, 2000);
		
	}

	//Buy gyms
	if (autoTSettings.autogymbutes.enabled == 1 || autoTSettings.autogymbutes.enabled == 2) {
		if (getBuildingItemPrice(game.buildings.Gym, "wood", false) <= game.resources.wood.owned && game.buildings.Gym.locked == 0) {
			buyBuilding('Gym');
			tooltip("hide");
			message("Bought us a gym. Open 24/7.", "Loot", "*eye2", "exotic")
		}
	}

	//Highlight housing
	if (autoTSettings.autohighlight.enabled == 1 || autoTSettings.autohighlight.enabled == 2) {
		updateHousingHighlighting();
	} else {
		var ahousing = ["Mansion", "Hotel", "Resort", "Collector", "Warpstation"];
		var ghousing = [];
		for (ahouse in ahousing) {
			if (game.buildings[ahousing[ahouse]].locked == 0) {
				ghousing.push(ahousing[ahouse]);
			}
		}
		for (ghouse in ghousing) {
			if (document.getElementById(ghousing[ghouse]).style.border = "1px solid #00CC00") {
				document.getElementById(ghousing[ghouse]).style.border = "1px solid #FFFFFF";
				document.getElementById(ghousing[ghouse]).removeEventListener("click", updateHousingHighlighting);
			}
		}
	}

	if (autoTSettings.autohighlight.enabled == 1 || autoTSettings.autohighlight.enabled == 3) {
		updateHealthHighlighting();
		updateAttackHighlighting();
	} else {
		var aAttacking = ["Dagger", "Mace", "Polearm", "Battleaxe", "Greatsword"];
		var gAttacking = [];
		for (aAttack in aAttacking) {
			if (game.equipment[aAttacking[aAttack]].locked == 0) {
				gAttacking.push(aAttacking[aAttack]);
			}

		}
		for (gAttack in gAttacking) {
			if (document.getElementById(gAttacking[gAttack]).style.border = "1px solid #FF0000") {
				document.getElementById(gAttacking[gAttack]).style.border = "1px solid #FFFFFF";
				document.getElementById(gAttacking[gAttack]).removeEventListener("click", updateAttackHighlighting);
			}
		}
		var ahealth = ["Boots", "Helmet", "Pants", "Shoulderguards", "Breastplate"];
		var ghealth = [];
		for (aheal in ahealth) {
			if (game.equipment[ahealth[aheal]].locked == 0) {
				ghealth.push(ahealth[aheal]);
			}
		}
		if (ghealth.length) {
			for (gheal in ghealth) {
				if (document.getElementById(ghealth[gheal]).style.border = "1px solid #0000FF") {
					document.getElementById(ghealth[gheal]).style.border = "1px solid #FFFFFF";
					document.getElementById(ghealth[gheal]).removeEventListener("click", updateHealthHighlighting);
				}
			}
		}
	}



	//Buy speed upgrades
	if (autoTSettings.autoupgrades.enabled !== 0) {
		buyAmt = game.global.buyAmt;
		game.global.buyAmt = 1;
		autotrimpupgrades = ["Egg", "UberHut", "UberHouse", "UberMansion", "UberHotel", "UberResort", "Bounty", "Efficiency", "TrainTacular", "Gymystic", "Megascience", "Megaminer", "Megalumber", "Megafarming", "Speedfarming", "Speedlumber", "Speedminer", "Speedscience", "Potency"]
		for (var key in game.upgrades) {
			if (autotrimpupgrades.indexOf(key) != -1) { 
				if (game.upgrades[key].allowed > game.upgrades[key].done && canAffordTwoLevel(game.upgrades[key])) {
					buyUpgrade(key);
					if (key == "Efficiency") {
						message("I read you the " + key + " book while you were asleep. I think it worked.", "Loot", "*eye2", "exotic")
					} else {
						message("Read the trimps the " + key + " book. Only some of them listened.", "Loot", "*eye2", "exotic")
					}
				}
			}
		}

		//Buy coordination

		if (game.upgrades.Coordination.allowed > game.upgrades.Coordination.done) {
			if (canAffordCoordinationTrimps() && canAffordTwoLevel(game.upgrades.Coordination)){
				buyUpgrade('Coordination');
				message("We read Coordination together before bedtime, it was sweet. Now let's go kill something.", "Loot", "*eye2", "exotic")
			}
		}
		game.global.buyAmt = buyAmt;
	}

	// Make the trimps work if idle
	if (autoTSettings.autoworkers.enabled == 1) {
		sendTrimpsToWork();
	}
	if (!game.jobs["Geneticist"].locked){
		hireFireGeneticistToSeconds(targetSeconds);
	}
	// prestige weapon if available
	if (autoTSettings.autoupgrades.enabled == 2 || autoTSettings.autoupgrades.enabled == 3) {
		pprestigeEquipment('Dagadder');
		pprestigeEquipment('Megamace');
		pprestigeEquipment('Polierarm');
		pprestigeEquipment('Axeidic');
		pprestigeEquipment('Greatersword');
	}
	
	// prestige all equipment if available
	if (autoTSettings.autoupgrades.enabled == 3 || autoTSettings.autoupgrades.enabled == 4) {
		pprestigeEquipment('Bootboost');
		pprestigeEquipment('Hellishmet');
		pprestigeEquipment('Pantastic');
		pprestigeEquipment('Smoldershoulder');
		pprestigeEquipment('Bestplate');
	}

	//Update mapbonus
	if (game.global.mapsActive && !game.global.preMapsActive) {
		var level = getCurrentMapObject().level;
		document.getElementById("worldNumber").innerHTML = "<br>Lv: " + level + "  (+" + prettify(game.global.mapBonus * 20) + "%)"
	}
	//remove alerts if they exist
	var removebadge = true;
	var badgeupgrades = document.getElementById("upgradesHere");
	for (i = 0; i<badgeupgrades.childNodes.length; i++) { 
		if (badgeupgrades.childNodes[i].childNodes[0].innerHTML == "!") {
			removebadge = false;
		}
	}
	if (removebadge) {
		document.getElementById("upgradesAlert").innerHTML = "";
	}

	//save
	localStorage.setItem("autotrimpsave",JSON.stringify(autoTSettings));

	//check for portal/reset
	if (game.global.gridArray.length == 0) {
		document.getElementById("talkBtn").style.display = "none";
		for (item in autoTSettings) {
			if (item != "versioning") {
				while (autoTSettings[item].enabled != 0) {
					toggleAutoSetting(item);
				}
			}
		}
	}

	//clearInterval(myVar);
}//end loop

function newTimer() {
	if (game.global.gridArray.length != 0) {
		document.getElementById("talkBtn").style.display = "block";
	}
	badguyMinAtt = game.global.gridArray[game.global.lastClearedCell + 1].attack * .805; //fudge factor
	badguyMaxAtt = game.global.gridArray[game.global.lastClearedCell + 1].attack * 1.19;
	badguyFast = game.badGuys[game.global.gridArray[game.global.lastClearedCell + 1].name].fast;
	if (game.global.mapsActive && !game.global.preMapsActive){
		badguyMinAtt = game.global.mapGridArray[game.global.lastClearedMapCell + 1].attack * .805;
		badguyMaxAtt = game.global.mapGridArray[game.global.lastClearedMapCell + 1].attack * 1.19;
		badguyFast = game.badGuys[game.global.mapGridArray[game.global.lastClearedMapCell + 1].name].fast;
	}
	mysoldiers = (game.portal.Coordinated.level) ? game.portal.Coordinated.currentSend : game.resources.trimps.maxSoldiers ;
	/*	mytoughness = (game.portal.Toughness.level * game.portal.Toughness.modifier * 100) + 100;
	blockformation = 1;
	healthformation = 1;
	switch (game.global.formation) {
		case 1:
			healthformation = 4;
			blockformation = .5;
		break;
		case 2:
			healthformation = .5;
			blockformation = .5;
		break;
		case 3:
			healthformation = .5;
			blockformation = 4;
		break;
	}*/
	//myblock = game.global.block * game.jobs.Trainer.owned * game.jobs.Trainer.modifier * mysoldiers * blockformation;
	myblock = game.global.soldierCurrentBlock;
	//myhealth = game.global.health * mysoldiers * mytoughness * healthformation;
	myhealth = game.global.soldierHealthMax;

	//avoid snimps
	if (autoTSettings.autosnimps.enabled == 1) {
		if (autoTSettings.autohighlight.enabled == 0 || autoTSettings.autohighlight.enabled == 2) {
			toggleAutoSetting("autohighlight");	
			toggleAutoSetting("autohighlight");	
			toggleAutoSetting("autohighlight");	
		}
		if (badguyFast && badguyMinAtt > (myblock + myhealth) && game.global.formation != 2) {
			console.log(game.global.formation)
			message("You're stuck on a fast enemy. I would fix this by buying a level of " + hkeysSorted[0] + ".", "Loot", "*eye2", "exotic")	
		}
	}


	if (autoTSettings.autoformations.enabled == 1 && game.upgrades.Dominance.done == 1)	{
		if (game.global.mapsActive && !game.global.preMapsActive){
			if (game.badGuys[game.global.mapGridArray[game.global.lastClearedMapCell + 1].name].fast) {
				if (game.global.formation == 2 && myblock < badguyMaxAtt) {setFormation(1);}
			} else {
				if (game.global.formation == 1) {setFormation(2);}
			}
		} else {
			if (game.badGuys[game.global.gridArray[game.global.lastClearedCell + 1].name].fast) {
				if (game.global.formation == 2) {setFormation(1);}
			} else {
				if (game.global.formation == 1) {setFormation(2);}
			}
		}
	}
	
	//check to see if we're building on an empty queue, or if we're gathering when there's building to be done
	if (autoTSettings.autogather.enabled == 1) {
		if (game.global.playerGathering != "buildings") {
			wasgathering = game.global.playerGathering;
		}
		if (game.global.buildingsQueue.length > 0 && !game.global.buildingsQueue[0].startsWith("Trap") && game.global.playerGathering != "buildings") {
			setGather('buildings');
		} else if (game.global.buildingsQueue.length == 0 && wasgathering != "") {
			setGather(wasgathering);
		} else if (game.global.buildingsQueue.length > 0 && game.global.buildingsQueue[0].startsWith("Trap") && game.global.playerGathering == "buildings" && wasgathering != "") {
			setGather(wasgathering);
		}
	}
	
	//set breedtimer
	breedTimer.innerHTML = "(" + Math.round(getTimeRemaining(0)) + "s) ";
	
}//end new loop
