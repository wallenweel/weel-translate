import { MutationTree, ActionTree, Module } from 'vuex';
import defaultConfig, { base, preference, translation, web, template } from '@/defaults/config';
import { State as RootState } from '../index';
import { update, clear } from '@/stores/mutations';
import { QUERY_CONFIG, SET_CONFIG, RESET_CONFIG } from '@/types';
import { configKeysReducer, istype } from '@/functions';
import debug from '@/functions/debug';

export const namespaced: boolean = true;

export let PAGE: 'background' | 'popup' | 'content' | 'options';
export let KEYS: Array<keyof DefaultConfig>;

const filterConfig = (changes: { [k in keyof DefaultConfig]: any }) => {
  const config: { [k: string]: any } = {};

  for (const [k, v] of Object.entries(changes)) {
    if (istype(v, 'undefined') || !KEYS!.includes(k as keyof DefaultConfig)) { continue; }
    config[k] = v;
  }
  return config;
};

export const actionGenerator = (type: string, payload?: any): IpcAction => ({
  type,
  payload,
  meta: {
    from: PAGE,
  },
});

export const state: State | any = {};

export const mutations = Object.assign({
  init: (state, { page, keys }) => {
    state.page = page;
    state.keys = keys;
  },
} as MutationTree<State>, { update, clear });

type configKey = keyof DefaultConfig;
export const webActions: ActionTree<State, RootState> = {
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

  save: ({ state, commit }, config) => {
    const getConfig = JSON.parse(localStorage.getItem('config')!);
    localStorage.setItem('config', JSON.stringify(Object.assign({}, getConfig, config)));
    return true;
  },
};

export const ipcActions: ActionTree<State, RootState> = {
  reset: async ({ commit, dispatch }, keys: configCat | configKey[]) => {
    const action = actionGenerator(RESET_CONFIG, keys);
    const { payload: config } = await dispatch('ipc', action, { root: true });

    commit('update', config);
  },

  query: async ({ commit, dispatch }, keys?: storageKeys) => {
    const action = actionGenerator(QUERY_CONFIG, keys);
    const { payload: config } = await dispatch('ipc', action, { root: true });

    commit('update', config);
  },

  save: async ({ dispatch }, config) => {
    const action = actionGenerator(SET_CONFIG, config);
    const { error, payload: success } = await dispatch('ipc', action, { root: true });
    if (error !== null) { return dispatch('notify', error, { root: true }); }

    return success;
  },
};

export const actions = Object.assign({
  init: async ({ dispatch, commit }, { page = '', keys = [] }) => {
    [PAGE, KEYS] = [page, keys];

    await dispatch('fetch', keys);
  },

  fetch: async ({ dispatch }, keys) => {
    await dispatch('query', keys);
  },

  merge: async ({ state, dispatch, commit }, changes) => {
    const config = filterConfig(changes) as DefaultConfig;

    // push changes
    const success = await dispatch('save', config);

    if (!success) {
      debug.error('Does not save config changes. Maybe background server occur problem.');
      dispatch('notify', 'Config saved failed.', { root: true });
      return false;
    }

    commit('update', config);

    return true;
  },

  update: async ({ commit }, changes) => {
    commit('update', filterConfig(changes));
  },
} as ActionTree<State, RootState>, TARGET_BROWSER === 'web' ? webActions : ipcActions);

export const storage: Module<State, RootState> = {
  namespaced, state, actions, mutations,
};

export default storage;

export interface State {
  [name: string]: any;
}
