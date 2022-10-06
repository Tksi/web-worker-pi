import { parentPort } from "worker_threads";
let sum = 0;

parentPort.addEventListener("message", ({ data: { min, max } }) => {
  console.log({ min, max });
  for (let i = min + 1; i <= max; i++) {
    sum += 1 / i ** 2;
  }
  parentPort.postMessage(sum);
});
