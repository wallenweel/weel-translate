import { ActionContext, Module, ModuleOptions, Action, ActionTree } from 'vuex';
import { istype, configRegister } from '@/functions';
import debug from '@/functions/debug';

export interface State {
  [key: string]: any;
}

export type ModuleHelper = (module: Module<any, any>, register: configPairs<any>, options?: {
  fetch?: (context: ActionContext<any, any>, pull: (config: DefaultConfig) => any) => any;
  merge?: (context: ActionContext<any, any>, push: (states: any) => DefaultConfig) => any;
}) => Module<any, any>;

export const moduleHelper: ModuleHelper = (module, register, options = {}) => {
  const pullConfig = (configRegister as ConfigRegistFn<any>)(register, 'pull');
  const pushConfig = (configRegister as ConfigRegistFn<any>)(register, 'push');

  const out: Module<any, any> = { ...module };

  out.actions = {
    ...out.actions,

    fetch: options.fetch ?
      (context) => options.fetch!(context, pullConfig) :
      ({ commit, rootState }) =>
        commit('update', pullConfig(rootState.storage)),

    merge: options.merge ?
      (context) => options.merge!(context, pushConfig) :
      async ({ commit, dispatch }, changes) =>
        await dispatch('storage/merge', pushConfig(changes), { root: true }),
  } as ActionTree<any, any>;

  return out;
};

export type ModuleGeneratFn = (commonModule: Module<any, any>, commonRegister?: configPairs<any>) =>
  ModuleHelper;

export const moduleGenerator: ModuleGeneratFn = (commonModule = {}, commonRegister = {}) => {
  return (module, register) =>
    moduleHelper({ ...commonModule, ...module }, { ...commonRegister, ...register });
};

export type ipcActionRequestfn = (Port: RuntimePort, action: IpcAction) => IpcResponse | any;

export const ipcActionRequestor: ipcActionRequestfn = async (Port, action) => {
  const { type, meta = {}, payload, port = true } = action;
  const { token, from } = meta;

  let response: IpcResponse;

  if (port) {
    const { name } = Port;
    const [theName, theType, theToken] = [name, type, token];

    const action: IpcAction = { name, type, meta: { token, from }, payload };
    Port.postMessage(action);

    try {
      response = await new Promise((resolve, reject) => {
        const listener = ({ name, type, meta = {}, error, payload }: IpcAction) => {
          const { token, from } = meta;

          if (from !== 'background') {
            return reject(`only agree background's responses the ipc action from "${from}"`);
          }
          if (theName !== name || theType !== type) {
            return reject(`not same message source. "${theType}/${type}", "${theName}/${name}"`);
          }
          if (token !== undefined && theToken !== token) {
            return reject(`responsing ipc action is not compatible`);
          }
          if (error !== null) { return reject(error); }

          resolve({ name, type, payload });

          Port.onMessage.removeListener(listener);
        };
        Port.onMessage.addListener(listener);
      });
    } catch (error) {
      response = { type, error };
    }
  } else {
    const action: IpcAction = { name, type, meta: { token, from }, payload };
    response = await browser.runtime.sendMessage(action);
  }

  const { error = null } = response;

  if (error !== null) {
    debug.error(`occur error in named "${type}" ipc action.`, error);
  }

  return Object.assign(response, { error }) as IpcResponse;
};
