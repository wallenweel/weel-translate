import store from '@/stores/background';
import browser from '@/apis/browser';
import { println } from '@/functions';

const { runtime } = browser;

const { dispatch } = store;

(async () => {
  const [error, result] = await dispatch('startup');

  if (error !== null) {
    println('error', `background script startup incomplete\n`, error);
  }

  println(result);
})();

runtime.onMessage.addListener((message = {}, sender, sendResponse) => {
  const action = message as { type: '' };

  if (!action.type) {
    return false;
  }

  // redirect to store's action
  dispatch({ ...action, sender, sendResponse });

  // accept send a response asynchronously
  return true;
});
