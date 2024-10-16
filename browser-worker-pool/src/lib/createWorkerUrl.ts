export const createWorkerUrl = (
  fn: (...args: any[]) => any
): string => {
  const workerCode = `
    self.addEventListener('message', async (e) => {
      const fn = ${fn.toString()};
      self.postMessage(fn(e.data));
    });
  `;
  const blob = new Blob([workerCode], { type: 'application/javascript' });

  return URL.createObjectURL(blob);
};
