import { ActionTree } from 'vuex';
import { State } from './';
import { versionCheck } from '@/functions';
import * as types from '@/types';
import debug from '@/functions/debug';

export const actions: ActionTree<State, State> = {
  startup: async ({ dispatch, state }): Promise<std> => {
    const [err1, config]: std = await dispatch('storage/init');
    if (err1 !== null) { return [err1]; }

    const [err2] = await dispatch('version', config);
    if (err2 !== null) { return [err2]; }

    return [null];
  },

  version: async ({ dispatch }, config): Promise<std> => {
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
  [types.RESET_CONFIG]: async ({ dispatch }, { payload: keys }): Promise<std> => {
    return await dispatch('storage/reset', { keys });
  },

  [types.QUERY_CONFIG]: async ({ dispatch }, { payload: keys }): Promise<std> => {
    return await dispatch('storage/query', { keys });
  },

  [types.SET_CONFIG]: async ({ dispatch }, { payload: config }) => {
    return await dispatch('storage/update', config);
  },

  [types.QUERY_TRANSLATION]: async ({ dispatch }, { payload: { type, params } }) => {
    return await dispatch('translation/query', { type, params });
  },
};

export default {
  ...actions,
  ...ipcActions,
};
