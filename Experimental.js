

//make things better
/*
document.getElementById("bottomRow").style = "background: rgb(255, 128, 255);";
document.getElementById("topRow").style = "background: rgb(255, 128, 255);";
document.getElementById("body").style = "background: rgb(255, 128, 255);";

document.getElementById("innerWrapper").style = "background: rgb(0, 0, 0);";
document.getElementById("battleContainer").style = "background: rgb(255, 128, 255);";
document.getElementById("gridContainer").style = "background: rgb(255, 128, 255);";
document.getElementById("science").style = "background: rgb(255, 128, 255);";
document.getElementById("selectedMapContainer").style = "background: rgb(255, 128, 255);";
document.getElementById("helium").style = "background: rgb(255, 128, 255);";
document.getElementById("achievementWrapper").style = "background: rgb(255, 128, 255);";
document.getElementById("buyContainer").style = "background: rgb(255, 128, 255);";
document.getElementById("logContainer").style = "background: rgb(255, 128, 255);";
document.getElementById("queueContainer").style = "background: rgb(255, 128, 255);";
document.getElementById("wood").style = "background: rgb(255, 128, 255);";
document.getElementById("fragments").style = "background: rgb(255, 128, 255);";
document.getElementById("heirloomWrapper").style = "background: rgb(255, 128, 255);";
document.getElementById("food").style = "background: rgb(255, 128, 255);";
document.getElementById("metal").style = "background: rgb(255, 128, 255);";
document.getElementById("gems").style = "background: rgb(255, 128, 255);";
document.getElementById("trimps").style = "background: rgb(255, 128, 255);";
*/
document.getElementById("innerWrapper").style = "background: rgb(255, 128, 255);";
document.getElementById("battleContainer").style = "background: rgb(0, 0, 0);";
document.getElementById("gridContainer").style = "background: rgb(0, 0, 0);";
document.getElementById("science").style = "background: rgb(0, 0, 0);";
document.getElementById("selectedMapContainer").style = "background: rgb(0, 0, 0);";
document.getElementById("helium").style = "background: rgb(0, 0, 0);";
document.getElementById("achievementWrapper").style = "background: rgb(0, 0, 0);";
document.getElementById("buyContainer").style = "background: rgb(0, 0, 0);";
document.getElementById("logContainer").style = "background: rgb(0, 0, 0);";
document.getElementById("queueContainer").style = "background: rgb(0, 0, 0);";
document.getElementById("wood").style = "background: rgb(0, 0, 0);";
document.getElementById("fragments").style = "background: rgb(0, 0, 0);";
document.getElementById("heirloomWrapper").style = "rgb(0, 0, 0);";
document.getElementById("food").style = "background: rgb(0, 0, 0);";
document.getElementById("metal").style = "background: rgb(0, 0, 0);";
document.getElementById("gems").style = "background: rgb(0, 0, 0);";
document.getElementById("trimps").style = "background: rgb(0, 0, 0);";

//document.getElementById("battleContainer").style =  "width: 20%;" id="pic"><img style="max-height: 13vw;" src="https://catbox.moe/pictures/qts/1468421480662.png"></div><div
document.getElementById("science").insertAdjacentHTML('afterbegin', '<div id="pic"><img style="max-height: 2vw; float: left; background;" src="http://klubznaniy.ru/%D0%B1%D0%B8%D0%BE%20%D0%B5%D0%B3%D1%8D%2015.png"></div><div');
document.getElementById("food").insertAdjacentHTML('afterbegin', '<div id="pic"><img style="max-height: 3vw; float: left; background;" src="http://www.iconsplace.com/icons/preview/white/cooking-pot-256.png"></div><div');
document.getElementById("wood").insertAdjacentHTML('afterbegin', '<div id="pic"><img style="max-height: 4vw; float: left; background;" src="https://www.drevomorava.cz/ftp/images/4.png"></div><div');
//document.getElementById("metal").insertAdjacentHTML('afterbegin', '<div id="pic"><img style="max-height: 2vw; float: left; background;" src="http://game-icons.net/icons/lorc/originals/svg/anvil-impact.svg"></div><div');
document.getElementById("trimps").insertAdjacentHTML('afterbegin', '<div id="pic"><img style="max-height: 3.5vw; float: left; background;" src="http://www.freeiconspng.com/uploads/building-city-town-icon-png--3.png"></div><div');
//document.getElementById("queueContainer").insertAdjacentHTML('beforeend', '<div id="pic"><img style="max-height: 2vw; float: left; background;" src="https://cdn1.iconfinder.com/data/icons/construction-and-renovation/80/Construction_renovation-12-512.png"></div><div');

//beforbegin //afterbegin //beforeend //afterend

//setup talk button
document.getElementById("buildingsQueue").style = "width: 75%; float: left;";
document.getElementById("queueContainer").insertAdjacentHTML('beforeend', '<div style="color: rgb(255, 255, 255); font-size: 1.2em; text-align: center; width: 25%; float: right; padding-left: 1.6vw;"><div id="buildingsCollectBtn" class="workBtn pointer noselect" onclick="talk()" style="background: rgb(153, 153, 77) none repeat scroll 0% 0%; margin-top: 0.5vh;">HiderTrimp</div></div>');

//setup talk window
document.getElementById("boneWrapper").insertAdjacentHTML('beforebegin', '<div id="autotrimp" style="position: absolute; background: rgb(0, 0, 0) none repeat scroll 0% 0%; border: 2px solid rgb(0, 0, 0); width: 64vw; margin: 6vh 18vw; z-index: 10000000; text-align: center; font-size: 1.3vw; display: none; padding: 0.2vw; color: rgb(255, 255, 255);"><div style="width: 100%; display: table; border-spacing: 0.3vw;" id="autotrimp0"><div style="display: table-row;" id="autorow"><div style="border: 1px solid white; background: rgb(153, 153, 77) none repeat scroll 0% 0%; display: table-cell; width: 20%;" id="pic"><img style="max-height: 13vw;" src="https://cloud.githubusercontent.com/assets/14081390/9893516/d9db4782-5bde-11e5-8791-91638bb6aaae.jpg"></div><div id="qs" style="border: 1px solid white; background: rgb(153, 153, 77) none repeat scroll 0% 0%; display: table-cell; width: 60%; vertical-align: top; padding: 0.5%;"><p style="text-align: left; font-size: 0.9em;" id="q">This is the question.</p><p></p><p style="font-size: 0.8em;"><a style="color: rgb(128, 0, 0); text-decoration: underline;" href="#" id="1" onclick="alert(\'clicked\')">Answer 1</a></p><p style="font-size: 0.8em;"><a style="color: rgb(128, 0, 0); text-decoration: underline;" href="#" id="2" onclick="alert(\'clicked\')">Answer 2</a></p><p style="font-size: 0.8em;"><a style="color: rgb(128, 0, 0); text-decoration: underline;" href="#" id="3" onclick="alert(\'clicked\')"></a></p></div><div id="button" style="display: table-cell; width: 20%; background: rgb(0, 0, 0) none repeat scroll 0% 0%; vertical-align: top;"><div class="boneBtn dangerColor pointer noselect" onclick="document.getElementById(\'autotrimp\').style.display = \'none\'">Close</div></div></div></div></div>');
document.getElementById("autotrimp").insertAdjacentHTML('beforeend', '<div style="width: 100%; display: table; border-spacing:0.3vw;" id="genBTCTrimp"><div style="border: 1px solid white; background: rgb(0, 0, 0) none repeat scroll 0% 0%; width: 100%; padding: .3vw;" id="autosettings0"> <a href="https://discord.gg/0VbWe0dxB9kIfV2C" target="_blank">Join the chat</div></div>');
//document.getElementById("autotrimp").insertAdjacentHTML('beforeend', '<div style="width: 100%; display: table; border-spacing:0.3vw;" id="autosettings"><div style="border: 1px solid white; background: rgb(84, 83, 83) none repeat scroll 0% 0%; width: 100%; padding: .3vw;" id="autosettings0">Settings</div></div>');

//Add new css rule
//document.styleSheets[2].insertRule(".settingBtn3 {background-color: #337AB7;}", 84);

var getPercent = 0;
var reactPercent = 0;
function getStats() {
    reactPercent = 0;
    getPercent = (game.stats.heliumHour.value()/game.global.totalHeliumEarned)*100;
    if (getPercent.toFixed() > 0.53) {
        reactPercent = "GRATZ, A NEW WORLD RECORD!";
    } else if (getPercent.toFixed() > 0.52) {
        reactPercent = "Only a few ever got this far.";
    } else if (getPercent.toFixed() > 0.50) {
        reactPercent = "it's not shameful to give up.";
    } else if (getPercent.toFixed() > 0.40) {
        reactPercent = "It's the final push.";
    } else if (getPercent.toFixed() > 0.30) {
        reactPercent = "Keep it comming...";
    } else if (getPercent.toFixed() <= 0.30) {
        reactPercent = "Did you just portal?";
    }
    return getPercent.toFixed() + '%';
}

//setup convo array
var conversation = [];
conversation[0] = {Q:"HiThere.",R1:"My name is Minty.",L1:1,R2:"Don't take my Helium.",L2:2,R3:"Tell me what to do.",L3:3};
conversation[1] = {Q:"Thanks for the Helium.",R1:" ε(´סּ︵סּ`)з ",L1:0,};
conversation[2] = {Q:"OK.",R1:"Again.",L1:0,R2:"How am i doing so far?",L2:5,R3:"What can go wrong in the Don't Touch Zone?",L3:4};
conversation[3] = {Q:"Please set Auto Portal to Helium Per Hour and set First Gigastation to 40 (or less). Make sure that Min Warpstation is set to two (or less). And notice that some of the Void Maps will be done before your Void Maps settings, so please use it and set the Void Maps to no more then 10 Zones before you predict that you will Auto Portal. Have a nice AutoAutoTrimps experience. ۜ \\(סּںסּَ` )/ۜ ",R1:" óÔÔò ʕ·͡ᴥ·ʔ óÔÔò ",L1:0};
conversation[4] = {Q:"You.",R1:"Meh.",L1:0};
conversation[5] = {Q:"Your corrent Helium per hour gain is " + getStats() + "" +reactPercent,R1:"Cool.",L1:0,R2:"What can go wrong in the Don't Touch Zone?",L2:4,R3:"beam me up scotty.",L3:6};
conversation[6] = {Q:"There's an intelligent life down here.",R1:"Lies.",L1:7};
conversation[7] = {Q:"Never admit!",R1:"Scotty!!.",L1:0};
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
  document.getElementById("autotrimp").style.display = "block";
}
