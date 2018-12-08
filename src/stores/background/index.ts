import Vue from 'vue';
import Vuex, { ActionTree, MutationTree, ModuleTree, Action } from 'vuex';

import * as types from '@/types';

import { storage } from './modules/storage';

Vue.use(Vuex);

const state: State = {
  name: 'background',
};

const actions: ActionTree<State, State> = {
  // regular actions
  ...{
    startup: async ({ dispatch }): Promise<std> => {
      // TODO: start every required things
      const [err]: std = await dispatch('loadStorage');

      if (err !== null) {
        return [new Error('load storage failed!')];
      }

      return [null, { over: true }];
    },

    loadStorage: async ({ dispatch, commit }): Promise<std> => {
      const [err, config]: std = await dispatch('storage/query');

      if (err !== null) {
        return [new Error('query storage config failed!')];
      }

      commit('updateState', { config });

      return [null, config];
    },
  },

  // type actions for IPC
  ...{
    [types.QUERY_CONFIG]: async ({ dispatch }): Promise<std> => {
      const [err, config] = await dispatch('storage/query');

      if (err !== null) {
        return [new Error('query storage config failed!')];
      }

      return [null, config];
    },
  },
};

const mutations: MutationTree<State> = {
  updateState: (state, data: object = {}): void => {
    for (const [key, value] of Object.entries(data)) {
      const target = state[key];

      if (!target) {
        state[key] = value;
      } else {
        state[key] = Object.assign({}, target, value);
      }
    }
  },
};

const modules: ModuleTree<State> = {
  storage,
};

export default new Vuex.Store<State>({
  state, actions, modules,
});

export interface State {
  name: string;
  [name: string]: any;
}
