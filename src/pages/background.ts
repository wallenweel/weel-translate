import store from '@/stores/background';
import browser from '@/apis/browser';
import { ipcActions } from '@/stores/background/actions';
import { istype } from '@/functions';
import debug from '@/functions/debug';

const { runtime } = browser;

(async () => {
  const [error] = await store.dispatch('startup');

  if (error !== null) {
    debug.error(`background script startup incomplete.\n`, error);
  }

  debug.log(store.state.storage);
})();

// connect
runtime.onConnect.addListener((port: RuntimePort) =>
  port.onMessage.addListener((message) => !!ipcActionResponser(message)
    .then((response) => port.postMessage(response))));

// message
runtime.onMessage.addListener((message, sender, sendResponse) =>
  !!ipcActionResponser(message as IpcAction)
    .then((response) => sendResponse(response)));

async function ipcActionResponser(action: IpcAction): Promise<any> {
  const { name, type, token } = action;
  const sign = { name, type, token };

  if (!type) {
    debug.warn(`IPC message's type is ${type}.`);
  }

  if (!Object.keys(ipcActions).includes(type)) {
    debug.warn(`type "${type}" is not existed in actions.`);
    return { ...sign, error: `type ${type} action is invalid.` };
  }

  const [err, payload] = await store.dispatch(action);

  if (err !== null) { debug.warn(err); }
  const error: string | null = istype(err, 'error') ? err.message : err;

  return { ...sign, error, payload };
}
