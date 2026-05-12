var steps = [];
var currentStep = 0;
var timer;

function resetAll() {
  clearInterval(timer);
  steps = [];
  currentStep = 0;
  document.getElementById("callstack").innerHTML = "";
  document.getElementById("microtask").innerHTML = "";
  document.getElementById("taskqueue").innerHTML = "";
  document.getElementById("console-output").innerHTML = "";
}

function renderStep(step) {
  var cs = document.getElementById("callstack");
  var mq = document.getElementById("microtask");
  var tq = document.getElementById("taskqueue");
  var co = document.getElementById("console-output");

  cs.innerHTML = "";
  mq.innerHTML = "";
  tq.innerHTML = "";

  for (var i = 0; i < step.callstack.length; i++) {
    var div = document.createElement("div");
    div.className = "item";
    div.innerText = step.callstack[i];
    cs.appendChild(div);
  }

  for (var i = 0; i < step.microtask.length; i++) {
    var div = document.createElement("div");
    div.className = "item";
    div.innerText = step.microtask[i];
    mq.appendChild(div);
  }

  for (var i = 0; i < step.taskqueue.length; i++) {
    var div = document.createElement("div");
    div.className = "item";
    div.innerText = step.taskqueue[i];
    tq.appendChild(div);
  }

  if (step.log != null) {
    var line = document.createElement("div");
    line.innerText = "> " + step.log;
    co.appendChild(line);
  }
}

function buildSteps(code) {
  var lines = code.split("\n");
  var callstack = [];
  var microtask = [];
  var taskqueue = [];

  function save(log) {
    steps.push({
      callstack: callstack.slice(),
      microtask: microtask.slice(),
      taskqueue: taskqueue.slice(),
      log: log != undefined ? log : null
    });
  }

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line == "" || line.startsWith("//")) continue;

    if (line.startsWith("console.log")) {
      var match = line.match(/console\.log\(["']?(.+?)["']?\)/);
      var val = match ? match[1] : "...";
      callstack.push("console.log(" + val + ")");
      save(val);
      callstack.pop();
      save();

    } else if (line.startsWith("setTimeout")) {
      var match = line.match(/["'](.+?)["'].*?,\s*(\d+)/);
      var label = match ? match[1] : "callback";
      var ms = match ? match[2] : "0";
      callstack.push("setTimeout");
      save();
      callstack.pop();
      taskqueue.push("cb: " + label + " (" + ms + "ms)");
      save();

    } else if (line.startsWith("Promise.resolve")) {
      var match = line.match(/\.then\(["'](.+?)["']/);
      var label = match ? match[1] : "then callback";
      callstack.push("Promise.resolve().then(...)");
      save();
      callstack.pop();
      microtask.push("then: " + label);
      save();

    } else {
      var label = line.length > 40 ? line.slice(0, 40) + "..." : line;
      callstack.push(label);
      save();
      callstack.pop();
      save();
    }
  }

  while (microtask.length > 0) {
    var fn = microtask.shift();
    callstack.push(fn);
    save(fn);
    callstack.pop();
    save();
  }

  while (taskqueue.length > 0) {
    var fn = taskqueue.shift();
    callstack.push(fn);
    save(fn);
    callstack.pop();
    save();
  }
}

function runCode() {
  resetAll();
  var code = document.getElementById("code").value;
  if (code.trim() == "") return;

  buildSteps(code);

  timer = setInterval(function() {
    if (currentStep >= steps.length) {
      clearInterval(timer);
      return;
    }
    renderStep(steps[currentStep]);
    currentStep++;
  }, 800);
}
