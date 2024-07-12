import { createWorker } from './lib/createWorker';
import { chunkNumber } from './lib/chunkNumber';

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
await Promise.all(
  chunkNumber(epoch, thread).map((eachEpoch) =>
    createWorker(countInCircle)(eachEpoch)
  )
).then((results) => {
  const sum = results.reduce((a, b) => a + b);
  console.log((sum * 4) / epoch);
});
console.timeEnd(`${thread} Thread`);
