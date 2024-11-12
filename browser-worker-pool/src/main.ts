import { chunkNumber } from './lib/chunkNumber';
import { createWorkerUrl } from './lib/createWorkerUrl';
import { WorkerPool } from './lib/WorkerPool';

const countInCircle = (epoch: number): number => {
  let inCircles = 0;

  for (let i = 0; i < epoch; i++) {
    if (Math.hypot(Math.random(), Math.random()) < 1) {
      inCircles++;
    }
  }

  return inCircles;
};

const epoch = 1e8;

console.time('Single Thread');
console.log((countInCircle(epoch) * 4) / epoch);
console.timeEnd('Single Thread');

const thread = navigator.hardwareConcurrency;
console.time(`${thread} Thread`);

const workerUrl = createWorkerUrl(countInCircle);
const results: number[] = [];
const workerPool = new WorkerPool<ReturnType<typeof countInCircle>>(
  workerUrl,
  (result) => {
    results.push(result);
  },
  () => {
    const sum = results.reduce((a, b) => a + b, 0);
    console.log((sum * 4) / epoch);
    console.timeEnd(`${thread} Thread`);
  }
);

for (const num of chunkNumber(epoch, thread)) {
  workerPool.add(num);
}

workerPool.fix();
