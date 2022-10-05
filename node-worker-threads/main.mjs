import { Worker } from 'worker_threads';
import os from 'os';

console.time('Timer');

const epoch = 1e8;
const thread = os.cpus().length;
if (epoch % thread) console.warn('epoch not divisible by thread');

const workers = Array(thread)
  .fill('')
  .map(() => new Worker('./worker.mjs'));

for (const worker of workers) {
  worker.postMessage({ epoch: (epoch / thread) | 0 });
}

const inCircles = (
  await Promise.all(
    workers.map(
      (worker) =>
        new Promise((resolve) => {
          worker.on('message', ({ inCircles }) => {
            resolve(inCircles);
          });
        })
    )
  )
).reduce((a, b) => a + b);

console.log((inCircles * 4) / epoch);

console.timeEnd('Timer');
