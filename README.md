# 🔁 JavaScript Event Loop Visualizer

An interactive visualization of the JavaScript Event Loop that demonstrates how the Call Stack, Web APIs, Microtask Queue, and Task Queue work together to execute synchronous and asynchronous code.

This project turns one of JavaScript’s most confusing concepts into something you can see and understand.

---

## 🚀 Live Demo

(Add your deployed link here)

https://your-username.github.io/event-loop-visualizer

---

## 🧠 Why this project?

Many developers can write async code but struggle to explain:
- Why `Promise.then()` runs before `setTimeout(0)`
- How microtasks differ from macrotasks
- Why blocking the call stack freezes the UI

This visualizer makes the execution order explicit and intuitive.

---

## ✨ Features

- Call Stack visualization (push / pop)
- Web APIs simulation (`setTimeout`, async operations)
- Microtask Queue (Promises)
- Task / Callback Queue (Timers, events)
- Event Loop cycle animation
- Play / Pause / Step execution
- Realistic execution order matching browser behavior

---

## 🧩 Example Code (Visualized)

```js
console.log("start");

setTimeout(() => {
  console.log("timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("end");
