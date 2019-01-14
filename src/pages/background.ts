import store from '@/stores/background';
import browser from '@/apis/browser';
import { ipcActions } from '@/stores/background/actions';
import { istype } from '@/functions';
import { UPDATED_CONFIG } from '@/types';
import { avoidanceReg } from '@/variables';
import debug from '@/functions/debug';

const { runtime } = browser;

(async () => {
  const [error] = await store.dispatch('startup');

  if (error !== null) {
    debug.error(`background script startup incomplete.\n`, error);
  }

  debug.log(JSON.parse(JSON.stringify(store.state.storage)));

  runtime.onConnect.addListener((port: RuntimePort) =>
    port.onMessage.addListener((message) => ipcActionResponser(message)
      .then((response) => port.postMessage(response))));

  runtime.onMessage.addListener((message, sender, send) =>
    !!ipcActionResponser(message).then((response) => send(response)));

  store.subscribe(({ type, payload }: any, state: any) => {
    if (type === 'storage/update') {
      const config = payload;

      tabActionSender({
        type: UPDATED_CONFIG,
        meta: { from: 'background' },
        payload: config,
      });
    }
  });
})();


async function ipcActionResponser(action: IpcAction): Promise<any> {
  const { name, type, meta = {} } = action;
  const { token, from } = meta;
  const sign: IpcAction = { name, type, meta: { from: 'background', token } };

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

async function tabActionSender(action: IpcAction, info?: TabQueryInfo) {
  const { type, meta = {}, payload } = action;
  const { token, from } = meta;

  let tabs: Tab[] | null = null;

  try {
    tabs  = await browser.tabs.query(info! || {
      currentWindow: true,
      active: true,
    });
  } catch (error) {
    debug.error(error);
  }

  if (!tabs) {
    return debug.info(`the "${type}" action failed, maybe current tab is not ready.`);
  }

  for (const tab of tabs) {
    const { id, url, title, status, index, active } = tab;

    for (const reg of avoidanceReg.urls) {
      if (reg.test(url || '')) {
        return debug.info(`type: "${type}" action failed, current url: "${url}" is avoidance.`);
      }
    }

    const response: IpcResponse = {
      type,
      meta: { token, from, tab: { id, url, title, status, index, active } },
      payload,
    };

    try {
      const action: IpcAction = await browser.tabs.sendMessage(id!, response);

      if (!!action && !!action.type) {
        const response: IpcAction = await store.dispatch(action);
        await tabActionSender(response);
      }
    } catch (error) {
      debug.error(`${active ? 'active' : 'target'} tab maybe was not ready or not support.`,
        JSON.stringify({ id, title }));
    }
  }
}
