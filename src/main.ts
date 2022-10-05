console.time('Timer');

const epoch = 1e8;
const thread = navigator.hardwareConcurrency;
if (epoch % thread) console.warn('epoch not divisible by thread');

const workers = Array(thread)
  .fill('')
  .map(() => new Worker(new URL('./worker.ts', import.meta.url)));

for (const worker of workers) {
  worker.postMessage({ epoch: (epoch / thread) | 0 });
}

const inCircles = (
  await Promise.all(
    workers.map(
      (worker) =>
        new Promise((resolve) => {
          worker.addEventListener('message', ({ data: { inCircles } }) => {
            resolve(inCircles);
          });
        }) as Promise<number>
    )
  )
).reduce((a, b) => a + b);

console.log((inCircles * 4) / epoch);

console.timeEnd('Timer');

export {};
