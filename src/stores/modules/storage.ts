import { MutationTree, ActionTree, Module } from 'vuex';
import defaultConfig, { base, preference, translation, web, template } from '@/defaults/config';
import { State as RootState } from '../index';
import { update, clear } from '@/stores/mutations';
import { QUERY_CONFIG } from '@/types';
import { configKeysReducer, istype } from '@/functions';
import debug from '@/functions/debug';

const namespaced: boolean = true;

const state: State | any = {
  ui_language: 'en',
  template_layouts: [],
  template_enabled_sources: {},
};

const mutations = Object.assign({
  init: (state, { page, keys }) => {
    state.page = page;
    state.keys = keys;
  },
} as MutationTree<State>, { update, clear });

type configKey = keyof DefaultConfig;
const webActions: ActionTree<State, RootState> = {
  reset: ({ dispatch }, keys: configCat | configKey[]) => {
    let config: DefaultConfig;
    const configs: any = { base, preference, translation, web, template };

    if (!!keys && istype(keys, 'string')) {
      config = configs[keys as configCat];
    } else if (istype(keys, ['array', 'object'])) {
      config = configKeysReducer(keys, defaultConfig)[1] as DefaultConfig;
    } else {
      config = { ...defaultConfig };
    }

    dispatch('merge', config);
  },

  query: ({ dispatch, commit }, keys?: storageKeys) => {
    // patch, set storage
    if (!localStorage.getItem('config')) { dispatch('reset'); }

    let config: DefaultConfig;

    if (!keys) {
      config = JSON.parse(localStorage.getItem('config')!);
    } else {
      config = JSON.parse(localStorage.getItem('config')!);
      config = configKeysReducer(keys, config)[1] as DefaultConfig;
    }

    commit('update', config);
  },

  save: ({ state, commit }) => {
    localStorage.setItem('config', JSON.stringify(state));
  },
};

const ipcActions: ActionTree<State, RootState> = {
  query: async ({ commit, dispatch }, keys?: storageKeys) => {
    const action: IpcAction = {
      type: QUERY_CONFIG,
      payload: keys,
    };

    const config = await dispatch('ipc', action, { root: true });
    commit('update', config);
  },

  receive: ({ commit }, config) => {
    commit('update', config);
  },
};

const actions = Object.assign({
  init: async ({ dispatch, commit }, { page = '', keys = [] }) => {
    commit('init', { page, keys });
    await dispatch('fetch', keys);
  },

  fetch: async ({ dispatch }, keys) => {
    await dispatch('query', keys);
  },

  merge: async ({ state, dispatch, commit }, changes) => {
    const config: { [k: string]: any } = {};

    // debug.log(changes);
    for (const [k, v] of Object.entries(changes)) {
      if (istype(v, 'undefined') || !state.keys!.includes(k)) { continue; }
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

export interface State extends DefaultConfig {
  page?: 'background' | 'pupop' | 'content' | 'options';
  keys?: Array<keyof DefaultConfig>;
}
