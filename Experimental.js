/*
To Do:
- Custom Number Tabs (+1, +10, +25, +100) [Both for Regular and Helium Purchases but separate custom settings]
- Auto Buy Storage at [USER-INPUT]%
- Auto Buy Housing (???)
- Auto Buy Gyms & Tributes
- Auto Read [Lists of each book]
- Highlight Efficient Housing
- Highlight Efficient (Offensive and Defensive) Equipment
- Exit Premap Screen after [USER-INPUT] seconds.
- Gather & Building Switching (Doesn't switch to building when trap in queue)
- Efficient Formation Switching (Switch each new troop)
- Active Formation Switching (Switch during battle)
- Categories (Buttons, Automate, Cheats)
- Move created nodes to another file and write statement to add file to head.

Incomplete:
- Auto-Remove Shieldblock (Automate)
- Job Hire Ratio (Buttons)
- Job Hire Ratio (Automate)

Complete:
- Unlearn Shieldblock (Buttons)
- Remove Shieldblock (Buttons)
- Re-Allow Perk Respec (Buttons)
- Add New Message Type/Filter (Helper)

Icomoon Icon ID List: http://trimps.github.io/fonts/icomoon/style.css
*/

var helperSettings = {};
var version = "0.4.2";
var checking = JSON.parse(localStorage.getItem("helperSettingsSave"))
if (checking != null && checking.version == version || false) {
	helperSettings = checking;	
}
else {
	helperSettings = {
		version: version, 
		togglable: {
			autoRemoveShieldblock: {status: 0, text: ["Off", "On"]},
			autoApplyJobRatio: {status: 0, text: ["Off", "On"]}
		},
		flag: {
			removedShieldblock: false
		},
		jobRatio: {
			Farmer: 1,
			Lumberjack: 1,
			Miner: 1,
			Unemployed: 10
		},
		autosaveTime: 30000
	};
}


helperCSS = document.createElement("link");
helperCSS.setAttribute("id", "helperCSS");
helperCSS.setAttribute("rel", "stylesheet");
helperCSS.setAttribute("type", "text/css");
helperCSS.setAttribute("href", "https://Natsulus.github.io/TrimpHelper/Helper.css");
document.getElementsByTagName("head").item(0).appendChild(helperCSS); // Add helperCSS

// OCD
document.getElementById("buyContainer").style.height = "calc(99vh - 30vw - 41px)";
document.getElementById("helium").style.height = "32.4%";

game.global.messages.Helper = true;

var helperBtnGroup = document.createElement("DIV");
helperBtnGroup.setAttribute("class", "btn-group");
helperBtnGroup.setAttribute("role", "group");

var helperBtn = document.createElement("BUTTON");
helperBtn.setAttribute("id", "HelperFilter");
helperBtn.setAttribute("type", "button");
helperBtn.setAttribute("onclick", "filterMessage('Helper')");
helperBtn.setAttribute("class", "btn btn-success logFlt");

helperBtnText = document.createTextNode("Helper");

helperBtn.appendChild(helperBtnText);
helperBtnGroup.appendChild(helperBtn);

document.getElementById("logBtnGroup").appendChild(helperBtnGroup); // Helper Log Filter Button


var helperTab = document.createElement("LI");
helperTab.setAttribute("role", "presentation");
helperTab.setAttribute("id", "helperTab");
helperTab.setAttribute("onclick", "filterTabs('helper')");
helperTab.setAttribute("class", "buyTab");
helperTab.setAttribute("style", "background: rgba(255, 255, 255, 0.25);");

var helperA = document.createElement("A");
helperA.setAttribute("id", "helperA");
helperA.setAttribute("href", "#");
helperA.setAttribute("title", "");
helperA.setAttribute("style", "border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(221, 221, 221);");

var helperTabText = document.createTextNode("Helper");

helperA.appendChild(helperTabText);
helperTab.appendChild(helperA);

document.getElementById("buyTabsUl").appendChild(helperTab); // Create Helper Tab


// Create a Container using the example from container.html
var helperContainer = document.createElement("DIV");
helperContainer.setAttribute("id", "helperContainer");
helperContainer.setAttribute("style", "display: none;");

var helperTitleDiv = document.createElement("DIV");
helperTitleDiv.setAttribute("id", "helperTitleDiv");
helperTitleDiv.setAttribute("class", "titleDiv");

var helperTitleRow = document.createElement("DIV");
helperTitleRow.setAttribute("class", "row");

var helperTitleCol = document.createElement("DIV");
helperTitleCol.setAttribute("class", "col-xs-4");

var helperTitleSpan = document.createElement("SPAN");
helperTitleSpan.setAttribute("id", "helperTitleSpan");
helperTitleSpan.setAttribute("class", "titleSpan");

var helperTitleText = document.createTextNode("Helper");

helperTitleSpan.appendChild(helperTitleText);
helperTitleCol.appendChild(helperTitleSpan);
helperTitleRow.appendChild(helperTitleCol);
helperTitleDiv.appendChild(helperTitleRow); // helperTitleDiv


var helperHere = document.createElement("DIV");
helperHere.setAttribute("class", "buyBox");
helperHere.setAttribute("id", "helperHere");

var unlearnShieldblockBtn = document.createElement("DIV");
unlearnShieldblockBtn.setAttribute("onmouseover", "");
unlearnShieldblockBtn.setAttribute("onmouseout", "tooltip('hide')");
unlearnShieldblockBtn.setAttribute("class", "thing noselect pointer upgradeThing helperButton");
unlearnShieldblockBtn.setAttribute("id", "unlearnShieldblockBtn");
unlearnShieldblockBtn.setAttribute("onclick", "unlearnShieldblock()");

var unlearnShieldblockBtnSpan = document.createElement("SPAN");
unlearnShieldblockBtnSpan.setAttribute("class", "thingName");

var unlearnShieldblockBtnthingName = document.createTextNode("Unlearn Shieldblock");

unlearnShieldblockBtnSpan.appendChild(unlearnShieldblockBtnthingName);
unlearnShieldblockBtn.appendChild(unlearnShieldblockBtnSpan); // unlearnShieldblockBtn

var removeShieldblockBtn = document.createElement("DIV");
removeShieldblockBtn.setAttribute("onmouseover", "");
removeShieldblockBtn.setAttribute("onmouseout", "tooltip('hide')");
removeShieldblockBtn.setAttribute("class", "thing noselect pointer upgradeThing helperButton");
removeShieldblockBtn.setAttribute("id", "removeShieldblockBtn");
removeShieldblockBtn.setAttribute("onclick", "removeShieldblock()");

var removeShieldblockBtnSpan = document.createElement("SPAN");
removeShieldblockBtnSpan.setAttribute("class", "thingName");

var removeShieldblockBtnthingName = document.createTextNode("Remove Shieldblock");

removeShieldblockBtnSpan.appendChild(removeShieldblockBtnthingName);
removeShieldblockBtn.appendChild(removeShieldblockBtnSpan); // removeShieldblockBtn

var allowRespecBtn = document.createElement("DIV");
allowRespecBtn.setAttribute("onmouseover", "");
allowRespecBtn.setAttribute("onmouseout", "tooltip('hide')");
allowRespecBtn.setAttribute("class", "thing noselect pointer upgradeThing helperButton");
allowRespecBtn.setAttribute("id", "allowRespecBtn");
allowRespecBtn.setAttribute("onclick", "allowRespec()");

var allowRespecBtnSpan = document.createElement("SPAN");
allowRespecBtnSpan.setAttribute("class", "thingName");

var allowRespecBtnthingName = document.createTextNode("Allow Respec");

allowRespecBtnSpan.appendChild(allowRespecBtnthingName);
allowRespecBtn.appendChild(allowRespecBtnSpan); // allowRespecBtn

helperHere.appendChild(unlearnShieldblockBtn);
helperHere.appendChild(removeShieldblockBtn);
helperHere.appendChild(allowRespecBtn);

helperContainer.appendChild(helperTitleDiv);
helperContainer.appendChild(helperHere);

document.getElementById("buyHere").appendChild(helperContainer);

var helperInterval = setInterval(helperLoop, 1000);
saveLoop();

function unlearnShieldblock(confirmed) {
	if (game.upgrades.Shieldblock.done == 1) {
		if (!confirmed) {
			helperTooltip('Button', 'Unlearn Shieldblock', 'Your Trimps will forget how to block with their shields, however they will be able to endure more from direct hits. Are you sure?', 'unlearnShieldblock(true)');
			return;
		}
		game.upgrades.Shieldblock.done = 0;
		prestigeEquipment("Shield", false, true);
		game.equipment.Shield.blockNow = false;
		game.equipment.Shield.tooltip = "A big, wooden shield. Adds $healthCalculated$ health to each soldier per level.";
		levelEquipment("Shield", 1);
		message("Your Trimps forgot how to block with their shields, however they are now able to endure more from direct hits.", "Helper", "*help");
	}
	else {
		message("Your Trimps don't even know how to block with their shields!", "Helper", "*exclamation-triangle");
	}
}

function removeShieldblock(confirmed) {
	if (game.upgrades.Shieldblock.locked == 0) {
		if (!confirmed) {
			helperTooltip('Button', 'Remove Shieldblock', 'This will remove the Shieldblock Book. Are you sure?', 'removeShieldblock(true)');
			return;
		}
		game.upgrades.Shieldblock.allowed = 0
		game.upgrades.Shieldblock.locked = 1
		helperSettings.flag.removedShieldblock = true;
		document.getElementById("upgradesHere").removeChild(document.getElementById("Shieldblock"));
		message("You accidentally burnt the Shieldblock Book to a crisp while cooking your marshmallows.", "Helper", "*fire");
	}
	else {
		if (helperSettings.flag.removedShieldblock)
			message("You already burnt the Shieldblock Book!", "Helper", "*exclamation-triangle");
		else
			message("You currently don't own the Shieldblock Book.", "Helper", "*exclamation-triangle");
	}
}


function allowRespec(confirmed) {
	if (game.global.canRespecPerks == false) {
		if (!confirmed) {
			helperTooltip('Button', 'Allow Respec', 'This will allow you to respec again. Are you sure?', 'allowRespec(true)');
			return;
		}
		game.global.canRespecPerks = true;
		message("You can now respec.", "Helper", "*thumbs-up2");
	}
	else {
		message("You can already respec!", "Helper", "*exclamation-triangle");
	}
}

function helperTooltip(what, titleString, textString, attachFunction) {
	if (game.global.lockTooltip) return;
	//if (helperSettings.disableTooltip && what == "Hover") ???; // Disables hover tooltips
	
	var elem = document.getElementById("tooltipDiv");
	var ondisplay = null; // if non-null, called after the tooltip is displayed
	if (what == "hide"){
		elem.style.display = "none";
		tooltipUpdateFunction = "";
		return;
	}
	var tooltipText;
	var btnText = "";
	var toTip;
	var price;
	var canAfford;
	var percentOfTotal = "";
	if (what == "Button"){
		tooltipText = textString;
		btnText += '<div class="maxCenter"><div class="btn btn-info confirmBtn" onclick="' + attachFunction + '; cancelTooltip()">Confirm</div><div class="btn btn-info confirmBtn" onclick="cancelTooltip()">Cancel</div></div>';
		game.global.lockTooltip = true;
		elem.style.left = "32.5%";
		elem.style.top = "25%";
	}

	document.getElementById("tipTitle").innerHTML = titleString;
	document.getElementById("tipText").innerHTML = textString;
	document.getElementById("tipCost").innerHTML = btnText;
	elem.style.display = "block";
}

function toggleSettings(setting){
	var option = helpersettings.togglable[setting];
	var toggles = option.text.length;
	if (toggles == 2) option.status = (option.status) ? 0 : 1;
	else {
		option.status++;
		if (option.status >= toggles) option.status = 0;
	}
	if (autoOption.onToggle) autoOption.onToggle();
	var menuElem = document.getElementById("toggle" + setting);
	menuElem.innerHTML = option.text[option.status];
	menuElem.className = "";
	menuElem.className = "settingBtn settingBtn" + option.status;
}

function gcd(a, b) {
    if (a < 0) a = -a;
    if (b < 0) b = -b;
    if (b > a) {var temp = a; a = b; b = temp;}
    while (true) {
        if (b == 0) return a;
        a %= b;
        if (a == 0) return b;
        b %= a;
    }
}

function gcdMulti() {
	var result = arguments[0];
	for(var i = 1; i < arguments.length; i++){
		result = gcd(result, arguments[i]);
	}
	return result;
}

// Need to change helperSettings.[JOB]Ratio to the value of input text boxes.
function JobHireRatioCost(apply, afford) {
	if (game.jobs.Miner.locked == 1) {
		var gcd = gcd(helperSettings.jobRatio.Farmer, helperSettings.jobRatio.Lumberjack);
		var farmerRatio = helperSettings.jobRatio.Farmer/gcd;
		var lumberjackRatio = helperSettings.jobRatio.Lumberjack/gcd;
		var totalRatio = farmerRatio + lumberjackRatio;
		var workspaces = Math.ceil(game.resources.trimps.realMax() / 2) - (game.jobs.Scientist.owned + game.jobs.Trainer.owned + game.jobs.Explorer.owned + game.jobs.Geneticist.owned + helperSettings.jobRatio.Unemployed);
		var ratioPortion = Math.floor(workspaces / totalRatio);
		var jobsAmt = {
			Farmer: (ratioPortion * farmerRatio),
			Lumberjack: (ratioPortion * lumberjackRatio)
		};
		var jobs = ["Farmer", "Lumberjack"];
	}
	else {
		var gcd = gcdMulti(helperSettings.jobRatio.Farmer, helperSettings.jobRatio.Lumberjack, helperSettings.jobRatio.Miner);
		var farmerRatio = helperSettings.jobRatio.Farmer/gcd;
		var lumberjackRatio = helperSettings.jobRatio.Lumberjack/gcd;
		var minerRatio = helperSettings.jobRatio.Miner/gcd;
		var totalRatio = farmerRatio + lumberjackRatio + minerRatio;
		var workspaces = Math.ceil(game.resources.trimps.realMax() / 2) - (game.jobs.Scientist.owned + game.jobs.Trainer.owned + game.jobs.Explorer.owned + game.jobs.Geneticist.owned + helperSettings.jobRatio.Unemployed);
		var ratioPortion = Math.floor(workspaces / totalRatio);
		var jobsAmt = {
			Farmer: (ratioPortion * farmerRatio),
			Lumberjack: (ratioPortion * lumberjackRatio),
			Miner: (ratioPortion * minerRatio)
		};
		var jobs = ["Farmer", "Lumberjack", "Miner"];
	}
	var toEmploy = 0;

	if (apply) {
		if (Math.floor(game.resources.trimps.owned) < workspaces) {
			return;
		}
		jobs.forEach(function(job) {
			if (game.jobs[job].owned > jobsAmt[job]) {
				game.resources.trimps.employed -= (game.jobs[job].owned - jobsAmt[job]);
				game.jobs[job].owned -= (game.jobs[job].owned - jobsAmt[job]);
			} 
		});
		jobs.forEach(function(job) {
			if (game.jobs[job].owned < jobsAmt[job]) {
				game.resources.trimps.employed += (jobsAmt[job] - game.jobs[job].owned);
				game.jobs[job].owned += (jobsAmt[job] - game.jobs[job].owned);
				toEmploy += (jobsAmt[job] - game.jobs[job].owned);
			}
		});
		var cost = 5 * toEmploy;
		game.resources.food.owned -= cost;
		return;
	} 
	else {
		jobs.forEach(function(job) {
			if (game.jobs[job].owned < jobsAmt[job]) {
				toEmploy += (jobsAmt[job] - game.jobs[job].owned);
			} 
		});;
		var cost = 5 * toEmploy;
		if (afford) {
			if (Math.floor(game.resources.trimps.owned) < workspaces) {
				return false;
			}
			return (game.resources.food.owned > cost) ? true : false;
		}
		if (Math.floor(game.resources.trimps.owned) < workspaces) {
			return "<span class='red'>Not enough Trimps owned.</span>";
		}
		if (game.resources.food.owned > cost)
			return "<span class='green'>food: " + prettify(cost) + " (" + prettify(((cost / game.resources.food.owned) * 100).toFixed(1)) + "%)" + "</span>";
		else
			return "<span class='red'>food: " + prettify(cost) + " (" + calculateTimeToMax(null, getPsString('food', true), (cost - game.resources.food.owned)) + ")</span>";
	}
} // All in one Job Hire Ratio Function

function updateHelperButton(id, canAfford) {
	var elem = document.getElementById(id);
	if (elem === null)
		return;
	var color = (canAfford) ? "black" : "grey";
	elem.style.background = color;
}

function helperLoop() {
	if (helperSettings.togglable.autoRemoveShieldblock.status == 1 && game.upgrades.Shieldblock.locked == 0) {
		removeShieldblock(true);
	}

	if (helperSettings.togglable.autoApplyJobRatio.status == 1) {
		JobHireRatioCost(true);
	}

	if (game.global.gridArray.length == 0) {
		helperSettings.flag.removedShieldblock = false;
	}

	updateHelperButton("JobHireRatioBtn", JobHireRatioCost(false, true));
}

function saveLoop() {
	setTimeout(function() {
		localStorage.setItem("helperSettingsSave",JSON.stringify(helperSettings))
		message("Saved TrimpHelper Settings!", "Helper", "*cog2");
		saveLoop();
	}, helperSettings.autosaveTime);
}

filterTabs = function(what) {
	enableDisableTab(game.global.buyTab, false);
	game.global.buyTab = what;
	enableDisableTab(what, true);
	var tabs = ["buildings", "jobs", "upgrades", "equipment", "helper"];
	for (var tab in tabs) {
		tab = tabs[tab];
		if (what == "all" && tab == "helper")
			document.getElementById(tab + "Container").style.display = "none";
		else
			document.getElementById(tab + "Container").style.display = (what == "all" || tab == what) ? "block" : "none";
	}
	if (what == "helper") {
		document.getElementById("numTabs").style.display = "none";
		document.getElementById("buyContainer").style.height = "calc(99vh - 30vw - 6px)"; // Adjust size from removing numTabs/
	} else {
		document.getElementById("numTabs").style.display = "block";
		document.getElementById("buyContainer").style.height = "calc(99vh - 30vw - 41px)";
	}
}

message = function(messageString, type, lootIcon, extraClass) {
	var log = document.getElementById("log");
	var needsScroll = ((log.scrollTop + 10) > (log.scrollHeight - log.clientHeight));
	var displayType = (game.global.messages[type]) ? "block" : "none";
	var prefix = "";
	if (lootIcon && lootIcon.charAt(0) == "*") {
		lootIcon = lootIcon.replace("*", "");
		prefix =  "icomoon icon-" 
	}
	else prefix = "glyphicon glyphicon-";
	if (type == "Story") messageString = "<span class='glyphicon glyphicon-star'></span> " + messageString;
	if (type == "Combat") messageString = "<span class='glyphicon glyphicon-flag'></span> " + messageString;
	if (type == "Loot" && lootIcon) messageString = "<span class='" + prefix + lootIcon + "'></span> " + messageString;
	if (type == "Helper") {
		if (lootIcon) 
			messageString = "<span class='" + prefix + lootIcon + "'></span> " + messageString;
		else
			messageString = "<span class='icomoon icon-info2'></span> " + messageString;
	}
	var addId = "";
	if (messageString == "Game Saved!") {
		addId = " id='saveGame'";
		if (document.getElementById('saveGame') !== null) {
			log.removeChild(document.getElementById('saveGame'));
		}
	}
	if (messageString.indexOf("Saved TrimpHelper Settings!") > -1) {
		addId = " id='helperSettings'";
		if (document.getElementById('helperSettings') !== null) {
			log.removeChild(document.getElementById('helperSettings'));
		}
	}
	if (type == "Notices"){
		messageString = "<span class='glyphicon glyphicon-off'></span> " + messageString;
	}
	log.innerHTML += "<span" + addId + " class='" + type + "Message message" +  " " + extraClass + "' style='display: " + displayType + "'>" + messageString + "</span>";
	if (needsScroll) log.scrollTop = log.scrollHeight;
	if (type != "Story") trimMessages(type);
} // Re-Defining Functions to add Helper
