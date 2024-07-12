/**
 * 関数をWorker可してPromiseラップ
 * 
 * @param fn Workerで実行する関数
 * @returns PromiseラップしたWorker
 */
export const createWorker = <T extends any[], R>(
  fn: (...args: T) => R,
): ((...args: T) => Promise<R>) => {
  const workerCode = `
    self.addEventListener('message', function(e) {
      const fn = ${fn.toString()};
      self.postMessage(fn(...e.data));
    });
  `;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  const worker = new Worker(workerUrl);

  return (...args) => {
    return new Promise((resolve, reject) => {
      worker.addEventListener('message', ({ data }: { data: R }) => {
        resolve(data);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      });
      worker.addEventListener('error', reject);
      worker.postMessage(args);
    });
  };
};
