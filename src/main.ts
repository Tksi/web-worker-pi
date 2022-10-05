import './style.css';
console.time('Timer');
const worker = new Worker(new URL('./worker.ts', import.meta.url));

const epoch = 1e8;

worker.postMessage({ epoch: epoch });

const inCircles = new Promise((resolve) => {
  worker.addEventListener('message', ({ data: { inCircles } }) => {
    resolve(inCircles);
  });
});

console.log(await inCircles);
console.timeEnd('Timer');
