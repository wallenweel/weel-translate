import { MutationTree, ActionTree, Module } from 'vuex';
import { DefaultStorage, storage as defaultStorage } from '@/defaults';
import { RootState } from '../index';

import { storage as apiStorage } from '@/apis/browser';

const namespaced: boolean = true;

const state: State = {
  name: 'storage',
};

const mutations: MutationTree<State> = {
  update: (state, [name, value]: [string, any]): void => {
    state[name] = value;
  },
};

const actions: ActionTree<State, RootState> = {
  update: async ({ state, commit }, payload: DefaultStorage): void => {
    // TODO:
    await apiStorage.local.get(payload);

    for (const [k, v] of Object.entries(payload)) {
      commit('update', [k, v]);
    }
  },
};

export const storage: Module<State, RootState> = {
  namespaced, state,
};

interface State {
  name: string;
  [key: string]: any;
}
