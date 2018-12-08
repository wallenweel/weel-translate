import store from '@/stores/background';
import browser from '@/apis/browser';

const { runtime } = browser;

const { dispatch } = store;

(async () => {
  const result = await dispatch('startup');

  // tslint:disable-next-line:no-console
  console.log(result);
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
