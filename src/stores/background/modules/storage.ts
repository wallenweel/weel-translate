import { MutationTree, ActionTree, Payload, Module } from 'vuex';
import { State as RootState } from '../index';
import { storage as apiStorage } from '@/apis/browser';
import defaultConfig from '@/defaults/config';
import debug from '@/functions/debug';

const namespaced: boolean = true;

const state: State = {};

const mutations: MutationTree<State> = {
  update: (state, payload: DefaultConfig): void => {
    for (const [name, value] of Object.entries(payload)) {
      state[name] = value;
    }
  },
  clear: (state) => {
    state = Object.assign({});
  },
};

const actions: ActionTree<State, RootState> = {
  query: async (_, keys?: storageKeys, type?: storageType): Promise<std<any>> => {
    const config = await apiStorage[type || 'local'].get(keys || null);

    return [null, config];
  },

  update: async ({ commit }, config: DefaultConfig): Promise<std> => {
    if (!Object.keys(config).length) {
      return [true, 'empty config'];
    }

    const result = await apiStorage.local.set(config);

    commit('update', config);

    return [null, result];
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

interface State {
  [key: string]: any;
}

interface UpdatePayload {
  type?: 'local' | 'sync' | 'managed';
  data: DefaultConfig;
}
