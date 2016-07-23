// ==UserScript==
// @name         AutoTrimpsV2+genBTC
// @namespace    http://tampermonkey.net/
// @version      2.1.1-genbtc-stable-5-21-2016
// @description  try to take over the world!
// @author       zininzinin, spindrjr, belaith, ishakaru, genBTC, hider
// @include      *trimps.github.io*
// @include        *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==


////////////////////////////////////////
//Variables/////////////////////////////
////////////////////////////////////////
var AutoTrimpsDebugTabVisible = true;

var runInterval = 100; //How often to loop through logic
var startupDelay = 2000;
var enableDebug = true; //Spam console?
var autoTrimpSettings = new Object();
var bestBuilding;
var scienceNeeded;
var breedFire = false;
var shouldFarm = false;
var enoughDamage = true;
var enoughHealth = true;
var stopScientistsatFarmers;

//Hider's
var newCoord = false;
var letItGo = 0;
var Gigas = 0;
var WarpstationWall = false;





var baseDamage = 0;
var baseBlock = 0;
var baseHealth = 0;

var preBuyAmt = game.global.buyAmt;
var preBuyFiring = game.global.firing;
var preBuyTooltip = game.global.lockTooltip;
var preBuymaxSplit = game.global.maxSplit;

////////////////////////////////////////
//List Variables////////////////////////
////////////////////////////////////////
var equipmentList = {
    'Dagger': {
        Upgrade: 'Dagadder',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Mace': {
        Upgrade: 'Megamace',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Polearm': {
        Upgrade: 'Polierarm',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Battleaxe': {
        Upgrade: 'Axeidic',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Greatsword': {
        Upgrade: 'Greatersword',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Boots': {
        Upgrade: 'Bootboost',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Helmet': {
        Upgrade: 'Hellishmet',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Pants': {
        Upgrade: 'Pantastic',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Shoulderguards': {
        Upgrade: 'Smoldershoulder',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Breastplate': {
        Upgrade: 'Bestplate',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Arbalest': {
        Upgrade: 'Harmbalest',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Gambeson': {
        Upgrade: 'GambesOP',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Shield': {
        Upgrade: 'Supershield',
        Stat: 'health',
        Resource: 'wood',
        Equip: true
    },
    'Gym': {
        Upgrade: 'Gymystic',
        Stat: 'block',
        Resource: 'wood',
        Equip: false
    }
};

var upgradeList = ['Coordination', 'Speedminer', 'Speedlumber', 'Speedfarming', 'Speedscience', 'Megaminer', 'Megalumber', 'Megafarming', 'Megascience', 'Efficiency', 'TrainTacular', 'Miners', 'Scientists', 'Trainers', 'Explorers', 'Blockmaster', 'Battle', 'Bloodlust', 'Bounty', 'Egg', 'Anger', 'Formations', 'Dominance', 'Barrier', 'UberHut', 'UberHouse', 'UberMansion', 'UberHotel', 'UberResort', 'Trapstorm', 'Gigastation', 'Shieldblock'];
var housingList = ['Hut', 'House', 'Mansion', 'Hotel', 'Resort', 'Gateway', 'Collector', 'Warpstation'];


////////////////////////////////////////
//Utility Functions/////////////////////
////////////////////////////////////////
//polyfill for includes function
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

//Loads the automation settings from browser cache
function loadPageVariables() {
    var tmp = JSON.parse(localStorage.getItem('autoTrimpSettings'));
    if (tmp !== null) {
        autoTrimpSettings = tmp;
    }
}

//Saves automation settings to browser cache
function saveSettings() {
    // debug('Saved');
    localStorage.setItem('autoTrimpSettings', JSON.stringify(autoTrimpSettings));
}

//Grabs the automation settings from the page

function getPageSetting(setting) {
    if (autoTrimpSettings.hasOwnProperty(setting) == false) {
        return false;
    }
    if (autoTrimpSettings[setting].type == 'boolean') {
        // debug('found a boolean');
        return autoTrimpSettings[setting].enabled;
    } else if (autoTrimpSettings[setting].type == 'value') {
        // debug('found a value');
        return parseFloat(autoTrimpSettings[setting].value);
    }
}

//Global debug message
function debug(message, lootIcon) {
    if (enableDebug){
        console.log(timeStamp() + ' ' + message);
        message2(message, "AutoTrimps", lootIcon);
    }
}

//Simply returns a formatted text timestamp
function timeStamp() {
    var now = new Date();

    // Create an array with the current hour, minute and second
    var time = [now.getHours(), now.getMinutes(), now.getSeconds()];

    // If seconds and minutes are less than 10, add a zero
    for (var i = 1; i < 3; i++) {
        if (time[i] < 10) {
            time[i] = "0" + time[i];
        }
    }
    return time.join(":");
}

function getPerSecBeforeManual(job) {
    var perSec = 0;
    if (game.jobs[job].owned > 0){
        perSec = (game.jobs[job].owned * game.jobs[job].modifier);
        if (game.portal.Motivation.level > 0) perSec += (perSec * game.portal.Motivation.level * game.portal.Motivation.modifier);
        if (game.portal.Motivation_II.level > 0) perSec *= (1 + (game.portal.Motivation_II.level * game.portal.Motivation_II.modifier));
        if (game.portal.Meditation.level > 0) perSec *= (1 + (game.portal.Meditation.getBonusPercent() * 0.01)).toFixed(2);
        if (game.global.challengeActive == "Meditate") perSec *= 1.25;
        else if (game.global.challengeActive == "Size") perSec *= 1.5;
        if (game.global.challengeActive == "Toxicity"){
            var toxMult = (game.challenges.Toxicity.lootMult * game.challenges.Toxicity.stacks) / 100;
            perSec *= (1 + toxMult);
        }
        if (game.global.challengeActive == "Balance"){
            perSec *= game.challenges.Balance.getGatherMult();
        }
        if (game.global.challengeActive == "Watch") perSec /= 2;
        if (game.global.challengeActive == "Lead" && ((game.global.world % 2) == 1)) perSec*= 2;
        perSec = calcHeirloomBonus("Staff", job + "Speed", perSec);
    }
    return perSec
}

//Called before buying things that can be purchased in bulk
function preBuy() {
    preBuyAmt = game.global.buyAmt;
    preBuyFiring = game.global.firing;
    preBuyTooltip = game.global.lockTooltip;
    preBuymaxSplit = game.global.maxSplit;
}

//Called after buying things that can be purchased in bulk
function postBuy() {
    game.global.buyAmt = preBuyAmt;
    game.global.firing = preBuyFiring;
    game.global.lockTooltip = preBuyTooltip;
    game.global.maxSplit = preBuymaxSplit;
}

function safeBuyBuilding(building) {
    //limit to 1 building per queue
    for (var b in game.global.buildingsQueue) {
        if (game.global.buildingsQueue[b].includes(building)) return false;
    }

    preBuy();
    game.global.buyAmt = 1;
    if (!canAffordBuilding(building)) {
        postBuy();
        return false;
    }
    game.global.firing = false;
    //avoid slow building from clamping
    //buy as many warpstations as we can afford
    if(building == 'Warpstation'){
        game.global.buyAmt = 'Max';
        game.global.maxSplit = 1;
        buyBuilding(building, true, true);
        debug('Building ' + game.global.buyAmt + ' ' + building + 's', '*rocket');
        return;
    }
    debug('Building ' + building, '*hammer2');
    buyBuilding(building, true, true);

    postBuy();
    return true;
}

//Outlines the most efficient housing based on gems (credits to Belaith)
function highlightHousing() {
    var oldBuy = game.global.buyAmt;
    game.global.buyAmt = 1;
    var allHousing = ["Mansion", "Hotel", "Resort", "Gateway", "Collector", "Warpstation"];
    var unlockedHousing = [];
    for (var house in allHousing) {
        if (game.buildings[allHousing[house]].locked === 0) {
            unlockedHousing.push(allHousing[house]);
        }
    }
    if (unlockedHousing.length) {
        var obj = {};
        for (var house in unlockedHousing) {
            var building = game.buildings[unlockedHousing[house]];
            var cost = 0;
            cost += getBuildingItemPrice(building, "gems", false, 1);
            var ratio = cost / building.increase.by;
            //don't consider Gateway if we can't afford it right now - hopefully to prevent game waiting for fragments to buy gateway when collector could be bought right now
            if(unlockedHousing[house] == "Gateway" && !canAffordBuilding('Gateway')) continue;
            obj[unlockedHousing[house]] = ratio;
            if (document.getElementById(unlockedHousing[house]).style.border = "1px solid #00CC00") {
                document.getElementById(unlockedHousing[house]).style.border = "1px solid #FFFFFF";
                // document.getElementById(unlockedHousing[house]).removeEventListener("click", update);
            }
        }
        var keysSorted = Object.keys(obj).sort(function(a, b) {
            return obj[a] - obj[b];
        });
        bestBuilding = null;
        //loop through the array and find the first one that isn't limited by max settings
        for (var best in keysSorted) {
            var max = getPageSetting('Max' + keysSorted[best]);
            if (max === false) max = -1;
            if (game.buildings[keysSorted[best]].owned < max || max == -1) {
                bestBuilding = keysSorted[best];
                
                //Warpstation Cap - if we are past the basewarp+deltagiga level, "cap" and just wait for next giga.
                //if ((getPageSetting('WarpstationCap') && bestBuilding == "Warpstation" &&
                //    (game.buildings.Warpstation.owned >= (Math.floor(game.upgrades.Gigastation.done * getPageSetting('DeltaGigastation')) + getPageSetting('FirstGigastation')))) ||
                //    ((new Date().getTime() - game.global.zoneStarted) / 1000 / 60) > 35)
                //        bestBuilding = null;
                //break;
                
                //Warpstation Wall - if we try to save to next prestige, allow only warps that cost allot less then current metal.
                if ((WarpstationWall == true && bestBuilding == "Warpstation") || (game.global.world == getPageSetting('VoidMaps') && 4 * getBuildingItemPrice(game.buildings.Warpstation, "metal", false, 1) > game.resources.metal.owned))

                //    (1.1 * getBuildingItemPrice(game.buildings.Warpstation, "metal", false, 1) > game.resources.metal.owned))
                        bestBuilding = null;
                
                break;
            }
        }
        if (bestBuilding) {
            document.getElementById(bestBuilding).style.border = "1px solid #00CC00";
        }
        // document.getElementById(bestBuilding).addEventListener('click', update, false);
    } else {
        bestBuilding = null;
    }
    game.global.buyAmt = oldBuy;
}

function buyFoodEfficientHousing() {
    // Push the limit auto change your max buildings settings
    autoTrimpSettings.MaxHut.value = 10+game.buildings.House.owned;
    autoTrimpSettings.MaxMansion.value = 20+game.buildings.House.owned;
    autoTrimpSettings.MaxHotel.value = 30+game.buildings.House.owned;
    autoTrimpSettings.MaxResort.value = 40+game.buildings.House.owned;
    autoTrimpSettings.MaxExplorers.value = 70+game.buildings.House.owned;
    var houseWorth = game.buildings.House.locked ? 0 : game.buildings.House.increase.by / getBuildingItemPrice(game.buildings.House, "food", false, 1);
    var hutWorth = game.buildings.Hut.increase.by / getBuildingItemPrice(game.buildings.Hut, "food", false, 1);
    var hutAtMax = (game.buildings.Hut.owned >= autoTrimpSettings.MaxHut.value && autoTrimpSettings.MaxHut.value != -1);
    //if hutworth is more, but huts are maxed , still buy up to house max
    if ((houseWorth > hutWorth || hutAtMax) && canAffordBuilding('House') &&
    	(getBuildingItemPrice(game.buildings.House, "food", false, 1) * 100) < game.resources.food.owned &&
    	 (game.buildings.House.owned < autoTrimpSettings.MaxHouse.value || autoTrimpSettings.MaxHouse.value == -1)) {
        safeBuyBuilding('House');
    } else {
        if (!hutAtMax) {
            safeBuyBuilding('Hut');
        }
    }
}

function safeBuyJob(jobTitle, amount) {
    if (amount === undefined) amount = 1;
    if (amount === 0) return false;
    preBuy();
    if (amount < 0) {
        amount = Math.abs(amount);
        game.global.firing = true;
        game.global.buyAmt = amount;
    } else{
        game.global.firing = false;
        game.global.buyAmt = amount;
        //if can afford, buy what we wanted,
        if (!canAffordJob(jobTitle, false)){
            game.global.buyAmt = 'Max'; //if we can't afford it, just use 'Max'. -it will always succeed-
            game.global.maxSplit = 1;
        }
    }   
    //debug((game.global.firing ? 'Firing ' : 'Hiring ') + game.global.buyAmt + ' ' + jobTitle + 's', "*users");
    buyJob(jobTitle, null, true);
    postBuy();
    return true;
}

function getScienceCostToUpgrade(upgrade) {
    var upgradeObj = game.upgrades[upgrade];
    if (upgradeObj.cost.resources.science !== undefined ? upgradeObj.cost.resources.science[0] !== undefined : false) {
        return Math.floor(upgradeObj.cost.resources.science[0] * Math.pow(upgradeObj.cost.resources.science[1], (upgradeObj.done)));
    } else {
        return 0;
    }
}

//OLD:
var worth = {'Shield': {}, 'Staff': {}};
function sortHeirlooms(){
    worth = {'Shield': {}, 'Staff': {}};
    for (var loom in game.global.heirloomsExtra) {
        var theLoom = game.global.heirloomsExtra[loom];
        worth[theLoom.type][loom] = theLoom.rarity;
    }

    //sort high to low value, priority on rarity, followed by mod evaluation
    for (var x in worth){
        worth[x] = Object.keys(worth[x]).sort(function(a, b) {
            if(worth[x][b] == worth[x][a]) {
                return evaluateMods(b, 'heirloomsExtra') - evaluateMods(a, 'heirloomsExtra');
            }
            else
                return worth[x][b] - worth[x][a];
        });
    }

}


//NEW:
var worth2 = {'Shield': [], 'Staff': []};
function sortHeirlooms2(){
    worth2 = {'Shield': [], 'Staff': []};
    for (var index in game.global.heirloomsExtra) {
        var theLoom = game.global.heirloomsExtra[index];
        var data = {'location': 'heirloomsExtra', 'index': index, 'rarity': theLoom.rarity, 'eff': evaluateMods(index, 'heirloomsExtra')};
        worth2[theLoom.type].push(data);
    }
    //sort algorithm: high to low value, priority on rarity, followed by mod evaluation
    var valuesort = function(a, b) {
        if(b.rarity == a.rarity) {
            return b.eff - a.eff;
        }
        else
            return b.rarity - a.rarity;
    };
    // sort shield 
    worth2['Shield'].sort(valuesort);
    // sort staff
    worth2['Staff'].sort(valuesort);
}

//NEW:
function autoHeirlooms2() {
    if(!heirloomsShown && game.global.heirloomsExtra.length > 0){
        //start by dropping ALL carried heirlooms
        var originalLength = game.global.heirloomsCarried.length;
        for(var index=0; index < originalLength; index++) {
            selectHeirloom(0, 'heirloomsCarried');
            stopCarryHeirloom();
        }
        //immediately begin carrying any protected heirlooms.
        for(var index in game.global.heirloomsExtra) {
            var theLoom = game.global.heirloomsExtra[index];
            if ((theLoom.protected) && (game.global.heirloomsCarried.length < game.global.maxCarriedHeirlooms)){
                selectHeirloom(index, 'heirloomsExtra');
                carryHeirloom();

            }
        }
        sortHeirlooms2();
        //now start by re-filling any empty carried slots with the most highly evaluated heirlooms
        while ((game.global.heirloomsCarried.length < game.global.maxCarriedHeirlooms) && game.global.heirloomsExtra.length > 0){
            //re-evaluate their worth (needed to refresh the worth array since we for sure re-arranged everything.)
            sortHeirlooms2();
            if (worth2["Shield"].length > 0){
                var carryshield = worth2["Shield"].shift();
                selectHeirloom(carryshield.index, 'heirloomsExtra');
                carryHeirloom();
            }
            sortHeirlooms2();
            if (worth2["Staff"].length > 0){
                var carrystaff = worth2["Staff"].shift();
                selectHeirloom(carrystaff.index, 'heirloomsExtra');
                carryHeirloom();
            }
        }
    }
    else if(heirloomsShown && game.global.selectedHeirloom.length > 0){
        heirloomUpgradeHighlighting();
    }
}

//common to both autoheirloom1 and 2
function heirloomUpgradeHighlighting() {
    var bestUpgrade;
    if(game.global.selectedHeirloom[1].includes('Equipped')) {
        var loom = game.global[game.global.selectedHeirloom[1]];
        bestUpgrade = evaluateMods(0, game.global.selectedHeirloom[1], true);
        if(bestUpgrade.index) {
            bestUpgrade.effect *= getModUpgradeCost(loom, bestUpgrade.index);
            bestUpgrade.effect = bestUpgrade.effect.toFixed(6);
            var styleIndex = 4 + (bestUpgrade.index * 3);
            //enclose in backtic ` for template string $ stuff
            document.getElementById('selectedHeirloom').childNodes[0].childNodes[styleIndex].style.backgroundColor = "lightblue";
            document.getElementById('selectedHeirloom').childNodes[0].childNodes[styleIndex].setAttribute("onmouseover", `tooltip(\'Heirloom\', \"customText\", event, \'<div class=\"selectedHeirloomItem heirloomRare${loom.rarity}\"> AutoTrimps recommended upgrade for this item. </div>\'         )`);
            document.getElementById('selectedHeirloom').childNodes[0].childNodes[styleIndex].setAttribute("onmouseout", 'tooltip(\'hide\')');
            //lightblue = greyish
            //swapClass("tooltipExtra", "tooltipExtraHeirloom", document.getElementById("tooltipDiv"));
            //document.getElementById("tooltipDiv");
        }
    }   
}

//Automatically evaluate and carry the best heirlooms, and recommend upgrades for equipped items. AutoHeirlooms will only change carried items when the heirlooms window is not open. Carried items will be compared and swapped with the types that are already carried. If a carry spot is empty, it will be filled with the best shield (if available). Evaluation is based ONLY on the following mods (listed in order of priority, high to low): Void Map Drop Chance/Trimp Attack, Crit Chance/Crit Damage, Miner Efficiency/Metal Drop, Gem Drop/Dragimp Efficiency, Farmer/Lumberjack Efficiency. For the purposes of carrying, rarity trumps all of the stat evaluations. Empty mod slots are valued at the average value of the best missing mod.
//OLD:
function autoHeirlooms() {

    if(!heirloomsShown && game.global.heirloomsExtra.length > 0){
        //start by immediately carrying any protected heirlooms.
        for(var extra in game.global.heirloomsExtra) {
            var theLoom = game.global.heirloomsExtra[extra];
            if ((theLoom.protected) && (game.global.heirloomsCarried.length < game.global.maxCarriedHeirlooms)){
                selectHeirloom(extra, 'heirloomsExtra');
                carryHeirloom();
            }
        }
        //re-evaluate their worth (needed to refresh the worth array since we possibly moved the extras)
        sortHeirlooms();        
        for(var carried in game.global.heirloomsCarried) {
            var theLoom = game.global.heirloomsCarried[carried];
            if(worth[theLoom.type].length == 0) continue;
            var index = worth[theLoom.type][0];
            if(theLoom.rarity < game.global.heirloomsExtra[index].rarity || (theLoom.rarity == game.global.heirloomsExtra[index].rarity && evaluateMods(carried, 'heirloomsCarried') < evaluateMods(index, 'heirloomsExtra'))) {
                if (!theLoom.protected){
                    selectHeirloom(carried, 'heirloomsCarried');
                    stopCarryHeirloom();
                    selectHeirloom(index, 'heirloomsExtra');
                    carryHeirloom();
                    sortHeirlooms();
                }
            }
        }
        if (game.global.heirloomsCarried.length < game.global.maxCarriedHeirlooms){
            if(worth.Shield.length > 0)
                selectHeirloom(worth.Shield[0], 'heirloomsExtra');
            else if(worth.Staff.length > 0)
                selectHeirloom(worth.Staff[0], 'heirloomsExtra');
            carryHeirloom();
        }
    }
    else if(heirloomsShown && game.global.selectedHeirloom.length > 0){
        heirloomUpgradeHighlighting();
    }
}

//commented out because it was never finished.
/*
function autoSwapHeirlooms(loomtype="Shield" || "Staff", loomlocation="heirloomsCarried" || "heirloomsExtra"){
    var bestfooddroploom = [];
    var bestwooddroploom = [];
    var bestmetaldroploom = [];
    var bestgemdroploom = [];
    
    //search in loomlocation="heirloomsCarried" or "heirloomsExtra"
    for(var eachloom in game.global[loomlocation]) {
        var theLoom = game.global[loomlocation][eachloom];
        if (theLoom.type != loomtype)
            continue;
        var effRating = evaluateMods(eachloom,loomlocation);
    } 
    if(loomlocation.includes('Equipped'))
        loom = game.global[loomlocation];
    else
        loom = game.global[loomlocation][loom];
    
    //---------- SHIELD SWAP FUNCTION (search on critdamage and swap)---
    var count = 0;
    for (var carried in game.global.heirloomsCarried){
        var heirloom = game.global.heirloomsCarried[carried];
        for (var item in heirloom.mods){
            if (item[0] == "critDamage" && item[1] > 300){
                unequipHeirloom(game.global.ShieldEquipped, "heirloomsCarried");
                game.global.ShieldEquipped = heirloom;
                game.global.heirloomsCarried.splice(count, 1);
            }
        }
        count++;
    }
    for (var item in heirloom.mods){
        game.heirlooms[heirloom.type][heirloom.mods[item][0]].currentBonus += heirloom.mods[item][1];
    }
    populateHeirloomWindow();    
    //-------OK------
}
*/


//Determines the best heirloom mods
function evaluateMods(loom, location, upgrade) {
    var index = loom;
    var bestUpgrade = {
        'index': null,
        'name': '',
        'effect': 0
    };
    var tempEff;
    var steps;
    if(location.includes('Equipped'))
        loom = game.global[location];
    else
        loom = game.global[location][loom];
    //  return loom.rarity;
    var eff = 0;
    for(var m in loom.mods) {
        var critmult = getPlayerCritDamageMult();
        var critchance = getPlayerCritChance();
        switch(loom.mods[m][0]) {
            case 'critChance': 
                tempEff = ((loom.mods[m][1]/100) * (critmult - game.heirlooms.Shield.critDamage.currentBonus/100))/((critchance - game.heirlooms.Shield.critChance.currentBonus/100) * (critmult - game.heirlooms.Shield.critDamage.currentBonus/100) + 1 - (critchance - game.heirlooms.Shield.critChance.currentBonus/100));
                eff += tempEff;
                if(upgrade){
                    if(loom.mods[m][1] >= 30) break;
                    steps = game.heirlooms.Shield.critChance.steps[loom.rarity];
                    tempEff = (steps[2]/100 * critmult)/((critchance * critmult) + 1 - critchance);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'critChance';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'critDamage':
                tempEff = ((loom.mods[m][1]/100) * (critchance - game.heirlooms.Shield.critChance.currentBonus/100))/((critmult - game.heirlooms.Shield.critDamage.currentBonus/100) * (critchance - game.heirlooms.Shield.critChance.currentBonus/100) + 1 - (critchance - game.heirlooms.Shield.critChance.currentBonus/100));
                eff += tempEff;
                if(upgrade){
                    steps = game.heirlooms.Shield.critDamage.steps[loom.rarity];
                    tempEff = (critchance * (steps[2]/100))/((critmult * critchance) + 1 - critchance);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'critDamage';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'trimpAttack':
                tempEff = loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade){
                    steps = game.heirlooms.Shield.trimpAttack.steps[loom.rarity];
                    tempEff = (steps[2]/100)/((game.heirlooms.Shield.trimpAttack.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'trimpAttack';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'voidMaps':
                tempEff = loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade){
                    steps = game.heirlooms.Shield.voidMaps.steps[loom.rarity];
                    tempEff = (steps[2]/100)/((game.heirlooms.Shield.voidMaps.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'voidMaps';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'MinerSpeed':
                tempEff = 0.75*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.75*steps[2]/100)/((game.heirlooms.Staff.MinerSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'MinerSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'metalDrop':
                tempEff = 0.75*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.75*steps[2]/100)/((game.heirlooms.Staff.metalDrop.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'metalDrop';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'gemsDrop':
                tempEff = 0.75*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.75*steps[2]/100)/((game.heirlooms.Staff.gemsDrop.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'gemsDrop';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'FarmerSpeed':
                tempEff = 0.5*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.5*steps[2]/100)/((game.heirlooms.Staff.FarmerSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'FarmerSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'LumberjackSpeed':
                tempEff = 0.5*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.5*steps[2]/100)/((game.heirlooms.Staff.LumberjackSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'LumberjackSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'DragimpSpeed':
                tempEff = 0.75*loom.mods[m][1]/100;
                eff += tempEff;
                if(upgrade) {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    tempEff = (0.5*steps[2]/100)/((game.heirlooms.Staff.DragimpSpeed.currentBonus/100) + 1);
                    tempEff = tempEff / getModUpgradeCost(loom, m);
                    if(tempEff > bestUpgrade.effect) {
                        bestUpgrade.effect = tempEff;
                        bestUpgrade.name = 'DragimpSpeed';
                        bestUpgrade.index = m;
                    }
                }
                break;
            case 'empty':
                var av;
                //some other function?
                if(upgrade) break;
                //value empty mod as the average of the best mod it doesn't have. If it has all good mods, empty slot has no value
                if(loom.type == 'Shield') {
                    if(!checkForMod('trimpAttack', index, location)){
                        steps = game.heirlooms.Shield.trimpAttack.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = av/100;
                        eff += tempEff;
                    }
                    else if(!checkForMod('voidMaps', index, location)){
                        steps = game.heirlooms.Shield.voidMaps.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = (steps[2]/100);
                        eff += tempEff;
                    }
                    else if(!checkForMod('critChance', index, location)){
                        steps = game.heirlooms.Shield.critChance.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = (av * (critmult - game.heirlooms.Shield.critDamage.currentBonus/100))/((critchance - game.heirlooms.Shield.critChance.currentBonus/100) * (critmult - game.heirlooms.Shield.critDamage.currentBonus/100) + 1 - (critchance - game.heirlooms.Shield.critChance.currentBonus/100));
                        eff += tempEff;
                    }
                    else if(!checkForMod('critDamage', index, location)){
                        steps = game.heirlooms.Shield.critDamage.steps[loom.rarity];
                        av = steps[0] + ((steps[1] - steps[0])/2);
                        tempEff = (av * (critchance - game.heirlooms.Shield.critChance.currentBonus/100))/((critmult - game.heirlooms.Shield.critDamage.currentBonus/100) * (critchance - game.heirlooms.Shield.critChance.currentBonus/100) + 1 - (critchance - game.heirlooms.Shield.critChance.currentBonus/100));
                        eff += tempEff;
                    }
                }
                if(loom.type == 'Staff') {
                    steps = game.heirlooms.defaultSteps[loom.rarity];
                    av = steps[0] + ((steps[1] - steps[0])/2);
                    if(!checkForMod('MinerSpeed', index, location) || !checkForMod('metalDrop', index, location)){
                        eff += 0.75*av/100;
                    }
                    else if(!checkForMod('LumberjackSpeed', index, location) || !checkForMod('FarmerSpeed', index, location) || !checkForMod('DragimpSpeed', index, location)){
                        eff += 0.5*av/100;  
                    }
                }
                break;
                //trimpHealth?
        }
    }
    if(upgrade) return bestUpgrade;
    return eff;
}

//Heirloom helper function
function checkForMod(what, loom, location){
    var heirloom = game.global[location][loom];
    for (var mod in heirloom.mods){
        if (heirloom.mods[mod][0] == what) return true;
    }
    return false;
}

//back end function for autoLevelEquipment to determine most cost efficient items, and what color they should be.
function evaluateEfficiency(equipName) {
    var equip = equipmentList[equipName];
    var gameResource = equip.Equip ? game.equipment[equipName] : game.buildings[equipName];
    if (equipName == 'Shield') {
        if (gameResource.blockNow) {
            equip.Stat = 'block';
        } else {
            equip.Stat = 'health';
        }
    }
    var Eff = Effect(gameResource, equip);
    var Cos = Cost(gameResource, equip);
    var Res = Eff / Cos;
    var Status = 'white';
    var Wall = false;

    //white - Upgrade is not available
    //yellow - Upgrade is not affordable
    //orange - Upgrade is affordable, but will lower stats
    //red - Yes, do it now!
    if (!game.upgrades[equip.Upgrade].locked) {
        //Evaluating upgrade!
        var CanAfford = canAffordTwoLevel(game.upgrades[equip.Upgrade]);
        if (equip.Equip) {
            var NextEff = PrestigeValue(equip.Upgrade);
            //Scientist 3 and 4 challenge: set metalcost to Infinity so it can buy equipment levels without waiting for prestige. (fake the impossible science cost)
            if (game.global.challengeActive == "Scientist" && getScientistLevel() > 2)
                var NextCost =  Infinity;
            else
                var NextCost = getNextPrestigeCost(equip.Upgrade) * Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level);
            Wall = (NextEff / NextCost > Res);
        }

        if (!CanAfford) {
            Status = 'yellow';
        } else {
            if (!equip.Equip) {
                //Gymystic is always cool, fuck shield - lol
                Status = 'red';
            } else {
                var CurrEff = gameResource.level * Eff;

                var NeedLevel = Math.ceil(CurrEff / NextEff);
                var Ratio = gameResource.cost[equip.Resource][1];

                var NeedResource = NextCost * (Math.pow(Ratio, NeedLevel) - 1) / (Ratio - 1);

                if (game.resources[equip.Resource].owned > NeedResource) {
                    Status = 'red';
                } else {
                    Status = 'orange';
                }
            }
        }
    }
    //wall (don't buy any more equipment, buy prestige first) is true if the limit equipment option is on and we are past our limit 
    //res = 0 sets the efficiency to 0 so that it will be disregarded. if not, efficiency will still be somenumber that is cheaper, 
    //      and the algorithm will get stuck on whatever equipment we have capped, and not buy other equipment.
    if (gameResource.level > 10 - gameResource.prestige && getPageSetting('LimitEquipment')) {
        Res = 0;
        Wall = true;
    }
    if (gameResource.level >= 10 && getPageSetting('CapEquip')) {
        Res = 0;
        Wall = true;
    }
    if (game.global.world >= 58 && game.global.world < 60 && getPageSetting('WaitTill60')){
        Wall = true;
    }
    if (gameResource.level < 2 && equip.Stat == 'health' && getPageSetting('AlwaysArmorLvl2')){
        Res = 9999 - gameResource.prestige;
    }
    //manage prestige
    if (equip.Stat == 'attack') {
    WarpstationWall = false;
    }
    if (10*Cos > NextCost && equip.Stat == 'attack' && game.global.world > 37) {
        Wall = true;
    }

    if ((gameResource.prestige < ((game.global.world-10)/5)+2 && gameResource.level > 2) && (equip.Stat == 'attack') && game.global.world > 37) {
        Res = 0;
        Wall = true;
    }

    if (gameResource.prestige+1 < ((game.global.world-10)/5)+2 && gameResource.level > 0 && game.global.world > 37) {
        Res = 0;
        Wall = true;
    }
    if (gameResource.level > 11 && game.global.world != 200 && game.global.world > 37 && (4 * Cos) > game.resources.metal.owned ) {
        Res = 0;
        Wall = true;
    }

    return {
        Stat: equip.Stat,
        Factor: Res,
        Status: Status,
        Wall: Wall
    };
}

//Returns the amount of stats that the equipment (or gym) will give when bought.
function Effect(gameResource, equip) {
    if (equip.Equip) {
        return gameResource[equip.Stat + 'Calculated'];
    } else {
        //That be Gym
        var oldBlock = gameResource.increase.by * gameResource.owned;
        var Mod = game.upgrades.Gymystic.done ? (game.upgrades.Gymystic.modifier + (0.01 * (game.upgrades.Gymystic.done - 1))) : 1;
        var newBlock = gameResource.increase.by * (gameResource.owned + 1) * Mod;
        return newBlock - oldBlock;
    }
}

//Returns the cost after Artisanistry of a piece of equipment.
function Cost(gameResource, equip) {
    preBuy();
    game.global.buyAmt = 1;
    var price = parseFloat(getBuildingItemPrice(gameResource, equip.Resource, equip.Equip, 1));
    if (equip.Equip) price = Math.ceil(price * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
    postBuy();
    return price;
}

//Returns the amount of stats that the prestige will give when bought.
function PrestigeValue(what) {
    var name = game.upgrades[what].prestiges;
    var equipment = game.equipment[name];
    var stat;
    if (equipment.blockNow) stat = "block";
    else stat = (typeof equipment.health !== 'undefined') ? "health" : "attack";
    var toReturn = Math.round(equipment[stat] * Math.pow(1.19, ((equipment.prestige) * game.global.prestige[stat]) + 1));
    return toReturn;
}

function setScienceNeeded() {
    scienceNeeded = 0;
    for (var upgrade in upgradeList) {
        upgrade = upgradeList[upgrade];
        if (game.upgrades[upgrade].allowed > game.upgrades[upgrade].done) { //If the upgrade is available
            scienceNeeded += getScienceCostToUpgrade(upgrade);
        }
    }
}


function getEnemyMaxAttack(world, level, name, diff) {
    var amt = 0;
    var adjWorld = ((world - 1) * 100) + level;
    amt += 50 * Math.sqrt(world * Math.pow(3.27, world));
    amt -= 10;
    if (world == 1){
        amt *= 0.35;
        amt = (amt * 0.20) + ((amt * 0.75) * (level / 100));
    }
    else if (world == 2){
        amt *= 0.5;
        amt = (amt * 0.32) + ((amt * 0.68) * (level / 100));
    }
    else if (world < 60)
        amt = (amt * 0.375) + ((amt * 0.7) * (level / 100));
    else{ 
        amt = (amt * 0.4) + ((amt * 0.9) * (level / 100));
        amt *= Math.pow(1.15, world - 59);
    }   
            
    if (diff) { 
        amt *= 1.1;
        amt *= diff;
    }
    amt *= game.badGuys[name].attack;
    return Math.floor(amt);
}

function getEnemyMaxHealth(zone) {
    var amt = 0;
    var level = 30;
    var world = zone;
    amt += 130 * Math.sqrt(world * Math.pow(3.265, world));
    amt -= 110;
    if (world == 1 || world == 2 && level < 10) {
        amt *= 0.6;
        amt = (amt * 0.25) + ((amt * 0.72) * (level / 100));
    } else if (world < 60) {
        amt = (amt * 0.4) + ((amt * 0.4) * (level / 110));
    } else {
        amt = (amt * 0.5) + ((amt * 0.8) * (level / 100));
        amt *= Math.pow(1.1, world - 59);
    }
    amt *= 1.1;
    amt *= game.badGuys["Grimp"].health;
    amt *= 0.84;
    return Math.floor(amt);
}

function getBreedTime(remaining,round) {
    var trimps = game.resources.trimps;
    var breeding = trimps.owned - trimps.employed;
    var trimpsMax = trimps.realMax();

    var potencyMod = trimps.potency;
    //Broken Planet
    if (game.global.brokenPlanet) potencyMod /= 10;
    //Pheromones
    potencyMod *= 1+ (game.portal.Pheromones.level * game.portal.Pheromones.modifier);
    //Geneticist
    if (game.jobs.Geneticist.owned > 0) potencyMod *= Math.pow(.98, game.jobs.Geneticist.owned);
    //Quick Trimps
    if (game.unlocks.quickTrimps) potencyMod *= 2;
    if (game.global.challengeActive == "Toxicity" && game.challenges.Toxicity.stacks > 0){
        potencyMod *= Math.pow(game.challenges.Toxicity.stackMult, game.challenges.Toxicity.stacks);
    }
    if (game.global.voidBuff == "slowBreed"){
        potencyMod *= 0.2;

    }

    potencyMod = calcHeirloomBonus("Shield", "breedSpeed", potencyMod);
    breeding = breeding * potencyMod;
    updatePs(breeding, true);
    potencyMod = (1 + (potencyMod / 10));
    var timeRemaining = log10((trimpsMax - trimps.employed) / (trimps.owned - trimps.employed)) / log10(potencyMod);
    timeRemaining /= 10;
    if (remaining)
        return parseFloat(timeRemaining.toFixed(1));


    var fullBreed = 0;
    var adjustedMax = (game.portal.Coordinated.level) ? game.portal.Coordinated.currentSend : trimps.maxSoldiers;
    var totalTime = log10((trimpsMax - trimps.employed) / (trimpsMax - adjustedMax - trimps.employed)) / log10(potencyMod);

    totalTime /= 10;

    return parseFloat(totalTime.toFixed(1));
}


////////////////////////////////////////
//Main Functions////////////////////////
////////////////////////////////////////

function initializeAutoTrimps() {
    debug('AutoTrimps Loaded!', '*spinner3');
    loadPageVariables();

    var atscript = document.getElementById('AutoTrimps-script')
      , base = 'https://genbtc.github.io/AutoTrimps'
      ;
    if (atscript !== null) {
        base = atscript.getAttribute('src').replace(/\/AutoTrimps2\.js$/, '');
    }
    document.head.appendChild(document.createElement('script')).src = base + '/NewUI.js';
    document.head.appendChild(document.createElement('script')).src = base + '/Graphs.js';
    toggleSettingsMenu();
    toggleSettingsMenu();
}

function easyMode() {
    if (game.resources.trimps.realMax() > 50000000) {
        autoTrimpSettings.MaxHouse.value = (game.global.world * 2);
        if (game.global.turkimpTimer > 0 && getBuildingItemPrice(game.buildings.Warpstation, "gems", false, 1) > game.resources.gems.owned) {
        autoTrimpSettings.MaxTrainers.value = game.buildings.Tribute.owned/2.1;
        autoTrimpSettings.FarmerRatio.value = '60';
        autoTrimpSettings.LumberjackRatio.value = '5';
        autoTrimpSettings.MinerRatio.value = '5';
        }else if (game.buildings.Tribute.owned < 1100) {
        autoTrimpSettings.MaxTrainers.value = game.buildings.Tribute.owned/2.1;
        autoTrimpSettings.MaxGateway.value = 50;
        autoTrimpSettings.FarmerRatio.value = '10';
        autoTrimpSettings.LumberjackRatio.value = '2';
        autoTrimpSettings.MinerRatio.value = '20';
        } else if (game.buildings.Tribute.owned < 2000 && game.buildings.Tribute.owned >= 1100) {
        autoTrimpSettings.FarmerRatio.value = '5';
        autoTrimpSettings.LumberjackRatio.value = '2';
        autoTrimpSettings.MinerRatio.value = '40';
        } else if (game.global.world < 200) {
        autoTrimpSettings.MaxTrainers.value = -1;
        autoTrimpSettings.FarmerRatio.value = '1';
        autoTrimpSettings.LumberjackRatio.value = '40';
        autoTrimpSettings.MinerRatio.value = '60';
        } else if (game.global.world == 200) {
        autoTrimpSettings.MaxTrainers.value = -1;
        autoTrimpSettings.FarmerRatio.value = '1';
        autoTrimpSettings.LumberjackRatio.value = '80';
        autoTrimpSettings.MinerRatio.value = '20';
        } else {
        autoTrimpSettings.MaxTrainers.value = -1;
        autoTrimpSettings.FarmerRatio.value = '4';
        autoTrimpSettings.LumberjackRatio.value = '1';
        autoTrimpSettings.MinerRatio.value = '80';
        }
        
        //save some wood
        //if (getBuildingItemPrice(game.buildings.Gym, "wood", false, 1) > 100*getBuildingItemPrice(game.buildings.Nursery, "wood", false, 1)) {
        //    autoTrimpSettings.MaxNursery.value = -1;
        //} else {
        //    autoTrimpSettings.MaxNursery.value = 600;
        //}
    } else if (game.resources.trimps.realMax() > 500000) {
        if (getBuildingItemPrice(game.buildings.House, "food", false, 1) * 10 < game.jobs.Trainer.cost.food[0]*Math.pow(game.jobs.Trainer.cost.food[1],game.jobs.Trainer.owned)) {
    	    	autoTrimpSettings.MaxHouse.value = 100;
    	}
    	//autoTrimpSettings.DeltaGigastation.value = 50;
    	//autoTrimpSettings.FirstGigastation.value = 50;
    	autoTrimpSettings.MaxTrainers.value = 150;
        autoTrimpSettings.FarmerRatio.value = '40';
        autoTrimpSettings.LumberjackRatio.value = '10';
        autoTrimpSettings.MinerRatio.value = '10';

    } else {
        autoTrimpSettings.MaxHouse.value = 50;
    	autoTrimpSettings.MaxGateway.value = 30;
        autoTrimpSettings.FarmerRatio.value = '40';
        autoTrimpSettings.LumberjackRatio.value = '10';
        autoTrimpSettings.MinerRatio.value = '1';
    }
}

//Buys all available non-equip upgrades listed in var upgradeList
function buyUpgrades() {
    for (var upgrade in upgradeList) {
        upgrade = upgradeList[upgrade];
        var gameUpgrade = game.upgrades[upgrade];
        var available = (gameUpgrade.allowed > gameUpgrade.done && canAffordTwoLevel(gameUpgrade));
            if (upgrade == 'Gigastation' && game.global.world >= getPageSetting('VoidMaps')) {
            buyUpgrade('Gigastation', true, true);
        }
        if (upgrade == 'Coordination' && !canAffordCoordinationTrimps()) continue;
        if (upgrade == 'Shieldblock' && !getPageSetting('BuyShieldblock')) continue;
        if (upgrade == 'Gigastation' && (game.global.lastWarp ? game.buildings.Warpstation.owned < (game.global.lastWarp + getPageSetting('DeltaGigastation') + 8 - gameUpgrade.allowed + gameUpgrade.done) : game.buildings.Warpstation.owned < getPageSetting('FirstGigastation'))) continue;
        if ((!game.upgrades.Scientists.done && upgrade != 'Battle') ? (available && upgrade == 'Scientists' && game.upgrades.Scientists.allowed) : (available)) {
            buyUpgrade(upgrade, true, true);
            if(upgrade == 'Coordination') newCoord = true;
            //debug('bought upgrade ' + upgrade);
        }
    }
}

//Buys more storage if resource is over 85% full (or 60% if zone<10)
function buyStorage() {
    var packMod = 1 + game.portal.Packrat.level * game.portal.Packrat.modifier;
    var Bs = {
        'Barn': 'food',
        'Shed': 'wood',
        'Forge': 'metal'
    };
    for (var B in Bs) {
        var jest = 0;
        var owned = game.resources[Bs[B]].owned;
        var max = game.resources[Bs[B]].max * packMod;
        max = calcHeirloomBonus("Shield", "storageSize", max);
        if(game.global.mapsActive && game.unlocks.imps.Jestimp) {
            jest = simpleSeconds(Bs[B], 45);
            jest = scaleToCurrentMap(jest);
        }
        if ((game.global.world < 10 && owned > max * 0.1) || owned > max * 0.6 || owned + jest > max * 0.6) {
            // debug('Buying ' + B + '(' + Bs[B] + ') at ' + Math.floor(game.resources[Bs[B]].owned / (game.resources[Bs[B]].max * packMod * 0.99) * 100) + '%');
        }
        if (canAffordBuilding(B)) {
            safeBuyBuilding(B);

        }
        if (getPageSetting('ManualGather')) {
            setGather('buildings');
        }

        if (game.global.world > 35) {
            autoTrimpSettings.MaxGateway.value = 0.8 * game.global.world;
        }

	//old way to calculate Giga/Delta
        //if (game.global.world < Math.floor((getPageSetting('VoidMaps')/2.45))) {
        //   autoTrimpSettings.DeltaGigastation.value = 50;
        //   autoTrimpSettings.FirstGigastation.value = 50;
        //}
        //to use on spire for giga delta calculations
        //if (game.global.world < 201) {
        //    autoTrimpSettings.VoidMaps.value = 215;
        //}
        //if (game.global.world >= 201) {
        //    autoTrimpSettings.VoidMaps.value = 205;
        //}
        //if (game.global.world == Math.floor((getPageSetting('VoidMaps')/2.45)) && game.global.lastClearedCell == 1 ) {
        //   LetItGo = game.buildings.Warpstation.owned;
        //}
        //if (game.global.world == Math.floor((getPageSetting('VoidMaps')/2.45)) && game.global.lastClearedCell > 2 ) {
        //   autoTrimpSettings.FirstGigastation.value = LetItGo;
        //}
        //if (getPageSetting('VoidMaps')<60) {
        //   Gigas=0;
        //}
        //if (getPageSetting('VoidMaps')<70) {
        //   Gigas=getPageSetting('VoidMaps')-60;
        //}
        //if (getPageSetting('VoidMaps')<80) {
        //  Gigas=9+(Math.ceil((getPageSetting('VoidMaps')-69)/2));
        //}
        //if (getPageSetting('VoidMaps')<93) {
        //  Gigas=14+(Math.round((getPageSetting('VoidMaps')-79)/3));
        //}
        //if (getPageSetting('VoidMaps')<170) {
        //  Gigas=18+(Math.round((getPageSetting('VoidMaps')-92)/5));
        //}
        //if (getPageSetting('VoidMaps')>170) {
        //  Gigas=34+(Math.floor((getPageSetting('VoidMaps')-170)/10));
        //}
        //Delta push logic range is 1/10,000 just in case its a slow run in any case so larger giga wont hurt,
        //to 10/10,000 that means a huge giga that maybe can be used in Max Tox runs
        //var DeltaPush = 5/10000
        //if (game.global.world >= Math.floor((getPageSetting('VoidMaps')/2.45))) {
        //autoTrimpSettings.DeltaGigastation.value = ((Gigas*(1.5+((getPageSetting('VoidMaps')-80)*(0.031+(DeltaPush)))))-autoTrimpSettings.FirstGigastation.value)/Gigas;
        //}
       //if (game.global.world == 89 && game.global.lastClearedCell == 1 ) {
       //    LetItGo = game.buildings.Warpstation.owned;
       //}
       //if (game.global.world == 89 && game.global.lastClearedCell > 2 ) {
        //   autoTrimpSettings.DeltaGigastation.value = LetItGo-autoTrimpSettings.FirstGigastation.value;
       //}
       //var list = [61,62,63,64,65,66,67,68,69,70,72,74,76,78,81,84,87,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,190,200,210,220,230,240,250,260,270,280,290,300];



       
        //Prestige list:
        //2'Dagger''Dagadder',4'Mace''Megamace',6'Polearm''Polierarm',8'Battleaxe''Axeidic',10'Greatsword''Greatersword',
        //3'Boots''Bootboost',5'Helmet''Hellishmet',7'Pants''Pantastic',9'Shoulderguards''Smoldershoulder',10'Breastplate''Bestplate',
        //11'Arbalest''Harmbalest',12'Gambeson''GambesOP',
        //1'Shield''Supershield',

	//get daggers at the right levels from level 40 (nullmaps takes care to the early levels), after level 70 get the daggers later to get more metal and actually buy it, and Off prestige after Spire, to let nullmaps manage it from there.
	if (game.global.world < 200 && game.global.world > 40 && ((game.global.world >= 41 && game.global.world <= 50) || (game.global.world >= 51 && game.global.world <= 60) || (game.global.world >= 65 && game.global.world <= 70))) {
           document.getElementById('Prestige').selectedIndex = 2;
           autoTrimpSettings.Prestige.selected = "Dagadder";
	} else if (game.global.world < 200 && game.global.world > 40 && ((game.global.world >= 76 && game.global.world <= 80) || (game.global.world >= 88 && game.global.world <= 90) || (game.global.world >= 98 && game.global.world <= 100) || (game.global.world >= 108 && game.global.world <= 110) || (game.global.world >= 118 && game.global.world <= 120) || (game.global.world >= 128 && game.global.world <= 130) || (game.global.world >= 138 && game.global.world <= 140) || (game.global.world >= 148 && game.global.world <= 150) || (game.global.world >= 158 && game.global.world <= 160) || (game.global.world >= 168 && game.global.world <= 170) || (game.global.world >= 177 && game.global.world <= 180) || (game.global.world >= 186 && game.global.world <= 190) || (game.global.world == 199))) {
           document.getElementById('Prestige').selectedIndex = 1;
           autoTrimpSettings.Prestige.selected = "Supershield";

	} else {
           document.getElementById('Prestige').selectedIndex = 0;
           autoTrimpSettings.Prestige.selected = "Off";
        }


    }
}

//Buy all non-storage buildings
function buyBuildings() {
    if((game.jobs.Miner.locked && game.global.challengeActive != 'Metal') || (game.jobs.Scientist.locked && game.global.challengeActive != "Scientist"))
        return;
    highlightHousing();

    //if housing is highlighted
    if (bestBuilding !== null) {
        //insert gigastation logic here ###############
        if (!safeBuyBuilding(bestBuilding)) {
            buyFoodEfficientHousing();
        }
    } else {
        buyFoodEfficientHousing();
    }
    
    if(getPageSetting('MaxWormhole') > 0 && game.buildings.Wormhole.owned < getPageSetting('MaxWormhole') && !game.buildings.Wormhole.locked) safeBuyBuilding('Wormhole');

    //Buy non-housing buildings
    if (!game.buildings.Gym.locked && (getPageSetting('MaxGym') > game.buildings.Gym.owned || getPageSetting('MaxGym') == -1) && game.global.world != 200) {
        safeBuyBuilding('Gym');
    }
    if (!game.buildings.Tribute.locked && (getPageSetting('MaxTribute') > game.buildings.Tribute.owned || getPageSetting('MaxTribute') == -1)) {
        safeBuyBuilding('Tribute');
    }
    var targetBreed = parseInt(getPageSetting('GeneticistTimer'));
    //only buy nurseries if enabled,   and we need to lower our breed time, or our target breed time is 0, or we aren't trying to manage our breed time before geneticists, and they aren't locked
    //even if we are trying to manage breed timer pre-geneticists, start buying nurseries once geneticists are unlocked AS LONG AS we can afford a geneticist (to prevent nurseries from outpacing geneticists soon after they are unlocked)
    if ((targetBreed < getBreedTime() || targetBreed == 0 || !getPageSetting('ManageBreedtimer') || 
        (targetBreed < getBreedTime(true) && game.global.challengeActive == 'Watch') ||
        (!game.jobs.Geneticist.locked && canAffordJob('Geneticist', false))) && !game.buildings.Nursery.locked) 
    {
        if ((getPageSetting('MaxNursery') > game.buildings.Nursery.owned || getPageSetting('MaxNursery') == -1) && game.buildings.Tribute.owned < 2100 && 
            (getBuildingItemPrice(game.buildings.Nursery, "gems", false, 1) < 0.05 * getBuildingItemPrice(game.buildings.Warpstation, "gems", false, 1) || game.buildings.Warpstation.locked) && 
            (getBuildingItemPrice(game.buildings.Nursery, "gems", false, 1) < 0.05 * getBuildingItemPrice(game.buildings.Collector, "gems", false, 1) || game.buildings.Collector.locked || !game.buildings.Warpstation.locked))
        {
            safeBuyBuilding('Nursery');
        } else if ((getPageSetting('MaxNursery') > game.buildings.Nursery.owned || getPageSetting('MaxNursery') == -1) && game.buildings.Tribute.owned > 2100) {
            safeBuyBuilding('Nursery');
            safeBuyBuilding('Collector');
        } else if (game.buildings.Tribute.owned > 1400) {
            safeBuyBuilding('Collector');
        }
    }
}

function setTitle() {
    document.title = '(' + game.global.world + ')' + ' Trimps ' + document.getElementById('versionNumber').innerHTML;
    //for the dummies like me who always forget to turn automaps back on after portaling
    if(getPageSetting('RunUniqueMaps') && !game.upgrades.Battle.done && autoTrimpSettings.RunMapsWhenStuck.enabled == false) {
        settingChanged("RunMapsWhenStuck");
    }
}

function buyJobs() {

    var freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    var trimps = game.resources.trimps;
    var totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;    

    var farmerRatio = parseInt(getPageSetting('FarmerRatio'));
    var lumberjackRatio = parseInt(getPageSetting('LumberjackRatio'));
    var minerRatio = parseInt(getPageSetting('MinerRatio'));
    var totalRatio = farmerRatio + lumberjackRatio + minerRatio;
    var scientistRatio = totalRatio / 25;
    
    //solve late game scientists
    if (game.global.world > 150) {
        scientistRatio = totalRatio / 75;
    }
    if (game.global.world > 180) {
        scientistRatio = totalRatio / 9999;
    }


    
    if (game.global.challengeActive == 'Watch'){
        scientistRatio = totalRatio / 10;
        stopScientistsatFarmers = 1e8;
        if (game.resources.trimps.owned < game.resources.trimps.realMax() * 0.9 && !breedFire){
            //so the game buys scientists first while we sit around waiting for breed timer.
            var buyScientists = Math.floor((scientistRatio / totalRatio * totalDistributableWorkers) - game.jobs.Scientist.owned);
            if (game.jobs.Scientist.owned < buyScientists && game.resources.trimps.owned > game.resources.trimps.realMax() * 0.1){
                var toBuy = buyScientists-game.jobs.Scientist.owned;
                var canBuy = Math.floor(trimps.owned - trimps.employed);
                if(buyScientists > 0 && freeWorkers > 0)
                    safeBuyJob('Scientist',toBuy <= canBuy ? toBuy : canBuy);
            }
            else
                return;
        }
    }
    else
    {   //exit if we are havent bred to at least 90% breedtimer yet...
        if (game.resources.trimps.owned < game.resources.trimps.realMax() * 0.9 && !breedFire) return;
    }
    

    var oldBuy = game.global.buyAmt;

    //Simple buy if you can
    if (getPageSetting('MaxTrainers') > game.jobs.Trainer.owned || getPageSetting('MaxTrainers') == -1) {
        game.global.buyAmt = 1;
        if (canAffordJob('Trainer', false) &&  game.jobs.Trainer.cost.food[0]*Math.pow(game.jobs.Trainer.cost.food[1],game.jobs.Trainer.owned)*2 < game.resources.food.owned) {
            freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
            if (freeWorkers <= 0) safeBuyJob('Farmer', -1);
            safeBuyJob('Trainer');
        }
    }
    if (game.jobs.Explorer.owned < getPageSetting('MaxExplorers') || getPageSetting('MaxExplorers') == -1) {
        game.global.buyAmt = 1;
        if (canAffordJob('Explorer', false) && !game.jobs.Explorer.locked) {
            freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
            if (freeWorkers <= 0) safeBuyJob('Farmer', -1);
            safeBuyJob('Explorer');
        }
    }
game.global.buyAmt = oldBuy;
freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    if (getPageSetting('HireScientists') && !game.jobs.Scientist.locked) {
    //if earlier in the game, buy a small amount of scientists
        //if earlier in the game, buy a small amount of scientists
    if (game.jobs.Farmer.owned < 250000 && !breedFire) {
        var buyScientists = Math.floor((scientistRatio / totalRatio * totalDistributableWorkers) - game.jobs.Scientist.owned);
        //bandaid to prevent situation where 1 scientist is bought, causing floor calculation to drop by 1, making next calculation -1 and entering hiring/firing loop
        //proper fix is including scientists in totalDistributableWorkers and the scientist ratio in the total ratio, but then it waits for 4 jobs
        if(buyScientists > 0 && freeWorkers > 0) safeBuyJob('Scientist', buyScientists);
    }
            var buyScientists = Math.floor((scientistRatio / totalRatio * totalDistributableWorkers) - game.jobs.Scientist.owned);
            //bandaid to prevent situation where 1 scientist is bought, causing floor calculation to drop by 1, making next calculation -1 and entering hiring/firing loop
            //proper fix is including scientists in totalDistributableWorkers and the scientist ratio in the total ratio, but then it waits for 4 jobs
            if(buyScientists > 0 && freeWorkers > 0) safeBuyJob('Scientist', buyScientists);
        }
    //once over 100k farmers, fire our scientists and rely on manual gathering of science
    else if (game.jobs.Scientist.owned < 50000000) { safeBuyJob('Scientist', buyScientists);
        //once over 250k farmers, fire our scientists and rely on manual gathering of science
        //else if (game.jobs.Scientist.owned > 0) safeBuyJob('Scientist', game.jobs.Scientist.owned * -1);
    }
    //Buy Farmers:
    if(!game.jobs.Farmer.locked && !breedFire) {
        var toBuy = Math.floor((farmerRatio / totalRatio * totalDistributableWorkers) - game.jobs.Farmer.owned);
        var canBuy = Math.floor(trimps.owned - trimps.employed);
        safeBuyJob('Farmer',toBuy <= canBuy ? toBuy : canBuy);
    }

    // else if(breedFire)
    // safeBuyJob('Farmer', game.jobs.Farmer.owned * -1);    
    //Buy/Fire Miners:
    if(!game.jobs.Miner.locked && !breedFire) {
        var toBuy = Math.floor((minerRatio / totalRatio * totalDistributableWorkers) - game.jobs.Miner.owned);
        var canBuy = Math.floor(trimps.owned - trimps.employed);
        safeBuyJob('Miner',toBuy <= canBuy ? toBuy : canBuy);
    }
    else if(breedFire)
        safeBuyJob('Miner', game.jobs.Miner.owned * -1);
    //Buy/Fire Lumberjacks:
    if(!game.jobs.Lumberjack.locked && !breedFire) {
        var toBuy = Math.floor((lumberjackRatio / totalRatio * totalDistributableWorkers) - game.jobs.Lumberjack.owned);
        var canBuy = Math.floor(trimps.owned - trimps.employed);
        safeBuyJob('Lumberjack',toBuy <= canBuy ? toBuy : canBuy);
    }
    else if(breedFire)
        safeBuyJob('Lumberjack', game.jobs.Lumberjack.owned * -1);    


}

function autoLevelEquipment() {
    if((game.jobs.Miner.locked && game.global.challengeActive != 'Metal') || (game.jobs.Scientist.locked && game.global.challengeActive != "Scientist"))
        return;
    var Best = {
        'healthwood': {
            Factor: 0,
            Name: '',
            Wall: false,
            Status: 'white'
        },
        'healthmetal': {
            Factor: 0,
            Name: '',
            Wall: false,
            Status: 'white'
        },
        'attackmetal': {
            Factor: 0,
            Name: '',
            Wall: false,
            Status: 'white'
        },
        'blockwood': {
            Factor: 0,
            Name: '',
            Wall: false,
            Status: 'white'
        }
    };
    var enemyDamage = getEnemyMaxAttack(game.global.world + 1, 30, 'Snimp', .85);
    var enemyHealth = getEnemyMaxHealth(game.global.world + 1);
    
    //below challenge multiplier not necessarily accurate, just fudge factors
    if(game.global.challengeActive == "Toxicity") {
        //ignore damage changes (which would effect how much health we try to buy) entirely since we die in 20 attacks anyway?
        if(game.global.world < 61)
            enemyDamage *= 2;
        enemyHealth *= 2;
    }
    if(game.global.challengeActive == 'Lead') {
        enemyDamage *= 2.5;
        enemyHealth *= 7;
    }
    //change name to make sure these are local to the function
    var enoughHealthE = !(doVoids && voidCheckPercent > 0) && (baseHealth * 4 > 30 * (enemyDamage - baseBlock / 2 > 0 ? enemyDamage - baseBlock / 2 : enemyDamage * 0.2) || baseHealth > 30 * (enemyDamage - baseBlock > 0 ? enemyDamage - baseBlock : enemyDamage * 0.2));
    var enoughDamageE = (baseDamage * 4 > enemyHealth);

    if (game.global.world == 200) { //&& ((new Date().getTime() - game.global.zoneStarted) / 1000 / 60) > 10 && ((new Date().getTime() - game.global.zoneStarted) / 1000 / 60) < 20){
    enoughHealthE = false;
    enoughDamageE = false;
    }
    if (game.global.world < 199 || game.global.world > 200 || ((new Date().getTime() - game.global.zoneStarted) / 1000 / 60) > 85) {
    autoTrimpSettings.GeneticistTimer.value = '30';
    } else {
    autoTrimpSettings.GeneticistTimer.value = '45';
    }

    for (var equipName in equipmentList) {
        var equip = equipmentList[equipName];
        // debug('Equip: ' + equip + ' EquipIndex ' + equipName);
        var gameResource = equip.Equip ? game.equipment[equipName] : game.buildings[equipName];
        // debug('Game Resource: ' + gameResource);
        if (!gameResource.locked) {
            document.getElementById(equipName).style.color = 'white';
            var evaluation = evaluateEfficiency(equipName);
            // debug(equipName + ' evaluation ' + evaluation.Status);
            var BKey = equip.Stat + equip.Resource;
            // debug(equipName + ' bkey ' + BKey);

            if (Best[BKey].Factor === 0 || Best[BKey].Factor < evaluation.Factor) {
                Best[BKey].Factor = evaluation.Factor;
                Best[BKey].Name = equipName;
                Best[BKey].Wall = evaluation.Wall;
                Best[BKey].Status = evaluation.Status;
            }

            document.getElementById(equipName).style.borderColor = evaluation.Status;
            if (evaluation.Status != 'white' && evaluation.Status != 'yellow') {
                document.getElementById(equip.Upgrade).style.color = evaluation.Status;
            }
            if (evaluation.Status == 'yellow') {
                document.getElementById(equip.Upgrade).style.color = 'white';
            }
            if (evaluation.Wall) {
                document.getElementById(equipName).style.color = 'yellow';
            }

            //Code is Spaced This Way So You Can Read It:
            if (
                evaluation.Status == 'red' &&
                (
                    ( getPageSetting('BuyWeaponUpgrades') && equipmentList[equipName].Stat == 'attack' ) 
                    ||
                    ( getPageSetting('BuyWeaponUpgrades') && equipmentList[equipName].Stat == 'block' )
                    ||
                    ((getPageSetting('BuyArmorUpgrades') && ((equipmentList[equipName].Resource != 'metal') || (gameResource.prestige+2 <= ((game.global.world-5)/5)) || gameResource.prestige < 5) && (equipmentList[equipName].Stat == 'health'))
                        && 
                //Only buy Armor prestiges when 'DelayArmorWhenNeeded' is on, IF:
                        (
                            (game.global.world == 200)  // not in level 200
                            ||                                                       //     or
                            (getPageSetting('DelayArmorWhenNeeded') && !shouldFarm)  // not during "Farming" mode 
                            ||                                                       //     or
                            (getPageSetting('DelayArmorWhenNeeded') && enoughDamage) //  has enough damage (not in "Wants more Damage" mode)
                            ||                                                       //     or        
                            (getPageSetting('DelayArmorWhenNeeded') && !enoughDamage && !enoughHealth) // if neither enough dmg or health, then tis ok to buy.
                            || 
                            (getPageSetting('DelayArmorWhenNeeded') && equipmentList[equipName].Resource == 'wood')
                            ||
                            !getPageSetting('DelayArmorWhenNeeded')  //or when its off.
                        )

                    )
                )
            ) 
            {
                var upgrade = equipmentList[equipName].Upgrade;
                if (upgrade != "Gymystic")
                    debug('Upgrading ' + upgrade + " - Prestige " + game.equipment[equipName].prestige, '*upload');
                else
                    debug('Upgrading ' + upgrade + " # " + game.upgrades[upgrade].allowed, '*upload');
                buyUpgrade(upgrade, true, true);
            }
        }
    }
    preBuy();
    game.global.buyAmt = 1;
    for (var stat in Best) {
        if (Best[stat].Name !== '') {
            var eqName = Best[stat].Name;
            var DaThing = equipmentList[eqName];
            document.getElementById(Best[stat].Name).style.color = Best[stat].Wall ? 'orange' : 'red';
            //If we're considering an attack item, we want to buy weapons if we don't have enough damage, or if we don't need health (so we default to buying some damage)
            if (getPageSetting('BuyWeapons') && DaThing.Stat == 'attack' && (!enoughDamageE || enoughHealthE)) {
                if (DaThing.Equip && !Best[stat].Wall && canAffordBuilding(eqName, null, null, true)) {
                    debug('Leveling equipment ' + eqName, '*upload3');
                    buyEquipment(eqName, null, true);
                }
            }
            //If we're considering a health item, buy it if we don't have enough health, otherwise we default to buying damage
            if (getPageSetting('BuyArmor') && (DaThing.Stat == 'health' || DaThing.Stat == 'block') && !enoughHealthE) {
                if (DaThing.Equip && !Best[stat].Wall && canAffordBuilding(eqName, null, null, true)) {
                    debug('Leveling equipment ' + eqName, '*upload3');
                    buyEquipment(eqName, null, true);
                }
            }
            if (getPageSetting('BuyArmor') && (DaThing.Stat == 'health') && getPageSetting('AlwaysArmorLvl2') && game.equipment[eqName].level < 2){
                if (DaThing.Equip && !Best[stat].Wall && canAffordBuilding(eqName, null, null, true)) {             
                    debug('Leveling equipment ' + eqName + " (AlwaysArmorLvl2)", '*upload3');
                    buyEquipment(eqName, null, true);
                } // ??idk??    && (getPageSetting('DelayArmorWhenNeeded') && enoughDamage)
            }
        }
    }
    postBuy();
}

function manualLabor() {
    var ManualGather = 'metal';
    var breedingTrimps = game.resources.trimps.owned - game.resources.trimps.employed;
    
    if(breedingTrimps < 5 && game.buildings.Trap.owned == 0 && canAffordBuilding('Trap')) {
        //safeBuyBuilding returns false if item is already in queue
        if(!safeBuyBuilding('Trap'))
            setGather('buildings');
    }
    else if (breedingTrimps < 5 && game.buildings.Trap.owned > 0) {
        setGather('trimps');
    }
    else if (game.resources.science.owned < 100 && document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden') setGather('science');
        //if we have more than 2 buildings in queue, or (our modifier is real fast and trapstorm is off), build                      
    else if (game.global.buildingsQueue.length ? (game.global.buildingsQueue.length > 1 || game.global.autoCraftModifier == 0 || (getPlayerModifier() > 1000 && game.global.buildingsQueue[0] != 'Trap.1')) : false) {
        // debug('Gathering buildings??');
        setGather('buildings');
    }
        //if trapstorm is off (likely we havent gotten it yet, the game is still early, buildings take a while to build ), then Prioritize Storage buildings when they hit the front of the queue (should really be happening anyway since the queue should be >2(fits the clause above this), but in case they are the only object in the queue.)
    else if (!game.global.trapBuildToggled && (game.global.buildingsQueue[0] == 'Shed.1' || game.global.buildingsQueue[0] == 'Barn.1' || game.global.buildingsQueue[0] == 'Forge.1')){
        setGather('buildings');
    }
        //if we have some upgrades sitting around which we don't have enough science for, gather science
    else if (game.resources.science.owned < scienceNeeded && document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden') {
        // debug('Science needed ' + scienceNeeded);
        if (getPlayerModifier() < getPerSecBeforeManual('Scientist') && game.global.turkimpTimer > 0){
            //if manual is less than half of science production switch on turkimp
            setGather('metal');
        }
        else {
            setGather('science');
        }
    }
    else if (getPageSetting('TrapTrimps') && parseInt(getPageSetting('GeneticistTimer')) < getBreedTime(true)){
        //combined to optimize code.
        if (game.buildings.Trap.owned < 1 && canAffordBuilding('Trap')) { 
            safeBuyBuilding('Trap');
            setGather('buildings');
        }
        else if (game.buildings.Trap.owned > 0)
            setGather('trimps');
    }

    else {
        var manualResourceList = {
            'food': 'Farmer',
            'wood': 'Lumberjack',
            'metal': 'Miner',
        };
        var lowestResource = 'food';
        var lowestResourceRate = -1;
        var haveWorkers = true;
        for (var resource in manualResourceList) {
            var job = manualResourceList[resource];
            var currentRate = game.jobs[job].owned * game.jobs[job].modifier;
            // debug('Current rate for ' + resource + ' is ' + currentRate + ' is hidden? ' + (document.getElementById(resource).style.visibility == 'hidden'));
            if (document.getElementById(resource).style.visibility != 'hidden') {
                // debug('INNERLOOP for resource ' +resource);
                if (currentRate === 0) {
                    currentRate = game.resources[resource].owned;
                    // debug('Current rate for ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate);
                    if ((haveWorkers) || (currentRate < lowestResourceRate)) {
                        // debug('New Lowest1 ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate+ ' haveworkers ' +haveWorkers);
                        haveWorkers = false;
                        lowestResource = resource;
                        lowestResourceRate = currentRate;
                    }
                }
                if ((currentRate < lowestResourceRate || lowestResourceRate == -1) && haveWorkers) {
                    // debug('New Lowest2 ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate);
                    lowestResource = resource;
                    lowestResourceRate = currentRate;
                }
            }
            // debug('Current Stats ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate+ ' haveworkers ' +haveWorkers);
        }

        if (game.global.playerGathering != lowestResource && !haveWorkers && !breedFire && game.global.turkimpTimer < 1) {
            // debug('Set gather lowestResource');
            setGather(lowestResource);
        } else if (game.global.turkimpTimer > 0 && getBuildingItemPrice(game.buildings.Warpstation, "gems", false, 1) > game.resources.gems.owned ) {
            //debug('Set gather ManualGather');
            setGather('food');
        } else if (game.global.turkimpTimer > 0 && game.global.world != 200 ) {
            //debug('Set gather ManualGather');
            setGather('metal');
        } else if (game.global.turkimpTimer > 0 && game.global.world == 200) {
            setGather('wood');
        } else  if (game.resources.science.owned < getPsString('science', true) * 60 && document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden' && game.global.turkimpTimer < 1 && haveWorkers) {
            setGather('science');
        }
        else if(getPageSetting('TrapTrimps') && game.global.trapBuildToggled == true && game.buildings.Trap.owned < 10000)
            setGather('buildings');
        else if (document.getElementById('scienceCollectBtn').style.display != 'none' && document.getElementById('science').style.visibility != 'hidden')
            setGather('science');
        
    }
}

//function written by Belaith
function autoStance() {
    if (game.global.gridArray.length === 0) return;
    var missingHealth = game.global.soldierHealthMax - game.global.soldierHealth;
    if (game.global.world == 9200) { // && !game.global.mapsActive
        var newSquadRdy = true;
    } else {
        var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    }
    
    baseDamage = game.global.soldierCurrentAttack * (1 + (game.global.achievementBonus / 100)) * ((game.global.antiStacks * game.portal.Anticipation.level * game.portal.Anticipation.modifier) + 1) * (1 + (game.global.roboTrimpLevel * 0.2));
    if (game.global.formation == 2) {
        baseDamage /= 4;
    } else if (game.global.formation != "0") {
        baseDamage *= 2;
    }

    //baseBlock
    baseBlock = game.global.soldierCurrentBlock;
    if (game.global.formation == 3) {
        baseBlock /= 4;
    } else if (game.global.formation != "0") {
        baseBlock *= 2;
    }

    //baseHealth
    baseHealth = game.global.soldierHealthMax;
    if (game.global.formation == 1) {
        baseHealth /= 4;
    } else if (game.global.formation != "0") {
        baseHealth *= 2;
    }
    //no need to continue
    if (!getPageSetting('AutoStance')) return;

    //start analyzing autostance
    var missingHealth = game.global.soldierHealthMax - game.global.soldierHealth;
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var enemy;
    if (!game.global.mapsActive && !game.global.preMapsActive) {


        if (typeof game.global.gridArray[game.global.lastClearedCell + 1] === 'undefined') {
            enemy = game.global.gridArray[0];
        } else {
            enemy = game.global.gridArray[game.global.lastClearedCell + 1];
        }
        var enemyFast = game.global.challengeActive == "Slow" || ((((game.badGuys[enemy.name].fast || enemy.corrupted) && game.global.challengeActive != "Nom") && game.global.challengeActive != "Coordinate"));
        var enemyHealth = enemy.health;
        var enemyDamage = enemy.attack * 1.2;   //changed by genBTC from 1.19 (there is no fluctuation)
        //check for world Corruption
        if (enemy.corrupted){
            enemyHealth *= getCorruptScale("health");
            enemyDamage *= getCorruptScale("attack");
        }
        if (enemy && enemy.corrupted == 'corruptStrong') {
            enemyDamage *= 2;
        }
        if (enemy && enemy.corrupted == 'corruptTough') {
            enemyHealth *= 5;
        }
        if (game.global.challengeActive == 'Lead') {
            enemyDamage *= (1 + (game.challenges.Lead.stacks * 0.04));
        }
        if (game.global.challengeActive == 'Watch') {
            enemyDamage *= 1.25;
        }

        var pierceMod = 0;
        if (game.global.challengeActive == "Lead") pierceMod += (game.challenges.Lead.stacks * 0.001);
        var dDamage = enemyDamage - baseBlock / 2 > enemyDamage * (0.2 + pierceMod) ? enemyDamage - baseBlock / 2 : enemyDamage * (0.2 + pierceMod);
        var dHealth = baseHealth/2;
        var xDamage = enemyDamage - baseBlock > enemyDamage * (0.2 + pierceMod) ? enemyDamage - baseBlock : enemyDamage * (0.2 + pierceMod);
        var xHealth = baseHealth;
        var bDamage = enemyDamage - baseBlock * 4 > enemyDamage * (0.1 + pierceMod) ? enemyDamage - baseBlock * 4 : enemyDamage * (0.1 + pierceMod);
        var bHealth = baseHealth/2;
    } else if (game.global.mapsActive && !game.global.preMapsActive) {
        if (typeof game.global.mapGridArray[game.global.lastClearedMapCell + 1] === 'undefined') {
            enemy = game.global.mapGridArray[0];
        } else {
            enemy = game.global.mapGridArray[game.global.lastClearedMapCell + 1];
        }
        var enemyFast = game.global.challengeActive == "Slow" || ((((game.badGuys[enemy.name].fast || enemy.corrupted) && game.global.challengeActive != "Nom") || game.global.voidBuff == "doubleAttack") && game.global.challengeActive != "Coordinate");
        var enemyHealth = enemy.health;
        var enemyDamage = enemy.attack * 1.2;   //changed by genBTC from 1.19 (there is no fluctuation)
        //check for voidmap Corruption
        if (getCurrentMapObject().location == "Void" && enemy.corrupted){
            enemyHealth *= (getCorruptScale("health") / 2).toFixed(1);
            enemyDamage *= (getCorruptScale("attack") / 2).toFixed(1);
        }
        if (enemy && enemy.corrupted == 'corruptStrong') {
            enemyDamage *= 2;
        }
        if (enemy && enemy.corrupted == 'corruptTough') {
            enemyHealth *= 5;
        }
        if (game.global.challengeActive == 'Lead') {
            enemyDamage *= (1 + (game.challenges.Lead.stacks * 0.04));
        }
        if (game.global.challengeActive == 'Watch') {
            enemyDamage *= 1.25;
        }

        var dDamage = enemyDamage - baseBlock / 2 > 0 ? enemyDamage - baseBlock / 2 : 0;
        var dVoidCritDamage = enemyDamage*5 - baseBlock / 2 > 0 ? enemyDamage*5 - baseBlock / 2 : 0;
        var dHealth = baseHealth/2;
        var xDamage = enemyDamage - baseBlock > 0 ? enemyDamage - baseBlock : 0;
        var xVoidCritDamage = enemyDamage*5 - baseBlock > 0 ? enemyDamage*5 - baseBlock : 0;
        var xHealth = baseHealth;
        var bDamage = enemyDamage - baseBlock * 4 > 0 ? enemyDamage - baseBlock * 4 : 0;
        var bHealth = baseHealth/2;
    }
    

    var drainChallenge = game.global.challengeActive == 'Nom' || game.global.challengeActive == "Toxicity";
    
    if (game.global.challengeActive == "Electricity" || game.global.challengeActive == "Mapocalypse") {
        dDamage+= dHealth * game.global.radioStacks * 0.1;
        xDamage+= xHealth * game.global.radioStacks * 0.1;
        bDamage+= bHealth * game.global.radioStacks * 0.1;
    } else if (drainChallenge) {
        dDamage += dHealth/20;
        xDamage += xHealth/20;
        bDamage += bHealth/20;
    } else if (game.global.challengeActive == "Crushed") {
        if(dHealth > baseBlock /2)
            dDamage = enemyDamage*5 - baseBlock / 2 > 0 ? enemyDamage*5 - baseBlock / 2 : 0;
        if(xHealth > baseBlock)
            xDamage = enemyDamage*5 - baseBlock > 0 ? enemyDamage*5 - baseBlock : 0;
    }
    if (game.global.voidBuff == "bleed" || (enemy && enemy.corrupted == 'corruptBleed')) {
        dDamage += game.global.soldierHealth * 0.2;
        xDamage += game.global.soldierHealth * 0.2;
        bDamage += game.global.soldierHealth * 0.2;
    }
    baseDamage *= (game.global.titimpLeft > 0 ? 2 : 1); //consider titimp
    //double attack is OK if the buff isn't double attack, or we will survive a double attack, or we are going to one-shot them (so they won't be able to double attack)
    var doubleAttackOK = (game.global.voidBuff != 'doubleAttack' || (enemy && enemy.corrupted != 'corruptDbl')) || ((newSquadRdy && dHealth > dDamage * 2) || dHealth - missingHealth > dDamage * 2) || enemyHealth < baseDamage;
    //lead attack ok if challenge isn't lead, or we are going to one shot them, or we can survive the lead damage
    var leadDamage = game.challenges.Lead.stacks * 0.0005;
    var leadAttackOK = game.global.challengeActive != 'Lead' || enemyHealth < baseDamage || ((newSquadRdy && dHealth > dDamage + (dHealth * leadDamage)) || (dHealth - missingHealth > dDamage + (dHealth * leadDamage)));
    //added voidcrit.
    //voidcrit is OK if the buff isn't crit-buff, or we will survive a crit, or we are going to one-shot them (so they won't be able to crit)
    var isCritVoidMap = game.global.voidBuff == 'getCrit' || (enemy && enemy.corrupted == 'corruptCrit');
    var voidCritinDok = !isCritVoidMap || (!enemyFast ? enemyHealth < baseDamage : false) || (newSquadRdy && dHealth > dVoidCritDamage) || (dHealth - missingHealth > dVoidCritDamage);
    var voidCritinXok = !isCritVoidMap || (!enemyFast ? enemyHealth < baseDamage : false) || (newSquadRdy && xHealth > xVoidCritDamage) || (xHealth - missingHealth > xVoidCritDamage);

    if (!game.global.preMapsActive && game.global.soldierHealth > 0) {
        if (!enemyFast && game.upgrades.Dominance.done && enemyHealth < baseDamage && (newSquadRdy || (dHealth - missingHealth > 0 && !drainChallenge) || (drainChallenge && dHealth - missingHealth > dHealth/20))) {
            setFormation(2);
            //use D stance if: new army is ready&waiting / can survive void-double-attack or we can one-shot / can survive lead damage / can survive void-crit-dmg
        } else if (game.upgrades.Dominance.done && ((newSquadRdy && dHealth > dDamage) || dHealth - missingHealth > dDamage) && doubleAttackOK && leadAttackOK && voidCritinDok ) {
            setFormation(2);
            //if CritVoidMap, switch out of D stance if we cant survive. Do various things.
        } else if (isCritVoidMap && !voidCritinDok) {
            //if we are already in X and the NEXT potential crit would take us past the point of being able to return to D/B, switch to B.
            if (game.global.formation == "0" && game.global.soldierHealth - xVoidCritDamage < game.global.soldierHealthMax/2){
                if (game.upgrades.Barrier.done && (newSquadRdy || (missingHealth < game.global.soldierHealthMax/2)) )
                    setFormation(3);
            }
                //else if we can totally block all crit damage in X mode, OR we can't survive-crit in D, but we can in X, switch to X. 
                // NOTE: during next loop, the If-block above may immediately decide it wants to switch to B.
            else if (xVoidCritDamage == 0 || (game.global.formation == 2 && voidCritinXok)){
                setFormation("0");
            }
                //otherwise, stuff:
            else {
                if (game.global.formation == "0"){
                    if (game.upgrades.Barrier.done && (newSquadRdy || (missingHealth < game.global.soldierHealthMax/2)) )
                        setFormation(3);
                    else
                        setFormation(1);
                }
                else if (game.upgrades.Barrier.done && game.global.formation == 2)
                    setFormation(3);
            }
        } else if (game.upgrades.Formations.done && ((newSquadRdy && xHealth > xDamage) || xHealth - missingHealth > xDamage)) {
            //in lead challenge, switch to H if about to die, so doesn't just die in X mode without trying
            if ((game.global.challengeActive == 'Lead') && (xHealth - missingHealth < xDamage + (xHealth * leadDamage)))
                setFormation(1);
            else
                setFormation("0");
        } else if (game.upgrades.Barrier.done && ((newSquadRdy && bHealth > bDamage) || bHealth - missingHealth > bDamage)) {
            setFormation(3);    //does this ever run? 
        } else if (game.upgrades.Formations.done) {

            setFormation(1);
        } else
            setFormation("0");
    }
    baseDamage /= (game.global.titimpLeft > 0 ? 2 : 1); //unconsider titimp :P
}


//core function written by Belaith

var stackingTox = false;
var doVoids = false;
var needToVoid = false;
var needPrestige = false;
var voidCheckPercent = 0;
var HDratio = 0;

function autoMap() {
    //allow script to handle abandoning
    if(game.options.menu.alwaysAbandon.enabled == 1) toggleSetting('alwaysAbandon');
        
    //calculate average crits
    baseDamage = (baseDamage * (1-getPlayerCritChance()) + (baseDamage * getPlayerCritChance() * getPlayerCritDamageMult()))/2;
    //calculate with map bonus
    var mapbonusmulti = 1 + (0.20*game.global.mapBonus);
    baseDamage *= mapbonusmulti;
    
    //get average enemyhealth and damage for the next zone, cell 30, snimp type and multiply it by a factor of .85 (don't ask why)
    var enemyDamage = getEnemyMaxAttack(game.global.world + 1, 30, 'Snimp', .85);
    var enemyHealth = getEnemyMaxHealth(game.global.world + 1);
    
    //farm if basedamage is between 10 and 16)
    if(!getPageSetting('DisableFarm')) {
        shouldFarm = shouldFarm ? getEnemyMaxHealth(game.global.world) / baseDamage > 20 : getEnemyMaxHealth(game.global.world) / baseDamage > 32;
    }
    //DECIMAL VOID MAPS:
    var voidMapLevelSetting = getPageSetting('VoidMaps');
    //using string function to avoid false float precision (0.29999999992). javascript can compare ints to strings anyway.
    var voidMapLevelSettingZone = (voidMapLevelSetting+"").split(".")[0];
    var voidMapLevelSettingMap = (voidMapLevelSetting+"").split(".")[1];
    if (voidMapLevelSettingMap === undefined || game.global.challengeActive == 'Lead') 
        voidMapLevelSettingMap = 93;
    if (voidMapLevelSettingMap.length == 1) voidMapLevelSettingMap += "0";  //entering 187.70 becomes 187.7, this will bring it back to 187.70
    var voidsuntil = getPageSetting('RunNewVoidsUntil');
    needToVoid = voidMapLevelSetting > 0 && game.global.totalVoidMaps > 0 && game.global.lastClearedCell + 1 >= voidMapLevelSettingMap && 
                                ((game.global.world == voidMapLevelSettingZone && !getPageSetting('RunNewVoids')) 
                                                                || 
                                 (game.global.world >= voidMapLevelSettingZone && getPageSetting('RunNewVoids')))
                         && ((voidsuntil != -1 && game.global.world <= voidsuntil) || (voidsuntil == -1) || !getPageSetting('RunNewVoids')) ;
    if (game.global.mapsUnlocked) {

      
        needPrestige = (autoTrimpSettings.Prestige.selected != "Off" && game.mapUnlocks[autoTrimpSettings.Prestige.selected].last <= game.global.world - 5 && game.global.mapsUnlocked && game.global.challengeActive != "Frugal");
        if(game.global.challengeActive == "Toxicity") {
            //ignore damage changes (which would effect how much health we try to buy) entirely since we die in 20 attacks anyway?
            //enemyDamage *= 2;
            enemyHealth *= 2;
        }
        var pierceMod = 0;
        if(game.global.challengeActive == 'Lead') {
            enemyDamage *= (1 + (game.challenges.Lead.stacks * 0.04));
            enemyHealth *= (1 + (game.challenges.Lead.stacks * 0.04));
            if (game.global.world % 2 == 1){
                enemyDamage = getEnemyMaxAttack(game.global.world + 2, 30, 'Chimp', 1); //calculate for the next level in advance (since we only farm on odd, and evens are very tough)
                enemyHealth = getEnemyMaxHealth(game.global.world + 2);
                baseDamage /= 1.5; //subtract the odd-zone bonus.
            }
            pierceMod += (game.challenges.Lead.stacks * 0.001);
            baseDamage /= mapbonusmulti;
            shouldFarm = enemyHealth / baseDamage > 10;
        }
        if(game.global.totalVoidMaps == 0 || !needToVoid)
            doVoids = false;
        
        enoughHealth = (baseHealth * 4 > 30 * (enemyDamage - baseBlock / 2 > 0 ? enemyDamage - baseBlock / 2 : enemyDamage * (0.2 + pierceMod))
                        || 
                        baseHealth > 30 * (enemyDamage - baseBlock > 0 ? enemyDamage - baseBlock : enemyDamage * (0.2 + pierceMod)));
        enoughDamage = baseDamage * 8 > enemyHealth;
        HDratio = getEnemyMaxHealth(game.global.world) / baseDamage;
        //prevents map-screen from flickering on and off during startup when base damage is 0.
        if (baseDamage > 0){
            var shouldDoMaps = !enoughHealth || !enoughDamage || shouldFarm;
        }
        var shouldDoMap = "world";
        
        
        
        //if we are at max map bonus, and we don't need to farm, don't do maps
        if(game.global.mapBonus == 10 && !shouldFarm) shouldDoMaps = false;
        //if we are prestige mapping, force equip first mode
        if(autoTrimpSettings.Prestige.selected != "Off" && game.options.menu.mapLoot.enabled != 1) toggleSetting('mapLoot');
        //if player has selected arbalest or gambeson but doesn't have them unlocked, just unselect it for them! It's magic!
        if(document.getElementById('Prestige').selectedIndex > 11 && game.global.slowDone == false) {
            document.getElementById('Prestige').selectedIndex = 11;
            autoTrimpSettings.Prestige.selected = "Bestplate";
        }
        
        //FarmWhenNomStacks7
        if(game.global.challengeActive == 'Nom' && getPageSetting('FarmWhenNomStacks7')) {
            if (game.global.gridArray[99].nomStacks > 7){
                if (game.global.mapBonus != 10)
                    shouldDoMaps = true;

            }
            //Go into maps on 30 stacks, and I assume our enemy health to damage ratio is worse than 10 (so that shouldfarm would be true),
            // and exit farming once we get enough damage to drop under 10.
            if (game.global.gridArray[99].nomStacks == 30){
                shouldFarm = (HDratio > 20);
                shouldDoMaps = true;
            }
        }



        //stack tox stacks if heliumGrowing has been set to true, or if we need to clear our void maps
        if(game.global.challengeActive == 'Toxicity' && game.global.lastClearedCell > 93 && game.challenges.Toxicity.stacks < 1500 && ((getPageSetting('MaxTox') && game.global.world > 59) || needToVoid)) {
            shouldDoMaps = true;
            //we willl get at least 85 toxstacks from the 1st voidmap
            stackingTox = !(needToVoid && game.challenges.Toxicity.stacks > 1415);

            //force abandon army
            if(!game.global.mapsActive && !game.global.preMapsActive) {
                mapsClicked();
                mapsClicked();
            }

        }
        else stackingTox = false;
        
        //during 'watch' challenge, run maps on these levels:
        var watchmaps = [15,25,35,50];
        var shouldDoWatchMaps = false;
        if (game.global.challengeActive == 'Watch' && watchmaps.indexOf(game.global.world) > -1 && game.global.mapBonus < 1){
            shouldDoMaps = true;
            shouldDoWatchMaps = true;
        }
        
        //late game and spire maps (also forcing maps before level 40 insted of prestige)
        var shouldDoNullMaps = false;
        if (
	(game.global.mapBonus < 1 && !game.global.mapsActive && (game.global.world == 15 || game.global.world == 21 || game.global.world == 25 || game.global.world == 31 || game.global.world == 34 || game.global.world == 37)) ||
        (game.global.mapBonus < 1 && (game.global.world == 9205 || game.global.world == 9215 || game.global.world == 9223 || game.global.world == 9225 || game.global.world == 9226 || game.global.world == 9227 || game.global.world == 228 || game.global.world == 229)) ||
        (game.global.mapBonus < 2 && (game.global.world == 999 || game.global.world == 999 || game.global.world == 999 || game.global.world == 999)) ||
        (game.global.mapBonus < 4 && (game.global.world == 999 || game.global.world == 999 || game.global.world == 999 || game.global.world == 999)) ||
        (game.global.mapBonus < 5 && (game.global.world == 210 || game.global.world == 220 || game.global.world == 230 || game.global.world == 240 || (game.global.world >= 237 && game.global.world <= 239) || (game.global.world >= 245 && game.global.world <= 249) || (game.global.world == 253 && game.global.world <= 259) || game.global.world >= 263)) ||
        (game.global.mapBonus < 6 && (game.global.world >= 999 && game.global.world <= 9999)) ||
	(game.global.mapBonus < 9 && (game.global.world == 250 || game.global.world == 200 || game.global.world == 260 || game.global.world >= 270)) ||
	//force to stay in nullmaps if you overkill all the cells unless you are about to hit max map bonus.
        (game.global.world >= 205 && game.global.mapsActive && game.global.mapBonus < 9 && (new Date().getTime() - game.global.mapStarted) > (270 * game.global.mapGridArray.length))
	//option to force stay in zone X time in min and farm
        //(game.global.world == 200 && game.global.lastClearedCell > 20 ((new Date().getTime() - game.global.zoneStarted) / 1000 / 60) < 10)
	) {
            shouldDoMaps = true;
            shouldDoNullMaps = true;
            console.log("now null running = true");
        }
        shouldFarm = shouldDoNullMaps ? true : shouldFarm;
        enoughDamage = shouldDoNullMaps ? true : enoughDamage;
        enoughHealth = shouldDoNullMaps ? true : enoughHealth;
        //Create siphonology on demand section.
        var siphlvl = game.global.world - game.portal.Siphonology.level;

        if (getPageSetting('DynamicSiphonology')){
            for (siphlvl; siphlvl < game.global.world; siphlvl++) {
                //check HP vs damage and find how many siphonology levels we need.
                var maphp = getEnemyMaxHealth(siphlvl);
                if (baseDamage * 4 < maphp){
                    break;
                }
            }
        }
        var obj = {};
        var siphonMap = -1;
        for (var map in game.global.mapsOwnedArray) {
            if (!game.global.mapsOwnedArray[map].noRecycle) {
                obj[map] = game.global.mapsOwnedArray[map].level;
                if(game.global.mapsOwnedArray[map].level == siphlvl)
                    siphonMap = map;                
            }
        }
        var keysSorted = Object.keys(obj).sort(function(a, b) {
            return obj[b] - obj[a];
        });
        //if there are no non-unique maps, there will be nothing in keysSorted, so set to create a map
        if (keysSorted[0]) var highestMap = keysSorted[0];
        else shouldDoMap = "create";
         
        //set the repeatBionics flag (farm bionics before spire), for the repeat management code below.
        var repeatBionics = getPageSetting('RunBionicBeforeSpire') && game.global.bionicOwned >= 5; //WARNING: Currently repeats infinitely, no cue to exit, not sure under what conditions it should exit. When Farming is done? When is that? When player's Block exceeds cell 100's Spire improbability's attack?  We can get the attack data with this command: getSpireStats(100, "Improbability", "attack"). Needs to know there are no more prestige items so we can set this to false.


        //Look through all the maps we have - find Uniques or Voids and figure out if we need to run them.
        for (var map in game.global.mapsOwnedArray) {
            var theMap = game.global.mapsOwnedArray[map];
            //clear void maps if we need to
            if(theMap.location == 'Void' && needToVoid) {
                //if we are on toxicity, don't clear until we will have max stacks at the last cell.
                if(game.global.challengeActive == 'Toxicity' && game.challenges.Toxicity.stacks < (1500 - theMap.size)) break;
                doVoids = true;
                //check to make sure we won't get 1-shot in nostance by boss
                var eAttack = getEnemyMaxAttack(game.global.world, theMap.size, 'Voidsnimp', theMap.difficulty);
                var ourHealth = baseHealth;
                if(game.global.challengeActive == 'Balance') {
                    var stacks = game.challenges.Balance.balanceStacks ? (game.challenges.Balance.balanceStacks > theMap.size) ? theMap.size : game.challenges.Balance.balanceStacks : false;
                    eAttack *= 2;
                    if(stacks) {
                        for (i = 0; i < stacks; i++ ) {
                            ourHealth *= 1.01;
                        }
                    }
                }
                if(game.global.challengeActive == 'Toxicity') eAttack *= 5;
                //break to prevent finishing map to finish a challenge?
                //continue to check for doable map?
                var diff = parseInt(getPageSetting('VoidCheck')) > 0 ? parseInt(getPageSetting('VoidCheck')) : 2;
                if(ourHealth/diff < eAttack - baseBlock) {
                    shouldFarm = true;
                    voidCheckPercent = Math.round((ourHealth/diff)/(eAttack-baseBlock)*100);
                    break;
                }
                else {
                    voidCheckPercent = 0;
                    if(getPageSetting('DisableFarm'))
                        shouldFarm = false;
                }
                shouldDoMap = theMap.id;
                //Restart the voidmap if we hit 30 nomstacks on the final boss
                if(game.global.mapsActive && game.global.challengeActive == "Nom" && getPageSetting('FarmWhenNomStacks7')) {
                    if(game.global.mapGridArray[theMap.size-1].nomStacks >= 100) {
                        mapsClicked(true);
                    }
                }
                break;
            }


            if (theMap.noRecycle && getPageSetting('RunUniqueMaps')) {
                if (theMap.name == 'The Wall' && game.upgrades.Bounty.allowed == 0) {
                    shouldDoMap = theMap.id;
                    break;
                }
                if (theMap.name == 'Dimension of Anger' && document.getElementById("portalBtn").style.display == "none") {
                //    var doaDifficulty = Math.ceil(theMap.difficulty / 2);
                    if(game.global.world > 20) { 
                    shouldDoMap = theMap.id;
                    break;
                    }
                }
                //run the prison only if we are 'cleared' to run level 80 + 1 level per 200% difficulty. Could do more accurate calc if needed
                if(theMap.name == 'The Prison' && (game.global.challengeActive == "Electricity" || game.global.challengeActive == "Mapocalypse")) {
                    var prisonDifficulty = Math.ceil(theMap.difficulty / 2);
                    if(game.global.world >= 80 + prisonDifficulty) {
                        shouldDoMap = theMap.id;
                        break;
                    }
                }
                if(theMap.name == 'The Block' && !game.upgrades.Shieldblock.allowed && (game.global.challengeActive == "Scientist" || game.global.challengeActive == "Trimp" || getPageSetting('BuyShieldblock'))) {
                    shouldDoMap = theMap.id;
                    break;
                }
                if(theMap.name == 'Trimple of Doom' && game.global.challengeActive == "Meditate") {
                    shouldDoMap = theMap.id;
                    break;
                }
                if(theMap.name == 'Bionic Wonderland' && game.global.challengeActive == "Crushed" ) {
                    var wonderlandDifficulty = Math.ceil(theMap.difficulty / 2);
                    if(game.global.world >= 125 + wonderlandDifficulty) {
                        shouldDoMap = theMap.id;
                        break;
                    }

                }
                //run Bionics before spire to farm.
                if (getPageSetting('RunBionicBeforeSpire') && (game.global.world == 199 || game.global.world == 200) && theMap.name.includes('Bionic Wonderland')){                    
                    //this is how to check if a bionic is green or not.
                    var bionicnumber = ((theMap.level - 125) / 15).toFixed(2);
                    //if numbers match, map is green, so run it. (do the pre-requisite bionics one at a time in order)
                    if (bionicnumber == game.global.bionicOwned && bionicnumber < 5){ 
                        shouldDoMap = theMap.id;
                        break;
                    }
                    //Count number of prestige items left,
                    var prestigeitemsleft = addSpecials(true, true, theMap);
                    //Always run Bionic Wonderland VI (if there are still prestige items available)
                    if (theMap.name == 'Bionic Wonderland VI' && prestigeitemsleft > 0){
                        shouldDoMap = theMap.id;
                        break;
                    }
                    //Run Bionic Wonderland VII (if we have exhausted all the prestiges from VI) - Code will not get to here if we have items still.
                    if (theMap.name == 'Bionic Wonderland VII' && prestigeitemsleft > 0){
                        shouldDoMap = theMap.id;
                        break;
                    }

                }
                
                //other unique maps here

            }
        }
            

        //map if we don't have health/dmg or we need to clear void maps or if we are prestige mapping, and our set item has a new prestige available 
        if (shouldDoMaps || doVoids || needPrestige) {
            //shouldDoMap = world here if we haven't set it to create yet, meaning we found appropriate high level map, or siphon map

            if (shouldDoMap == "world") {
                //if needPrestige, TRY to find current level map as the highest level map we own.
                if (needPrestige)
                    if (game.global.world == game.global.mapsOwnedArray[highestMap].level)
                        shouldDoMap = game.global.mapsOwnedArray[highestMap].id;
                    else
                        shouldDoMap = "create";
                    //if shouldFarm is true, use a siphonology adjusted map, as long as we aren't trying to prestige                
                else if (siphonMap != -1)
                    shouldDoMap = game.global.mapsOwnedArray[siphonMap].id;
                    //if we dont' have an appropriate max level map, or a siphon map, we need to make one
                else
                    shouldDoMap = "create";
            }
            //if shouldDoMap != world, it already has a map ID and will be run below            
        }
        
        //don't map on even worlds if on Lead, except if person is dumb and wants to void on even  
        if(game.global.challengeActive == 'Lead' && !doVoids && (game.global.world % 2 == 0 || game.global.lastClearedCell < 59)) {
            if(game.global.preMapsActive)
                mapsClicked();
            return;
        }
        //repeat button management
        if (!game.global.preMapsActive) {
            if (game.global.mapsActive) {
                

                //if we are doing the right map, and it's not a norecycle (unique) map, and we aren't going to hit max map bonus
                //or repeatbionics is true and there are still prestige items available to get
                if (shouldDoMap == game.global.currentMapId && (!game.global.mapsOwnedArray[getMapIndex(game.global.currentMapId)].noRecycle && (game.global.mapBonus < 9 || shouldFarm || stackingTox || needPrestige)) || (repeatBionics && addSpecials(true, true, game.global.mapsOwnedArray[getMapIndex(game.global.currentMapId)]) > 0)) {
                    var targetPrestige = autoTrimpSettings.Prestige.selected;
                    //make sure repeat map is on
                    if (!game.global.repeatMap) {
                        repeatClicked();
                    }
                    //if we aren't here for dmg/hp, and we see the prestige we are after on the last cell of this map, and it's the last one available, turn off repeat to avoid an extra map cycle
                    if (!shouldDoMaps && (game.global.mapGridArray[game.global.mapGridArray.length - 1].special == targetPrestige && game.mapUnlocks[targetPrestige].last >= game.global.world - 9 )) {
                        repeatClicked();
                    }
                    //avoid another map cycle due to having the amount of tox stacks we need.
                    if (stackingTox && (game.challenges.Toxicity.stacks + game.global.mapGridArray.length - (game.global.lastClearedMapCell + 1) >= 1500)){
                        repeatClicked();
                    }
                    //turn off repeat maps if we doing Watch maps.
                    if (shouldDoWatchMaps)
                        repeatClicked();
                } else {
                    //otherwise, make sure repeat map is off
                    if (game.global.repeatMap) {
                        repeatClicked();
                    }
                }
            } else if (!game.global.mapsActive) {
                if (shouldDoMap != "world") {
                    //if shouldFarm, don't switch until after megamining. if "wants damage", go in first 10 cells of zone (do map bonus simultaneously)
                    //if need prestige, go immediately.
                    if (!game.global.switchToMaps){
                        if ((shouldDoMaps && game.global.lastClearedCell < 10 && game.resources.trimps.owned > game.resources.trimps.realMax() * 0.9999) || ((shouldFarm || shouldDoMaps) && game.global.lastClearedCell >= 81) || (game.global.lastClearedCell >= 81 && needPrestige && game.resources.trimps.owned > game.resources.trimps.realMax() * 0.9999)|| doVoids || shouldDoMap!="world")
                            mapsClicked();
                    }
                    ////Get Impatient/Abandon if: need prestige / _NEED_ to do void maps / on lead in odd world. AND a new army is ready, OR _need_ to void map OR lead farming and we're almost done with the zone )
                    if(
                        game.global.switchToMaps 
                        && 
                        ((game.global.lastClearedCell >= 81 && needPrestige && game.global.world !=200) || doVoids || (game.global.challengeActive == 'Lead' && game.global.world % 2 == 1)) 
                        && 
                            (
                            (game.resources.trimps.realMax() <= game.resources.trimps.owned + 1)
                            || (game.global.challengeActive == 'Lead' && game.global.lastClearedCell > 93) 
                            || (doVoids && game.global.lastClearedCell > 93)
                            )
                        ){
                        mapsClicked();
                    }
                }
                //forcibly run watch maps
                if ((shouldDoWatchMaps||shouldDoNullMaps) && (game.global.world !=200 || game.global.lastClearedCell > 990) && game.resources.trimps.owned > game.resources.trimps.realMax() * 0.9999 )
                    mapsClicked();                
            }
        } else if (game.global.preMapsActive) {
            if (shouldDoMap == "world") {
                mapsClicked();  //go back
            } 
            else if (shouldDoMap == "create") {
                if (needPrestige)
                    document.getElementById("mapLevelInput").value = game.global.world;
                else
                    document.getElementById("mapLevelInput").value = siphlvl;
                if (game.global.world > 200 || (game.global.world < 199 && game.global.world > 90)) {
                    sizeAdvMapsRange.value = 9;
                    adjustMap('size', 9);
                    difficultyAdvMapsRange.value = 9;
                    adjustMap('difficulty', 9);
                    lootAdvMapsRange.value = 9;
                    adjustMap('loot', 9);

                    biomeAdvMapsSelect.value = "Mountain";
                    updateMapCost();
                } else if (game.global.world == 200 || game.global.world == 199) {
                    sizeAdvMapsRange.value = 9;
                    adjustMap('size', 9);
                    difficultyAdvMapsRange.value = 9;
                    adjustMap('difficulty', 9);
                    lootAdvMapsRange.value = 9;
                    adjustMap('loot', 9);

                    biomeAdvMapsSelect.value = "Forest";
                    updateMapCost();
                } else if (game.global.world < 36) {
                    sizeAdvMapsRange.value = 9;
                    adjustMap('size', 9);
                    difficultyAdvMapsRange.value = 9;
                    adjustMap('difficulty', 9);
                    lootAdvMapsRange.value = 9;
                    adjustMap('loot', 9);

                    biomeAdvMapsSelect.value = "Sea";
                    updateMapCost();
                } else {
                    sizeAdvMapsRange.value = 9;
                    adjustMap('size', 9);
                    difficultyAdvMapsRange.value = 9;
                    adjustMap('difficulty', 9);
                    lootAdvMapsRange.value = 9;
                    adjustMap('loot', 9);

                    biomeAdvMapsSelect.value = "Sea";
                    updateMapCost();
                }
		//Hider: the new meta is not based only on metal
                //if we are farming (for resources), make sure it's metal, and put low priority on size
            //    if(shouldFarm) {
            //        biomeAdvMapsSelect.value = "Mountain";
            //        while (sizeAdvMapsRange.value > 0 && updateMapCost(true) > game.resources.fragments.owned) {
            //            sizeAdvMapsRange.value = sizeAdvMapsRange.value - 1;
            //        }
            //        while (lootAdvMapsRange.value > 0 && updateMapCost(true) > game.resources.fragments.owned) {
            //            lootAdvMapsRange.value = lootAdvMapsRange.value - 1;
            //        }
            //    } else {
            //        while (lootAdvMapsRange.value > 0 && updateMapCost(true) > game.resources.fragments.owned) {
            //            lootAdvMapsRange.value = lootAdvMapsRange.value - 1;
            //        }
            //        //prioritize size over difficulty? Not sure. high Helium that just wants prestige = yes.
            //        //Really just trying to prevent prestige mapping from getting stuck
            //        while (difficultyAdvMapsRange.value > 0 && updateMapCost(true) > game.resources.fragments.owned) {
            //            difficultyAdvMapsRange.value = difficultyAdvMapsRange.value - 1;
            //        }
            //    }
                //if we can't afford the map we designed, pick our highest map
                if (updateMapCost(true) > game.resources.fragments.owned) {
                    selectMap(game.global.mapsOwnedArray[highestMap].id);
                    debug("Can't afford the map we designed, #" + document.getElementById("mapLevelInput").value, '*crying2');
                    debug("..picking our highest map:# " + game.global.mapsOwnedArray[highestMap].id + " Level: " + game.global.mapsOwnedArray[highestMap].level, '*happy2');
                    runMap();
                } else {
                    debug("BUYING a Map, level: #" + document.getElementById("mapLevelInput").value, 'th-large');
                    var result = buyMap();
                    if(result == -2){
                        debug("Too many maps, recycling now: ", 'th-large');
                        recycleBelow(true);
                        debug("Retrying BUYING a Map, level: #" + document.getElementById("mapLevelInput").value, 'th-large');
                        buyMap();
                    }
                }
                //if we already have a map picked, run it
            } else {
                selectMap(shouldDoMap);
                debug("Already have a map picked: Running map: " + shouldDoMap + 
                    " Level: " + game.global.mapsOwnedArray[getMapIndex(shouldDoMap)].level +
                    " Name: " + game.global.mapsOwnedArray[getMapIndex(shouldDoMap)].name, 'th-large');
                runMap();
            }
        }
    }
}

//calculate helium we will get from the end of this zone. If (stacks), return helium we will get with max tox stacks
function calculateHelium (stacks) {
    var world = game.global.world;
    var level = 100 + ((world - 1) * 100);
    var amt = 0;
    var baseAmt;
    
    if(world < 59) baseAmt = 1;
    else baseAmt = 5;
    
    level = Math.round((level - 1900) / 100);
    level *= 1.35;
    if(level < 0) level = 0;
    amt += Math.round(baseAmt * Math.pow(1.23, Math.sqrt(level)));
    amt += Math.round(baseAmt * level);
    
    if (game.portal.Looting.level) amt += (amt * game.portal.Looting.level * game.portal.Looting.modifier);
    
    if (game.global.challengeActive == "Toxicity"){
        var toxMult = (game.challenges.Toxicity.lootMult * game.challenges.Toxicity.stacks) / 100;
        if(toxMult > 2.25 || stacks) toxMult = 2.25;
        amt *= (1 + toxMult);
    }
    amt = Math.floor(amt);
    return amt;
}
//calculate our helium per hour including our helium for the end of this zone, assuming we finish the zone right now (and get that helium right now)
//if (stacked), calculate with maximum toxicity stacks
function calculateNextHeliumHour (stacked) {
    var timeThisPortal = new Date().getTime() - game.global.portalTime;
    timeThisPortal /= 3600000;
    var heliumNow = Math.floor((game.resources.helium.owned + calculateHelium()) / timeThisPortal);
    if(stacked) heliumNow = Math.floor((game.resources.helium.owned + calculateHelium(true)) / (timeThisPortal + (1500 - game.challenges.Toxicity.stacks) / 7200000));
    return heliumNow;
}

var lastHeliumZone = 0;
function autoPortal() {
    switch (autoTrimpSettings.AutoPortal.selected) {
        //portal if we have lower He/hr than the previous zone
        case "Helium Per Hour":
            game.stats.bestHeliumHourThisRun.evaluate();    //normally, evaluate() is only called once per second, but the script runs at 10x a second.
            var zoneincremented = false;
            if(game.global.world > lastHeliumZone) {
                lastHeliumZone = game.global.world;
                console.log("The zone has been incremented. Level " + lastHeliumZone);
                console.log("And the best helium this run was " + game.stats.bestHeliumHourThisRun.storedValue + " at zone: " +  game.stats.bestHeliumHourThisRun.atZone);
                zoneincremented = true;
            }
            if(game.global.world > game.stats.bestHeliumHourThisRun.atZone && zoneincremented == true) {
                var bestHeHr = game.stats.bestHeliumHourThisRun.storedValue;
                var myHeliumHr = game.stats.heliumHour.value();
                var heliumHrBuffer = Math.abs(getPageSetting('HeliumHrBuffer'));
                if(myHeliumHr < bestHeHr * (1-(heliumHrBuffer/100)) && !game.global.challengeActive) {
                    debug("My Helium was: " + myHeliumHr + " & the Best Helium was: " + bestHeHr);
                    pushData();
                    if(autoTrimpSettings.HeliumHourChallenge.selected != 'None') 
                        doPortal(autoTrimpSettings.HeliumHourChallenge.selected);
                    else 
                        doPortal();
                }

            }
            break;
        case "Custom":
            if(game.global.world > getPageSetting('CustomAutoPortal') && !game.global.challengeActive) {
                pushData();
                if(autoTrimpSettings.HeliumHourChallenge.selected != 'None')
                    doPortal(autoTrimpSettings.HeliumHourChallenge.selected);
                else
                    doPortal();
            }
            break; 
        case "Balance":
        case "Electricity":
        case "Crushed":
        case "Nom":
        case "Toxicity":
        case "Watch":
        case "Lead":
        case "Corrupted":
            if(!game.global.challengeActive) {
                pushData();
                doPortal(autoTrimpSettings.AutoPortal.selected);
            }
            break;
        case "Spire":
            if(game.global.world >= 201)
                doPortal("Lead");
            break;
        default:
            break;

    }

}


function checkSettings() {
    var portalLevel = -1;
    var leadCheck = false;

    switch(autoTrimpSettings.AutoPortal.selected) {
        case "Off":
            break;
        case "Custom":
            portalLevel = autoTrimpSettings.CustomAutoPortal.value + 1;
            leadCheck = autoTrimpSettings.HeliumHourChallenge.selected == "Lead" ? true:false;
            break;
        case "Balance":
            portalLevel = 41;
            break;
        case "Electricity":
            portalLevel = 82;
            break;
        case "Crushed":
            portalLevel = 126;
            break;
        case "Nom":
            portalLevel = 146;
            break;
        case "Toxicity":
            portalLevel = 166;
            break;
        case "Lead":
            portalLevel = 181;
            break;
        case "Watch":
            portalLevel = 181;
            break;
        case "Corrupted":
            portalLevel = 191;
            break;              
        case "Spire":
            portalLevel = 201;
            break;        
    }
    if(portalLevel == -1)
        return portalLevel;
    if(autoTrimpSettings.VoidMaps.value >= portalLevel)
        tooltip('confirm', null, 'update', 'WARNING: Your void maps are set to complete after your autoPortal, and therefore will not be done at all! Please Change Your Settings Now. This Box Will Not Go away Until You do. Remember you can choose \'Custom\' autoPortal along with challenges for complete control over when you portal. <br><br> Estimated autoPortal level: ' + portalLevel , 'cancelTooltip()', 'Void Maps Conflict');
    if((leadCheck || game.global.challengeActive == 'Lead') && (autoTrimpSettings.VoidMaps.value % 2 == 0 && portalLevel < 182))
        tooltip('confirm', null, 'update', 'WARNING: Voidmaps run during Lead on an Even zone do not receive the 2x Helium Bonus for Odd zones, and are also tougher. You should probably fix this.', 'cancelTooltip()', 'Lead Challenge Void Maps');
    return portalLevel;
}

function doPortal(challenge) {
    if(!game.global.portalActive) return;
    portalClicked();
    if(challenge) selectChallenge(challenge);
    activateClicked();
    activatePortal();
    lastHeliumZone = 0;
}

//adjust geneticists to reach desired breed timer
function manageGenes() {
    var fWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    if(getPageSetting('ManageBreedtimer')) {
        if(game.options.menu.showFullBreed.enabled != 1) toggleSetting("showFullBreed");
        
        if(game.portal.Anticipation.level == 0) autoTrimpSettings.GeneticistTimer.value = '0';
        else if(game.global.challengeActive == 'Electricity' || game.global.challengeActive == 'Mapocalypse') autoTrimpSettings.GeneticistTimer.value = '3.5';
        else if(game.global.challengeActive == 'Nom' || game.global.challengeActive == 'Toxicity') {
            
            if(getPageSetting('FarmWhenNomStacks7') && game.global.gridArray[99].nomStacks >= 5 && !game.global.mapsActive) {
                //if Improbability already has 5 nomstacks, do 30 antistacks.
                autoTrimpSettings.GeneticistTimer.value = '30';
                //actually buy them here because we can't wait.
                safeBuyJob('Geneticist',1+(autoTrimpSettings.GeneticistTimer.value - getBreedTime())*2);
            }
            else
                autoTrimpSettings.GeneticistTimer.value = '10';
        }
        else autoTrimpSettings.GeneticistTimer.value = '30';
    }
    var inDamageStance = game.upgrades.Dominance.done ? game.global.formation == 2 : game.global.formation == 0;
    var targetBreed = parseInt(getPageSetting('GeneticistTimer'));
    //if we need to hire geneticists
    //Don't hire geneticists if total breed time remaining is greater than our target breed time
    //Don't hire geneticists if we have already reached 30 anti stacks (put off further delay to next trimp group)
    if (targetBreed > getBreedTime() && !game.jobs.Geneticist.locked && targetBreed > getBreedTime(true) && (game.global.lastBreedTime/1000 + getBreedTime(true) < autoTrimpSettings.GeneticistTimer.value) && game.resources.trimps.soldiers > 0 && inDamageStance && !breedFire) {
        //insert 10% of total food limit here? or cost vs tribute?
        //if there's no free worker spots, fire a farmer
        if (fWorkers < 1 && canAffordJob('Geneticist', false)) {
            safeBuyJob('Farmer', -1);
        }
        //hire a geneticist
        safeBuyJob('Geneticist');
    }
    //if we need to speed up our breeding
    //if we have potency upgrades available, buy them. If geneticists are unlocked, or we aren't managing the breed timer, just buy them
    if ((targetBreed < getBreedTime() || !game.jobs.Geneticist.locked || !getPageSetting('ManageBreedtimer') || game.global.challengeActive == 'Watch') && game.upgrades.Potency.allowed > game.upgrades.Potency.done && canAffordTwoLevel('Potency') && getPageSetting('BuyUpgrades')) {
        buyUpgrade('Potency');
    }
    //otherwise, if we have some geneticists, start firing them
    else if ((targetBreed*1.02 < getBreedTime() || targetBreed*1.02 < getBreedTime(true)) && !game.jobs.Geneticist.locked && game.jobs.Geneticist.owned > 10) {
        safeBuyJob('Geneticist', -10);
        //debug('fired a geneticist');
        
    }
        //if our time remaining to full trimps is still too high, fire some jobs to get-er-done
        //needs option to toggle? advanced options?
    else if ((targetBreed < getBreedTime(true) || (game.resources.trimps.soldiers == 0 && getBreedTime(true) > 0.2)) && breedFire == false && (getPageSetting('BreedFire') || (game.global.world == 200)) && game.global.world > 10) {
        breedFire = true;
    }




    //reset breedFire once we have less than 2 seconds remaining
    if(getBreedTime(true) < 0.4) breedFire = false;

}


function autoRoboTrimp() {
    //exit if the cooldown is active, or we havent unlocked robotrimp.
    if (game.global.roboTrimpCooldown > 0 || !game.global.roboTrimpLevel) return;
    var robotrimpzone = parseInt(getPageSetting('AutoRoboTrimp'));
    //exit if we have the setting set to 0
    if (robotrimpzone == 0) return;
    //activate the button when we are above the cutoff zone, and we are out of cooldown (and the button is inactive)
    if (game.global.world >= robotrimpzone && !game.global.useShriek){
        magnetoShriek();
        debug("Activated Robotrimp Ability", '*podcast');
    }
}

//Version 3.6 Golden Upgrades
function autoGoldenUpgrades() {
    //get the numerical value of the selected index of the dropdown box
    var setting = document.getElementById('AutoGoldenUpgrades').selectedIndex;
    if (setting == 0) return;   //if disabled, exit.
    var num = getAvailableGoldenUpgrades();
    if (num == 0) return;       //if we have nothing to buy, exit.
    //buy one upgrade per loop.
    var what = ["Off","Helium", "Battle", "Void"]        
    buyGoldenUpgrade(what[setting]);        
}

////////////////////////////////////////
//Main Logic Loop///////////////////////
////////////////////////////////////////

setTimeout(delayStart, startupDelay);
function delayStart() {
    initializeAutoTrimps();
    setTimeout(delayStartAgain, startupDelay);
}
function delayStartAgain(){
    setInterval(mainLoop, runInterval);
    updateCustomButtons();
    document.getElementById('Prestige').value = autoTrimpSettings.PrestigeBackup.selected;
}

var stopScientistsatFarmers = 250000;
function mainLoop() {
    stopScientistsatFarmers = 250000;   //put this here so it reverts every cycle (in case we portal out of watch challenge)
    game.global.addonUser = true;
    game.global.autotrimps = {
        firstgiga: getPageSetting('FirstGigastation'),
        deltagiga: getPageSetting('DeltaGigastation')
    }    
    if(getPageSetting('PauseScript')) return;
    if(game.global.viewingUpgrades) return;
    //auto-close breaking the world textbox
    if(document.getElementById('tipTitle').innerHTML == 'The Improbability') cancelTooltip();
    //auto-close the corruption at zone 181 textbox
    if(document.getElementById('tipTitle').innerHTML == 'Corruption') cancelTooltip();
    //auto-close the Spire notification checkbox
    if(document.getElementById('tipTitle').innerHTML == 'Spire') cancelTooltip();
    setTitle();          //set the browser title
    setScienceNeeded();  //determine how much science is needed
    updateValueFields(); //refresh the UI

    if (getPageSetting('EasyMode')) easyMode(); //This needs a UI input
    // no easy mode no script.
    easyMode();
    if (getPageSetting('BuyUpgrades')) buyUpgrades();
    autoGoldenUpgrades();
    if (getPageSetting('BuyStorage')) buyStorage();
    if (getPageSetting('BuyBuildings')) buyBuildings();
    if (getPageSetting('BuyJobs')) buyJobs();
    if (getPageSetting('ManualGather')) manualLabor();
    if (getPageSetting('RunMapsWhenStuck')) autoMap();
    if (getPageSetting('GeneticistTimer') >= 0) manageGenes();
    if (autoTrimpSettings.AutoPortal.selected != "Off") autoPortal();
    if (getPageSetting('AutoHeirlooms2')) autoHeirlooms2();
    else if (getPageSetting('AutoHeirlooms')) autoHeirlooms();
    if (getPageSetting('TrapTrimps') && game.global.trapBuildAllowed && game.global.trapBuildToggled == false) toggleAutoTrap();
    if (getPageSetting('AutoRoboTrimp')) autoRoboTrimp();



    autoLevelEquipment();
    autoStance();
    if (getPageSetting('AutoFight')) {
        //Manually fight instead of using builtin auto-fight
        if (game.global.autoBattle) {
            if (!game.global.pauseFight) {
                pauseFight(); //Disable autofight
            }
        }
        lowLevelFight = game.resources.trimps.maxSoldiers < (game.resources.trimps.owned - game.resources.trimps.employed) * 0.5 && (game.resources.trimps.owned - game.resources.trimps.employed) > game.resources.trimps.realMax() * 0.1 && game.global.world < 5 && game.global.sLevel > 0;
        if (game.upgrades.Battle.done && !game.global.fighting && game.global.gridArray.length !== 0 && !game.global.preMapsActive && (game.resources.trimps.realMax() <= game.resources.trimps.owned + 1 || game.global.soldierHealth > 0 || lowLevelFight || game.global.challengeActive == 'Watch')) {
            fightManual();

            // debug('triggered fight');
        }
    }
}
function delayStart() {
    initializeAutoTrimps();
    setTimeout(delayStartAgain, 2000);
}
function delayStartAgain(){
    setInterval(mainLoop, runInterval);
    updateCustomButtons();
}
//Run the dynamic prestige changing script below.
if (getPageSetting('DynamicPrestige')) {
	prestigeChanging();
} else {
	autoTrimpSettings.Prestige.selected = document.getElementById('Prestige').value; //if we dont want to, just make sure the UI setting and the internal setting are aligned.
}

//Change prestiges as we go (thanks to Hider)
//The idea is like this. We will stick to Dagger until the end of the run, then we will slowly start grabbing prestiges, so we can hit the Prestige we want by the last zone.
//The keywords below "Dagadder" and "GambesOP" are merely representative of the minimum and maximum values. Toggling these on and off, the script will take care of itself, when set to min (Dagger) or max (Gambeson).
//In this way, we will achieve the desired "maxPrestige" setting (which would be somewhere in the middle, like Polearm) by the end of the run. (instead of like in the past where it was gotten from the beginning and wasting time in early maps.)

function prestigeChanging(){
    //find out the prestige we want to hit at the end.
    var maxPrestige = document.getElementById('Prestige').value;
    var maxPrestigeIndex = document.getElementById('Prestige').selectedIndex;
    
    //find out the last zone (checks custom autoportal and challenge's portal zone)
    var lastzone = checkSettings() - 1; //subtract 1 because the function adds 1 for its own purposes.
    
    //if we can't figure out lastzone (likely Helium per Hour AutoPortal setting), then use the last run's Portal zone.
    if (lastzone < 0)
        lastzone = game.global.lastPortal;
    
    //Lead Challenge: Farm twice as much during odd zones, due to even zones farming being deactivated (and cap at 10)
    if (game.global.challengeActive == "Lead" && maxPrestigeIndex <=5)
        maxPrestigeIndex *= 2;
    
    //Thanks to Hyppy for the following implementation involving mapstoFarm and zonestoFarm:
    //
    // Find total maps by multiplying the number of equipment pieces to acquire by the number of prestiges available by
    // the last zone. Subtract 1 from the number of prestiges available to account for the Scientist II bonus
    if (game.global.sLevel > 1)
        var totalMapsToFarm = (maxPrestigeIndex-2)*((lastzone/5)-1);
    else
        var totalMapsToFarm = (maxPrestigeIndex-2)*((lastzone/5)); 
    // For Scientist IV bonus, halve the required maps to farm
    if (game.global.sLevel > 3)
        totalMapsToFarm = Math.ceil(totalMapsToFarm/2);
  
    // For Lead runs, farm 10x the last odd 10 zones plus 5x for each necessary odd zone before.
    if (game.global.challengeActive == "Lead"){
        if (totalMapsToFarm > 50){
            var zonesToFarm = Math.ceil(10+((totalMapsToFarm-50)/5));
            // Add extra zones to account for dagger/shield that are found in the interim.
            zonesToFarm = Math.ceil(10+(((totalMapsToFarm+zonesToFarm/2.5)-50)/5)) 
        }
        else
            var zonesToFarm = Math.ceil(totalMapsToFarm/10);
    }
    // For non-Lead runs, farm 10x the last 10 zones plus 5x for each necessary zone before
    else if (totalMapsToFarm > 100){
        var zonesToFarm = Math.ceil(10+((totalMapsToFarm-100)/5));
        // Add extra zones to account for dagger/shield that are found in the interim.
        zonesToFarm = Math.ceil(10+(((totalMapsToFarm+zonesToFarm/2.5)-100)/5))
    }
    else
        var zonesToFarm = Math.ceil(totalMapsToFarm/10);
       
    //If we are in the zonesToFarm threshold and 10 or fewer zones before the last zone:
    if(game.global.world <= (lastzone-zonesToFarm) && game.global.world >= (lastzone-10) &&  game.global.lastClearedCell < 79){
        if (game.global.mapBonus < 9)
            autoTrimpSettings.Prestige.selected = "GambesOP";
        else if (game.global.mapBonus >= 9)
            autoTrimpSettings.Prestige.selected = "Dagadder";
    }
}

//If we are not within the last 10 zones but still need to farm, get 5 upgrades:
if(game.global.world <= (lastzone-zonesToFarm) && game.global.world <= (lastzone-10)  &&  game.global.lastClearedCell < 79){
    if (game.global.mapBonus < 4)
        autoTrimpSettings.Prestige.selected = "GambesOP";
    else if (game.global.mapBonus >= 4)
        autoTrimpSettings.Prestige.selected = "Dagadder";

    //If we are not in the prestige farming zone (the beginning of the run), use dagger:
    if (game.global.world < lastzone-zonesToFarm || game.global.mapBonus == 10)  
       autoTrimpSettings.Prestige.selected = "Dagadder";
}


//we copied message function because this was not able to be called from function debug() without getting a weird scope? related "cannot find function" error.
var lastmessagecount = 1;
function message2(messageString, type, lootIcon, extraClass) {
    var log = document.getElementById("log");
    var needsScroll = ((log.scrollTop + 10) > (log.scrollHeight - log.clientHeight));
    var displayType = (AutoTrimpsDebugTabVisible) ? "block" : "none";
    var prefix = "";
    if (lootIcon && lootIcon.charAt(0) == "*") {
        lootIcon = lootIcon.replace("*", "");
        prefix =  "icomoon icon-";
    }
    else prefix = "glyphicon glyphicon-";
    //add timestamp
    if (game.options.menu.timestamps.enabled){ 
        messageString = ((game.options.menu.timestamps.enabled == 1) ? getCurrentTime() : updatePortalTimer(true)) + " " + messageString; 
    }
    //add a suitable icon for "AutoTrimps"
    if (lootIcon) 
        messageString = "<span class=\"" + prefix + lootIcon + "\"></span> " + messageString;
    messageString = "<span class=\"glyphicon glyphicon-superscript\"></span> " + messageString;
    messageString = "<span class=\"icomoon icon-text-color\"></span>" + messageString;

    var add = "<span class='" + type + "Message message" +  " " + extraClass + "' style='display: " + displayType + "'>" + messageString + "</span>";
    var toChange = document.getElementsByClassName(type + "Message");    
    if (toChange.length > 1 && toChange[toChange.length-1].innerHTML.indexOf(messageString) > -1){
        var msgToChange = toChange[toChange.length-1].innerHTML;
        lastmessagecount++;
        //search string backwards for the occurrence of " x" (meaning x21 etc)
        var foundXat = msgToChange.lastIndexOf(" x");
        if (foundXat != -1){
            toChange[toChange.length-1].innerHTML = msgToChange.slice(0,foundXat);  //and slice it out.
        }
        //so we can add a new number in.
        toChange[toChange.length-1].innerHTML += " x" + lastmessagecount;
    }
    else {
        lastmessagecount =1;
        log.innerHTML += add;
    }
    if (needsScroll) log.scrollTop = log.scrollHeight;
    trimMessages(type);
}

//HTML For adding a 5th tab to the message window
//
var ATbutton = document.createElement("button");
ATbutton.innerHTML = 'AutoTrimps';
ATbutton.setAttribute('id', 'AutoTrimpsFilter');
ATbutton.setAttribute('type', 'button');
ATbutton.setAttribute('onclick', "filterMessage2('AutoTrimps')");
ATbutton.setAttribute('class', "btn btn-success logFlt");
//
var tab = document.createElement("DIV");
tab.setAttribute('class', 'btn-group');
tab.setAttribute('role', 'group');
tab.appendChild(ATbutton);
document.getElementById('logBtnGroup').appendChild(tab);
//Toggle settings button & filter messages accordingly.
function filterMessage2(what){
    var log = document.getElementById("log");

    displayed = (AutoTrimpsDebugTabVisible) ? false : true;
    AutoTrimpsDebugTabVisible = displayed;

    var toChange = document.getElementsByClassName(what + "Message");
    var btnText = (displayed) ? what : what + " off";
    var btnElem = document.getElementById(what + "Filter");
    btnElem.innerHTML = btnText;
    btnElem.className = "";
    btnElem.className = getTabClass(displayed);
    displayed = (displayed) ? "block" : "none";
    for (var x = 0; x < toChange.length; x++){
        toChange[x].style.display = displayed;
    }
    log.scrollTop = log.scrollHeight;
}

var hrlmProtBtn1 = document.createElement("DIV");
hrlmProtBtn1.setAttribute('class', 'noselect heirloomBtnActive heirBtn');
hrlmProtBtn1.setAttribute('onclick', 'protectHeirloom(this,true)');
hrlmProtBtn1.innerHTML = 'Protect/Unprotect';  //since we cannot detect the selected heirloom on load, ambiguous name
hrlmProtBtn1.id='protectHeirloomBTN1';
var hrlmProtBtn2 = document.createElement("DIV");
hrlmProtBtn2.setAttribute('class', 'noselect heirloomBtnActive heirBtn');
hrlmProtBtn2.setAttribute('onclick', 'protectHeirloom(this,true)');
hrlmProtBtn2.innerHTML = 'Protect/Unprotect';
hrlmProtBtn2.id='protectHeirloomBTN2';
var hrlmProtBtn3 = document.createElement("DIV");
hrlmProtBtn3.setAttribute('class', 'noselect heirloomBtnActive heirBtn');
hrlmProtBtn3.setAttribute('onclick', 'protectHeirloom(this,true)');
hrlmProtBtn3.innerHTML = 'Protect/Unprotect';
hrlmProtBtn3.id='protectHeirloomBTN3';
document.getElementById('equippedHeirloomsBtnGroup').appendChild(hrlmProtBtn1);
document.getElementById('carriedHeirloomsBtnGroup').appendChild(hrlmProtBtn2);
document.getElementById('extraHeirloomsBtnGroup').appendChild(hrlmProtBtn3);


function protectHeirloom(element,modify){
    var selheirloom = game.global.selectedHeirloom;  //[number,location]
    var heirloomlocation = selheirloom[1];
    var heirloom = game.global[heirloomlocation];
    if (selheirloom[0] != -1)
        var heirloom = heirloom[selheirloom[0]];
    //hard way ^^, easy way>>
    //var heirloom = getSelectedHeirloom();
    if (modify)    //sent by onclick of protect button, to toggle the state.
        heirloom.protected = !heirloom.protected;
        
    if (!element) { //then we came from newSelectHeirloom
        if (heirloomlocation.includes("Equipped"))
            element = document.getElementById('protectHeirloomBTN1');
        else if (heirloomlocation == "heirloomsCarried")
            element = document.getElementById('protectHeirloomBTN2');
        else if (heirloomlocation == "heirloomsExtra")
            element = document.getElementById('protectHeirloomBTN3');
    }
    if (element)
        element.innerHTML = heirloom.protected ? 'UnProtect' : 'Protect';
}

//wrapper for selectHeirloom, to handle the protect button
function newSelectHeirloom(number, location, elem){
    selectHeirloom(number, location, elem);
    protectHeirloom();
}

//replacement function that inserts a new onclick action into the heirloom icons so it can populate the proper Protect icon. (yes this is the best way to do it.)
function generateHeirloomIcon(heirloom, location, number){
    if (typeof heirloom.name === 'undefined') return "<span class='icomoon icon-sad3'></span>";
    var icon = (heirloom.type == "Shield") ? 'icomoon icon-shield3' : 'glyphicon glyphicon-grain';
    var html = '<span class="heirloomThing heirloomRare' + heirloom.rarity;
    if (location == "Equipped") html += ' equipped';
    var locText = "";
    if (location == "Equipped") locText += '-1,\'' + heirloom.type + 'Equipped\'';
    else locText += number + ', \'heirlooms' + location + '\''; 
    html += '" onmouseover="tooltip(\'Heirloom\', null, event, null, ' + locText + ')" onmouseout="tooltip(\'hide\')" onclick="newSelectHeirloom(';
    html += locText + ', this)"> <span class="' + icon + '"></span></span>';
    return html;
}
