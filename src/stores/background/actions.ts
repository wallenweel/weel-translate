import { ActionTree } from 'vuex';
import * as types from '@/types';
import { State } from './';
import { debug } from '@/functions';

export const actions: ActionTree<State, State> = {
  // regular actions
  startup: async ({ dispatch }): Promise<std> => {
    // TODO: start every required things
    const [error, config]: std = await dispatch('loadStorage');

    if (error !== null) {
      return [new Error('load storage failed!')];
    }

    debug.log(config);

    return [null];
  },

  loadStorage: async ({ dispatch, commit }): Promise<std> => {
    const [error, config] = await dispatch('storage/query');

    if (error !== null) {
      return [new Error('query storage config failed!')];
    }

    commit('updateState', { config });

    return [null, config];
  },
};

export const ipcActions: ActionTree<State, State> = {
  [types.QUERY_CONFIG]: async ({ dispatch }): Promise<std> => {
    const [err, config] = await dispatch('storage/query');

    if (err !== null) {
      return [new Error('query storage config failed!')];
    }

    return [null, config];
  },
};

export default {
  ...actions, ...ipcActions,
};
