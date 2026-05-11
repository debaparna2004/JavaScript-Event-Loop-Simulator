function clearUI() {
  document.getElementById("output").innerHTML = "";
  document.getElementById("callStack").innerHTML = "";
  document.getElementById("microtaskQueue").innerHTML = "";
  document.getElementById("taskQueue").innerHTML = "";
}

function log(msg) {
  const out = document.getElementById("output");
  out.innerHTML += msg + "<br>";
}

function push(container, text) {
  const el = document.createElement("div");
  el.className = "item";
  el.innerText = text;
  document.getElementById(container).appendChild(el);
}

function runSimulation() {
  clearUI();

  const code = document.getElementById("code").value;

  // Fake event loop tracking
  const originalLog = console.log;
  console.log = function(msg) {
    log(msg);
  };

  // Track call stack (very basic)
  push("callStack", "global()");

  // Monkey patch setTimeout
  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function(cb, time) {
    push("taskQueue", "setTimeout callback");
    return originalSetTimeout(() => {
      push("callStack", "task()");
      cb();
    }, time);
  };

  // Monkey patch Promise.then
  const originalThen = Promise.prototype.then;
  Promise.prototype.then = function(cb) {
    push("microtaskQueue", "promise callback");
    return originalThen.call(this, () => {
      push("callStack", "microtask()");
      cb();
    });
  };

  try {
    eval(code);
  } catch (e) {
    log("Error: " + e.message);
  }

  // Restore original functions so the browser doesn't break
  console.log = originalLog;
  window.setTimeout = originalSetTimeout;
  Promise.prototype.then = originalThen;
}
