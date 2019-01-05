import store from '@/stores/background';
import browser from '@/apis/browser';
import debug from '@/functions/debug';
import { ipcActions } from '@/stores/background/actions';
import { istype } from '@/functions';

const { runtime } = browser;

(async () => {
  const [error] = await store.dispatch('startup');

  if (error !== null) {
    debug.error(`background script startup incomplete.\n`, error);
  }

  debug.log(store.state.storage);
})();

runtime.onConnect.addListener((port: RuntimePort) => {
  port.onMessage.addListener((message) => {
    return !!ipcActionResponser(message).then((response) => {
      port.postMessage(response);
    });
  });
});

runtime.onMessage.addListener((message, sender, sendResponse) => {
  return !!ipcActionResponser(message as IpcAction).then((response) => {
    sendResponse(response);
  });
});

async function ipcActionResponser(action: IpcAction): Promise<any> {
  const { type, name } = action;
  if (!type) {
    debug.warn(`IPC message's type is ${type}.`);
  }

  if (!Object.keys(ipcActions).includes(type)) {
    debug.warn(`type "${type}" is not existed in actions.`);
  }

  // redirect to store's action
  const [err, payload] = await store.dispatch(action);

  if (err !== null) { debug.warn(err); }
  const error: string | null = istype(err, 'error') ? err.message : err;
  return { type, name, error, payload };
}
