import { ActionTree } from 'vuex';
import * as types from '@/types';
import { State } from './';
import debug from '@/functions/debug';
import defaultConfig from '@/defaults/config';

export const actions: ActionTree<State, State> = {
  // regular actions
  startup: async ({ dispatch, state }): Promise<std> => {
    // TODO: start every required things
    const [error, config]: std = await dispatch('loadStorage');

    if (error !== null) {
      return [new Error('load storage failed!')];
    }

    if (!Object.keys(state.storage).length) {
      const [error] = await dispatch('storage/reset');

      if (error !== null) {
        return [error];
      }
    }

    return [null];
  },

  loadStorage: async ({ dispatch, commit }): Promise<std> => {
    const [error, config] = await dispatch('storage/query');

    if (error !== null) {
      return [new Error('query storage config failed!')];
    }

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
