export class WorkerPool<Result> {
  #workers: {
    worker: Worker;
    isBusy: boolean;
  }[] = [];
  #messageQueue: Parameters<Worker['postMessage']>[] = [];
  #onEnd?: () => void;
  #isFixed: boolean = false;

  constructor(
    workerUrl: string,
    onMessage?: (result: Result) => void,
    onEnd?: () => void,
    size: number = navigator.hardwareConcurrency
  ) {
    this.#onEnd = onEnd;

    for (let i = 0; i < size; i++) {
      const worker = new Worker(workerUrl);
      worker.addEventListener('message', ({ data }: { data: Result }) => {
        onMessage?.(data);
        const thisWorker = this.#workers.find(({ worker: w }) => w === worker);
        if (thisWorker) thisWorker.isBusy = false;
        this.#run();
      });
      worker.addEventListener('error', (e) => {
        throw e;
      });

      this.#workers.push({
        worker,
        isBusy: false,
      });
    }

    URL.revokeObjectURL(workerUrl);
  }

  get #isAllIdle() {
    return this.#workers.every(({ isBusy }) => !isBusy);
  }

  get #idleWorker() {
    return this.#workers.find(({ isBusy }) => !isBusy);
  }

  add(...message: Parameters<Worker['postMessage']>) {
    this.#messageQueue.push(message);
    this.#run();
  }

  fix() {
    this.#isFixed = true;
    this.#run();
  }

  #run() {
    while (this.#idleWorker && this.#messageQueue.length > 0) {
      const idleWorker = this.#idleWorker;
      const message = this.#messageQueue.shift()!;
      idleWorker.isBusy = true;
      idleWorker.worker.postMessage(...message);
    }

    if (this.#isFixed && this.#isAllIdle && this.#messageQueue.length === 0) {
      this.#terminate();
    }
  }

  #terminate() {
    this.#onEnd?.();
    for (const { worker } of this.#workers) {
      worker.terminate();
    }
  }
}
