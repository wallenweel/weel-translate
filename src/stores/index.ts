import { ActionContext, Module, ModuleOptions, Action, ActionTree } from 'vuex';
import { istype, configRegister } from '@/functions';

export interface State {
  [key: string]: any;
}

export type ModuleGenerator<S, R> = (commonModule: Module<S, R>, commonRegister: configPairs<S>) =>
  (module: Module<S, R>, register: configPairs<S>, options?: {
    fetch?: (context: ActionContext<S, R>, pull: (config: DefaultConfig) => S) => any;
    merge?: (context: ActionContext<S, R>, push: (states: S) => DefaultConfig) => any;
  }) => Module<S, R>;

export const moduleGenerator: ModuleGenerator<State, State> = (commonModule = {}, commonRegister = {}) => {
  return (module, register, options = {}) => {
    const r: configPairs<State> = { ...commonRegister, ...register };
    const pullConfig = (configRegister as ConfigRegistFn<State>)(r, 'pull');
    const pushConfig = (configRegister as ConfigRegistFn<State>)(r, 'push');

    const out: Module<State, State> = {};

    for (const [name, value] of Object.entries(module)) {
      const n = name as keyof Module<State, State>;
      if (istype(value, 'object')) {
        out[n] = { ...commonModule[n] as {}, ...value };
      } else {
        out[n] = commonModule[n];
      }
    }

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
    } as ActionTree<State, State>;

    return out;
  };
};
