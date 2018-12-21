import store from '@/stores/background';
import browser from '@/apis/browser';
import debug from '@/functions/debug';
import { ipcActions } from '@/stores/background/actions';

const { runtime } = browser;
const { dispatch } = store;

let Port: RuntimePort;

(async () => {
  const [error] = await dispatch('startup');

  if (error !== null) {
    debug.error(`background script startup incomplete.\n`, error);
  }

  debug.log(store.state.storage);
})();

let ipcListener: RuntimePort['onMessage']['addListener'];
ipcListener = (message) => {
  const { name, receiver, type, payload = {} }: IpcAction = message as any;

  if (!type) {
    debug.log('warn', `IPC message's type is ${type}.`);
    return false;
  }

  if (!Object.keys(ipcActions).includes(type)) {
    debug.log('warn', `type "${type}" is not existed in actions.`);
    return false;
  }

  // redirect to store's action
  dispatch(type, { Port, ...message })
    .then(([error, payload]) => {
      if (error !== null) { debug.warn(error); }

      Port.postMessage({ name, receiver, type, error, payload });
    });

  // accept send a response asynchronously
  return true;
};

runtime.onConnect.addListener((port: RuntimePort) => {
  Port = port;

  Port.onMessage.addListener(ipcListener);
});
