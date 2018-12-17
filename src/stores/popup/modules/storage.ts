import { MutationTree, ActionTree, Module } from 'vuex';
import { State as RootState } from '../index';

import { update, clear } from '@/stores/mutations';

import { configKeysReducer } from '@/functions';
import defaultConfig from '@/defaults/config';
import debug from '@/functions/debug';

const namespaced: boolean = true;

const state: State = {};

const mutations: MutationTree<State> = Object.assign({
}, { update, clear });

const webActions: ActionTree<State, RootState> = {
  reset: () => localStorage.setItem('config', JSON.stringify(defaultConfig)),

  query: async ({ dispatch }, keys?: storageKeys): Promise<std> => {
    // patch, set storage
    if (!localStorage.getItem('config')) { await dispatch('reset'); }

    const config = JSON.parse(localStorage.getItem('config')!);

    let out: DefaultConfig | any;

    if (!keys) {
      out = config;
    } else {
      out = configKeysReducer(keys, config);
    }

    return [null, out];
  },
};

const ipcActions: ActionTree<State, RootState> = {};

const actions = Object.assign({
  init: async ({ dispatch, commit }): Promise<std> => {
    const [error, config] = await dispatch('query');
    if (error !== null) { return [error]; }

    commit('update', config);

    return [null, config];
  },
} as ActionTree<State, RootState>, TARGET_BROWSER === 'web' ? webActions : ipcActions);

export const storage: Module<State, RootState> = {
  namespaced, state, actions, mutations,
};

export default storage;

interface State {
  [key: string]: any;
}
