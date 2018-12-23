import { MutationTree, ActionTree, Module } from 'vuex';
import { State as RootState } from '../index';

import { update, clear } from '@/stores/mutations';

import { configKeysReducer, istype } from '@/functions';
import defaultConfig from '@/defaults/config';
import { QUERY_CONFIG } from '@/types';
import debug from '@/functions/debug';

const namespaced: boolean = true;

const state: State = {
  ...defaultConfig,
};

const mutations: MutationTree<State> = Object.assign({
}, { update, clear });

const webActions: ActionTree<State, RootState> = {
  reset: () => localStorage.setItem('config', JSON.stringify(defaultConfig)),

  query: async ({ dispatch, commit }, keys?: storageKeys) => {
    // patch, set storage
    if (!localStorage.getItem('config')) { await dispatch('reset'); }

    let config: DefaultConfig = JSON.parse(localStorage.getItem('config')!);

    if (!keys) {
      config = config;
    } else {
      config = configKeysReducer(keys, config) as any;
    }

    commit('update', config);
  },

  save: ({ state, commit }) => {
    localStorage.setItem('config', JSON.stringify(state));
  },
};

const ipcActions: ActionTree<State, RootState> = {
  query: ({ dispatch }, keys?: storageKeys) => {
    const action: IpcAction = {
      type: QUERY_CONFIG,
      receiver: 'storage/receive',
    };

    dispatch('ipc', action, { root: true });
  },

  receive: ({ commit }, config) => {
    commit('update', config);
  },
};

const actions = Object.assign({
  init: async ({ dispatch, commit }) => {
    await dispatch('fetch');
  },

  fetch: async ({ dispatch }, keys) => {
    await dispatch('query', keys);
  },

  merge: async ({ dispatch, commit }, changes) => {
    const config: { [k: string]: any } = {};

    // debug.log(changes);
    for (const [k, v] of Object.entries(changes)) {
      if (istype(v, 'undefined')) { continue; }
      config[k] = v;
    }

    commit('update', config);

    // push
    dispatch('save', changes);
  },
} as ActionTree<State, RootState>, TARGET_BROWSER === 'web' ? webActions : ipcActions);

export const storage: Module<State, RootState> = {
  namespaced, state, actions, mutations,
};

export default storage;

interface State {
  [key: string]: any;
}
