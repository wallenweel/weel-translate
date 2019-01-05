import { ActionTree } from 'vuex';
import { State } from './';
import { versionCheck, presetInvoker, translationResultParser, istype } from '@/functions';
import * as types from '@/types';
import debug from '@/functions/debug';

export const actions: ActionTree<State, State> = {
  startup: async ({ dispatch, state }): Promise<std> => {
    const [err1, config]: std = await dispatch('storage/init');
    if (err1 !== null) { return [err1]; }

    const [err2] = await dispatch('checkVersion', config);
    if (err2 !== null) { return [err2]; }

    await dispatch('translation/init');

    return [null];
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
  [types.QUERY_CONFIG]: async ({ dispatch }, { payload: keys }): Promise<std> => {
    const [, config] = await dispatch('storage/query', { keys });

    return [null, config];
  },

  [types.SET_CONFIG]: async ({ dispatch }, { payload: config }) => {
    const [error, result] = await dispatch('storage/update', config);
    if (error !== null) { return [error]; }

    return [null, result];
  },

  [types.QUERY_TRANSLATION]: async ({ dispatch }, { payload: { type, params } }) => {
    const response = await dispatch('translation/query', { type, params });
    return [null, response];
  },
};

export default {
  ...actions,
  ...ipcActions,
};
