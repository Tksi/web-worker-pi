import './style.css';

const epoch = 1e8;
let inCircles = 0;

console.time('Timer');
for (let i = 0; i < epoch; i++) {
  if (Math.hypot(Math.random(), Math.random()) <= 1) {
    inCircles++;
  }
}
console.timeEnd('Timer');

console.log((4 * inCircles) / epoch);
