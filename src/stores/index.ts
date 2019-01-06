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
