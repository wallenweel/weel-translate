import Vue from 'vue';
import Vuex, { MutationTree, ActionTree, ModuleTree } from 'vuex';
import storage from './modules/storage';
import preference from './modules/preference';
import translation from './modules/translation';
import debug from '@/functions/debug';

Vue.use(Vuex);

let Port: RuntimePort;

const state: State = {};

const mutations: MutationTree<State> = {};

const actions: ActionTree<State, State> = {
  init: ({ state, dispatch }, { port }) => {
    // initial a port for connecting other end
    // useless in "web" mode
    Port = port;
    Port.onMessage.addListener(({ name, receiver, type, payload }: IpcAction) => {
      if (!receiver) {
        return debug.warn(`receiving action ${receiver} is not exist`);
      }

      dispatch(receiver as string, payload);
    });

    dispatch('storage/init')
      .then(() => dispatch('preference/init'))
      .then(() => dispatch('translation/init'))
      .then(() => {
        // debug.log(state.storage);
      });
  },

  ipc: (_, { type, receiver, payload }) => {
    debug.log(Port);
    Port.postMessage({
      name: Port.name,
      type,
      receiver,
      payload,
    } as IpcAction);
  },
};

const modules: ModuleTree<State> = {
  storage, preference, translation,
};

export default new Vuex.Store<State>({
  state, actions, mutations, modules,
});

export interface State {
  [name: string]: any;
}
