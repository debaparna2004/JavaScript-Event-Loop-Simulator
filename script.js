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

function addItems(containerId, arr) {
  var container = document.getElementById(containerId);

  container.innerHTML = "";

  for (var i = 0; i < arr.length; i++) {
    var div = document.createElement("div");

    div.className = "item";
    div.innerText = arr[i];

    container.appendChild(div);
  }
}

function renderStep(step) {

  addItems("callstack", step.callstack);
  addItems("microtask", step.microtask);
  addItems("taskqueue", step.taskqueue);

  if (step.log != null) {
    var line = document.createElement("div");

    line.innerText = "> " + step.log;

    document.getElementById("console-output").appendChild(line);
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
      log: log || null
    });
  }

  for (var i = 0; i < lines.length; i++) {

    var line = lines[i].trim();

    if (line == "" || line.startsWith("//")) {
      continue;
    }

    if (line.startsWith("console.log")) {

      var match = line.match(/console\.log\(["']?(.+?)["']?\)/);

      var value = match ? match[1] : "...";

      callstack.push("console.log(" + value + ")");

      save(value);

      callstack.pop();

      save();

    }

    else if (line.startsWith("setTimeout")) {

      var match = line.match(/["'](.+?)["'].*?,\s*(\d+)/);

      var label = match ? match[1] : "callback";
      var time = match ? match[2] : "0";

      callstack.push("setTimeout");

      save();

      callstack.pop();

      taskqueue.push("cb: " + label + " (" + time + "ms)");

      save();
    }

    else if (line.startsWith("Promise.resolve")) {

      var match = line.match(/\.then\(["'](.+?)["']/);

      var label = match ? match[1] : "then callback";

      callstack.push("Promise.then");

      save();

      callstack.pop();

      microtask.push("then: " + label);

      save();
    }

    else {

      var label = line;

      if (line.length > 40) {
        label = line.slice(0, 40) + "...";
      }

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

  if (code.trim() == "") {
    return;
  }

  buildSteps(code);

  timer = setInterval(function () {

    if (currentStep >= steps.length) {

      clearInterval(timer);

      return;
    }

    renderStep(steps[currentStep]);

    currentStep++;

  }, 800);
}