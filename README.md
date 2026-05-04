# JavaScript Event Loop Simulator

This project helps beginners understand how JavaScript works behind the scenes by visualizing the event loop.

## Overview

The JavaScript Event Loop Simulator demonstrates how synchronous and asynchronous code is executed. You can write your own code and observe how different parts of the event loop interact during execution.

## Features

* Run custom JavaScript code
* Visual representation of:

  * Call Stack
  * Microtask Queue (Promises)
  * Task Queue (setTimeout)
* Console output display
* Shows execution order and asynchronous behavior

## Concepts Covered

* Call Stack execution
* Event Loop working
* Difference between microtasks and macrotasks
* Execution order of asynchronous code
* Basic understanding of how browsers handle JavaScript

## How It Works

* `console.log` is overridden to display output in the UI
* `setTimeout` is modified to simulate the task queue
* `Promise.then` is modified to simulate the microtask queue
* User code is executed using `eval()`
* The UI updates to reflect how tasks move through different stages

## Tech Stack

* HTML
* CSS
* JavaScript

## Usage

1. Write or modify code in the editor
2. Click the **Run** button
3. Observe:

   * Console output
   * Call Stack updates
   * Queue behavior

## Note

This is a simplified simulation for learning purposes and does not fully replicate the actual JavaScript engine.

## Goal

To provide a clear and practical understanding of the JavaScript Event Loop through visualization rather than theory.

