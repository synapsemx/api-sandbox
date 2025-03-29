import type { SetupWorker } from 'msw/browser';
import setupBrowserWorker from './browser';

let worker: SetupWorker;

export function setupRequestMocking() {
  worker = setupBrowserWorker();
}

export function setupRequestMockingTest(hooks: NestedHooks) {
  hooks.before(async function () {
    await startWorker();
  });

  hooks.afterEach(() => worker.resetHandlers());

  hooks.after(function () {
    worker.stop();
  });
}

export function getWorker() {
  return worker;
}

export async function startWorker() {
  await worker.start({
    onUnhandledRequest() {
      return;
    },
  });
}
