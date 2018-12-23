import Vue from 'vue';
import Vuex, { MutationTree, ActionTree, ModuleTree, GetterTree } from 'vuex';
import storage from './modules/storage';
import preference from './modules/preference';
import translation from './modules/translation';
import { update, clear } from '@/stores/mutations';
import debug from '@/functions/debug';

Vue.use(Vuex);

let Port: RuntimePort;

const state: State = {
  notify: null,
};

const mutations = Object.assign({
} as MutationTree<State>, { update, clear });

const actions: ActionTree<State, State> = {
  init: ({ state, dispatch, rootState }, { port }) => {
    // initial a port for connecting other end
    // useless in "web" mode
    Port = port;
    Port.onMessage.addListener(({ name, receiver, type, error, payload }: IpcAction) => {
      if (error !== null) {
        dispatch('notify', error);
      }

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
    Port.postMessage({
      name: Port.name,
      type,
      receiver,
      payload,
    } as IpcAction);
  },

  notify: ({ commit }, message: string) => {
    commit('update', { notify: message || null });
  },
};

const getters: GetterTree<State, State> = {
  locale: (state) => state.storage.ui_language,
};

const modules: ModuleTree<State> = {
  storage, preference, translation,
};

const store = new Vuex.Store<State>({
  state, actions, mutations, getters, modules,
});

store.subscribe((mutation, state) => {
  if (mutation.type === 'storage/update') {
    store.dispatch('preference/fetch');
    store.dispatch('translation/fetch');
  }
});

export default store;

export interface State {
  notify: null | string;

  [name: string]: any;
}
