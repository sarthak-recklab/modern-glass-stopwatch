(function(){
"use strict";
var displayEl=document.getElementById("display");
var displayMsEl=document.getElementById("displayMs");
var startBtn=document.getElementById("startBtn");
var pauseBtn=document.getElementById("pauseBtn");
var lapBtn=document.getElementById("lapBtn");
var resetBtn=document.getElementById("resetBtn");
var lapList=document.getElementById("lapList");
var lapEmpty=document.getElementById("lapEmpty");
var startTime=0,elapsed=0,rafId=null,running=false,lastLapElapsed=0,lapCount=0;
function pad(n,len){return String(n).padStart(len||2,"0")}
function format(ms){var h=Math.floor(ms/3600000);var m=Math.floor((ms%3600000)/60000);var s=Math.floor((ms%60000)/1000);var cs=Math.floor((ms%1000)/10);return{main:pad(h)+":"+pad(m)+":"+pad(s),ms:"."+ pad(cs)}}
function render(ms){var o=format(ms);displayEl.textContent=o.main;displayMsEl.textContent=o.ms}
function tick(){elapsed=performance.now()-startTime;render(elapsed);rafId=requestAnimationFrame(tick)}
function start(){if(running)return;running=true;startTime=performance.now()-elapsed;rafId=requestAnimationFrame(tick);startBtn.disabled=true;pauseBtn.disabled=false;lapBtn.disabled=false}
function pause(){if(!running)return;running=false;if(rafId)cancelAnimationFrame(rafId);rafId=null;elapsed=performance.now()-startTime;render(elapsed);startBtn.disabled=false;pauseBtn.disabled=true}
function reset(){running=false;if(rafId)cancelAnimationFrame(rafId);rafId=null;startTime=0;elapsed=0;lastLapElapsed=0;lapCount=0;render(0);lapList.innerHTML="";lapEmpty.classList.remove("is-hidden");startBtn.disabled=false;pauseBtn.disabled=true;lapBtn.disabled=true}
function recordLap(){if(!running&&elapsed===0)return;lapCount+=1;var split=elapsed-lastLapElapsed;lastLapElapsed=elapsed;var li=document.createElement("li");li.className="lap";var idx=document.createElement("span");idx.className="lap__index";idx.textContent="Lap "+lapCount;var splitEl=document.createElement("span");splitEl.className="lap__split";splitEl.textContent="+"+format(split).main+format(split).ms;var totalEl=document.createElement("span");totalEl.className="lap__total";totalEl.textContent=format(elapsed).main+format(elapsed).ms;li.appendChild(idx);li.appendChild(splitEl);li.appendChild(totalEl);lapList.insertBefore(li,lapList.firstChild);lapEmpty.classList.add("is-hidden")}
startBtn.addEventListener("click",start);pauseBtn.addEventListener("click",pause);lapBtn.addEventListener("click",recordLap);resetBtn.addEventListener("click",reset);
document.addEventListener("keydown",function(e){if(e.code==="Space"){e.preventDefault();running?pause():start()}else if(e.key.toLowerCase()==="l"){if(!lapBtn.disabled)recordLap()}else if(e.key.toLowerCase()==="r"){reset()}});
render(0)})();