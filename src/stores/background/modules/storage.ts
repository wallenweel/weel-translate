import { MutationTree, ActionTree, Module } from 'vuex';
import { State as RootState } from '../index';

import { update, clear } from '@/stores/mutations';

import { storage as apiStorage } from '@/apis/browser';
import defaultConfig from '@/defaults/config';
import debug from '@/functions/debug';

const namespaced: boolean = true;

const state: State = {
  ...defaultConfig,
};


const mutations: MutationTree<State> = Object.assign({
}, { update, clear });

const actions: ActionTree<State, RootState> = {
  init: async ({ dispatch, commit }): Promise<std> => {
    const [, config] = await dispatch('query');

    commit('update', config);

    return [null, config];
  },

  query: async (_, { keys, type }: { keys?: storageKeys, type?: storageType} = {}): Promise<std<any>> => {
    const config = await apiStorage[type || 'local'].get(keys || null);

    return [null, config];
  },

  update: async ({ commit }, config: DefaultConfig): Promise<std> => {
    if (!Object.keys(config).length) {
      return ['empty config'];
    }

    await apiStorage.local.set(config);

    commit('update', config);

    return [null, true];
  },

  reset: async ({ dispatch, commit }): Promise<std> => {
    commit('clear');

    const [error] = await dispatch('update', defaultConfig);

    if (error !== null) {
      debug.error(`reset storage config failed.`);
      return [error];
    }

    return [null];
  },
};

export const storage: Module<State, RootState> = {
  namespaced, state, actions, mutations,
};

export default storage;

interface State extends DefaultConfig {
  [name: string]: any;
}

interface UpdatePayload {
  type?: 'local' | 'sync' | 'managed';
  data: DefaultConfig;
}
