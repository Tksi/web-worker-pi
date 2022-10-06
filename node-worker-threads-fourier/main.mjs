import { Worker } from "worker_threads";
import os from "os";

console.time("Timer");

let result = 0;
const max = 1e10;
const thread = os.cpus().length;
const workers = Array(thread)
  .fill("")
  .map(() => new Worker(new URL("./worker.mjs", import.meta.url)));

workers.forEach((worker, i) => {
  worker.postMessage({
    max: Math.trunc(max / thread) * (i + 1),
    min: Math.trunc(max / thread) * i,
  });
});

const sum = await Promise.all(
  workers.map(
    (worker) =>
      new Promise((resolve) => {
        worker.on("message", (message) => {
          resolve(message);
        });
      })
  )
);

console.log(Math.sqrt(sum.reduce((a, b) => a + b, 0) * 6));
console.timeEnd("Timer");
