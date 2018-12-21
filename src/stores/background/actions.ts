import { ActionTree } from 'vuex';
import { State } from './';
import { versionCheck } from '@/functions';
import { QUERY_CONFIG, VERSION_FRESH, VERSION_UPDATED, VERSION_OUTDATED, VERSION_SAME } from '@/types';

export const actions: ActionTree<State, State> = {
  startup: async ({ dispatch, state }): Promise<std> => {
    const [err1, config]: std = await dispatch('storage/init');
    if (err1 !== null) { return [err1]; }

    const [err2] = await dispatch('checkVersion', config);
    if (err2 !== null) { return [err2]; }

    return [null];
  },

  checkVersion: async ({ dispatch }, config): Promise<std> => {
    const { version, last_version } = config;
    const [, status] = versionCheck(version, last_version);

    switch (status) {
      case VERSION_FRESH: // first install
        const [error] = await dispatch('storage/reset');
        if (error !== null) {
          return [error];
        }
        return [null];

      case VERSION_UPDATED:
        return [null];

      case VERSION_OUTDATED:
        return [null];

      case VERSION_SAME: // nothing change
        return [null];
      default:
        return [null];
    }
  },
};

export const ipcActions: ActionTree<State, State> = {
  [QUERY_CONFIG]: async ({ dispatch }): Promise<std> => {
    const [err, config] = await dispatch('storage/query');

    if (err !== null) {
      return [new Error('query storage config failed!')];
    }

    return [null, config];
  },
};

export default {
  ...actions,
  ...ipcActions,
};
