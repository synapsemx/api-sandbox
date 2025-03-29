import { setupWorker } from 'msw/browser';
import handlers from './handlers';

const setupBrowserWorker = () => {
  return setupWorker(...handlers);
};

export default setupBrowserWorker;
