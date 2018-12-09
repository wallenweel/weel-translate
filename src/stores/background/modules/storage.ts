import { MutationTree, ActionTree, Payload, Module } from 'vuex';
import { State as RootState } from '../index';

import { storage as apiStorage } from '@/apis/browser';

const namespaced: boolean = true;

const state: State = {
  name: 'storage',
};

const mutations: MutationTree<State> = {
  updateState: (state, payload: DefaultConfig): void => {
    for (const [name, value] of Object.entries(payload)) {
      state[name] = value;
    }
  },
};

const actions: ActionTree<State, RootState> = {
  query: async (_, keys?: storageKeys, type?: storageType): Promise<std<DefaultConfig>> => {
    const config = await apiStorage[type || 'local'].get(keys || null);

    return [null, config];
  },

  update: async ({ state, commit }, config: DefaultConfig, type?: storageType): Promise<std> => {
    if (!Object.keys(config).length) {
      return [true, 'empty config'];
    }

    const result = await apiStorage[type || 'local'].set(config);

    commit('updateState', config);

    return [null, result];
  },
};

export const storage: Module<State, RootState> = {
  namespaced, state, actions, mutations,
};

interface State {
  name: string;
  [key: string]: any;
}

interface UpdatePayload {
  type?: 'local' | 'sync' | 'managed';
  data: DefaultConfig;
}
