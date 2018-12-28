import Vue from 'vue';
import Vuex, { MutationTree, ActionTree, ModuleTree, GetterTree } from 'vuex';
import storage from '../modules/storage';
import preference from './modules/preference';
import { update, clear } from '@/stores/mutations';
import debug from '@/functions/debug';

Vue.use(Vuex);

let Port: RuntimePort;

const state: State = {
  text: null,
};

const mutations = Object.assign({
} as MutationTree<State>, { update, clear });

const actions: ActionTree<State, State> = {
  init: ({ state, dispatch, rootState }, { port }) => {
    Port = port;
    Port.onMessage.addListener(({ name, receiver, type, error, payload }: IpcAction) => {
      if (!receiver) {
        return debug.warn(`receiving action ${receiver} is not exist`);
      }

      dispatch(receiver as string, payload);
    });
  },

  ipc: (_, { type, receiver, payload }) => {
    const name: RuntimePort['name'] = Port.name;
    Port.postMessage({ name, type, receiver, payload } as IpcAction);
  },

  selection: ({ state, dispatch }, text: string = '') => {
    if (!text.length) {
      if (!!state.text) { dispatch('unselect'); }
      return;
    }

    if (state.text === text) { return; }

    dispatch('select', text);
  },

  select: ({ commit }, text) => {
    commit('update', { text });
  },
  unselect: ({ commit }) => {
    commit('update', { text: null });
  },
};

const getters: GetterTree<State, State> = {
  locale: (state) => state.storage.ui_language,
};

const modules: ModuleTree<State> = {
  storage, preference,
};

const store = new Vuex.Store<State>({
  state, actions, mutations, getters, modules,
});

store.subscribe((mutation) => {
  if (mutation.type === 'storage/update') {
    store.dispatch('preference/fetch');
  }
});

export default store;

export interface State {
  text: string | null;

  [name: string]: any;
}
