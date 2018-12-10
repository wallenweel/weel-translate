import { ActionTree } from 'vuex';
import * as types from '@/types';
import { State } from './';
import { versionCheck } from '@/functions';

export const actions: ActionTree<State, State> = {
  startup: async ({ dispatch, state }): Promise<std> => {
    const [err1, config]: std = await dispatch('loadStorage');
    if (err1 !== null) { return [err1]; }

    const [err2] = await dispatch('checkVersion', config);
    if (err2 !== null) { return [err2]; }

    return [null];
  },

  loadStorage: async ({ dispatch, commit }): Promise<std> => {
    const [error, config] = await dispatch('storage/query');
    if (error !== null) { return [error]; }

    return [null, config];
  },

  checkVersion: async ({ dispatch }, config): Promise<std> => {
    const { version, last_version } = config;
    const [, status] = versionCheck(version, last_version);

    switch (status) {
      case types.VERSION_FRESH: // first install
        const [error] = await dispatch('storage/reset');
        if (error !== null) {
          return [error];
        }
        return [null];

      case types.VERSION_UPDATED:
        return [null];

      case types.VERSION_OUTDATED:
        return [null];

      case types.VERSION_SAME: // nothing change
        return [null];
      default:
        return [null];
    }
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
