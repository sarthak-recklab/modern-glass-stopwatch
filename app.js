/* Modern Glass Stopwatch - Vanilla JS
 * Millisecond precision, start/pause/lap/reset.
 */
(function () {
  "use strict";

  var displayEl = document.getElementById("display");
  var startBtn = document.getElementById("startBtn");
  var pauseBtn = document.getElementById("pauseBtn");
  var lapBtn = document.getElementById("lapBtn");
  var resetBtn = document.getElementById("resetBtn");
  var lapList = document.getElementById("lapList");
  var lapsEmpty = document.getElementById("lapsEmpty");

  var running = false;
  var elapsed = 0; // accumulated ms while paused
  var startTimestamp = 0; // performance.now() at last start
  var rafId = null;
  var lastLapTime = 0;
  var lapCount = 0;

  function now() {
    return performance.now();
  }

  function currentElapsed() {
    return running ? elapsed + (now() - startTimestamp) : elapsed;
  }

  function format(ms) {
    if (ms < 0) ms = 0;
    var totalMs = Math.floor(ms);
    var minutes = Math.floor(totalMs / 60000);
    var seconds = Math.floor((totalMs % 60000) / 1000);
    var millis = totalMs % 1000;

    return pad(minutes) + ":" + pad(seconds) + "." + pad(millis, 3);
  }

  function pad(value, size) {
    var width = size || 2;
    var str = String(value);
    while (str.length < width) {
      str = "0" + str;
    }
    return str;
  }

  function render() {
    var ms = currentElapsed();
    displayEl.textContent = format(ms);
    displayEl.setAttribute("datetime", "PT" + (ms / 1000).toFixed(3) + "S");
    if (running) {
      rafId = requestAnimationFrame(render);
    }
  }

  function setControls() {
    startBtn.disabled = running;
    startBtn.textContent = elapsed > 0 && !running ? "Resume" : "Start";
    pauseBtn.disabled = !running;
    lapBtn.disabled = !running;
    resetBtn.disabled = running ? false : elapsed === 0;
  }

  function start() {
    if (running) return;
    startTimestamp = now();
    running = true;
    setControls();
    rafId = requestAnimationFrame(render);
  }

  function pause() {
    if (!running) return;
    elapsed = currentElapsed();
    running = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    displayEl.textContent = format(elapsed);
    setControls();
  }

  function reset() {
    running = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    elapsed = 0;
    lastLapTime = 0;
    lapCount = 0;
    displayEl.textContent = format(0);
    lapList.innerHTML = "";
    lapsEmpty.hidden = false;
    setControls();
  }

  function recordLap() {
    if (!running) return;
    var total = currentElapsed();
    var split = total - lastLapTime;
    lastLapTime = total;
    lapCount += 1;

    var item = document.createElement("li");
    item.className = "lap";

    var label = document.createElement("span");
    label.className = "lap__label";
    label.textContent = "Lap " + lapCount;

    var time = document.createElement("span");
    time.className = "lap__time";
    time.textContent = format(split);

    item.appendChild(label);
    item.appendChild(time);

    lapList.insertBefore(item, lapList.firstChild);
    lapsEmpty.hidden = true;
  }

  startBtn.addEventListener("click", start);
  pauseBtn.addEventListener("click", pause);
  resetBtn.addEventListener("click", reset);
  lapBtn.addEventListener("click", recordLap);

  document.addEventListener("keydown", function (event) {
    if (event.target && /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) {
      return;
    }
    if (event.code === "Space") {
      event.preventDefault();
      if (running) {
        pause();
      } else {
        start();
      }
    } else if (event.key === "l" || event.key === "L") {
      recordLap();
    } else if (event.key === "r" || event.key === "R") {
      reset();
    }
  });

  reset();
})();
