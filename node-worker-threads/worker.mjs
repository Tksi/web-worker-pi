import { parentPort } from 'worker_threads';

parentPort.on('message', ({ epoch }) => {
  let inCircles = 0;
  for (let i = 0; i < epoch; i++) {
    if (Math.hypot(Math.random(), Math.random()) < 1) {
      inCircles++;
    }
  }
  parentPort.postMessage({ inCircles });
  process.exit();
});
