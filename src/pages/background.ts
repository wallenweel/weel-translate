import store from '@/stores/background';
import browser from '@/apis/browser';
import debug from '@/functions/debug';
import { ipcActions } from '@/stores/background/actions';

const { runtime } = browser;
const { dispatch } = store;

(async () => {
  const [error] = await dispatch('startup');

  if (error !== null) {
    debug.error(`background script startup incomplete.\n`, error);
  }

  debug.log(store.state.storage);
})();

runtime.onMessage.addListener((message = {}, sender, sendResponse) => {
  const action = message as { type: '' };

  if (!action.type) {
    debug.log('warn', `IPC message's type is ${action.type}.`);
    return false;
  }

  if (!Object.keys(ipcActions).includes(action.type)) {
    debug.log('warn', `type "${action.type}" is not existed in actions.`);
    return false;
  }

  // redirect to store's action
  dispatch({ ...action, sender, sendResponse });

  // accept send a response asynchronously
  return true;
});
