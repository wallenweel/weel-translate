import { MutationTree, ActionTree, Module } from 'vuex';
import { State as RootState } from '../index';
import { update, clear } from '@/stores/mutations';
import { storage as apiStorage } from '@/apis/browser';
import defaultConfig from '@/defaults/config';
import { configKeysReducer, istype } from '@/functions';
import debug from '@/functions/debug';

const namespaced: boolean = true;

const state: State = {
  ...defaultConfig,
};

const mutations: MutationTree<State> = { update, clear };

const actions: ActionTree<State, RootState> = {
  init: async ({ dispatch, commit }): Promise<std> => {
    // await dispatch('reset');
    const [, config] = await dispatch('query');

    commit('update', config);

    return [null, config];
  },

  query: async (_, { keys, type }: { keys?: storageKeys, type?: storageType } = {}): Promise<std<any>> => {
    const config = await apiStorage[type || 'local'].get(keys || null);

    const c = { ...config } as any;

    for (const [k, v] of Object.entries(c)) {
      if (istype(v, ['string'])) {
        try {
          c[k] = JSON.parse(v as string);
        } catch (error) {
          continue;
        }
      }
    }

    return [null, c];
  },

  update: async ({ commit }, [config, type]: [DefaultConfig, storageType]): Promise<std> => {
    if (!Object.keys(config).length) {
      return ['empty config'];
    }

    const c = { ...config } as any;

    for (const [k, v] of Object.entries(c)) {
      if (istype(v, ['array', 'object'])) {
        c[k] = JSON.stringify(v);
      }
    }

    await apiStorage[type || 'local'].set(c);

    commit('update', config);

    return [null, true];
  },

  reset: async ({ dispatch }, { keys = [], type }: { keys?: storageKeys, type?: storageType } = {}): Promise<std> => {
    let config = configKeysReducer(keys, defaultConfig)[1] as DefaultConfig;

    if (!Object.keys(config).length) {
      config = { ...defaultConfig };
    }

    const [error] = await dispatch('update', [config, type]);

    if (error !== null) {
      debug.error(`reset storage config failed.`);
      return [error];
    }

    return [null, config];
  },
};

export const storage: Module<State, RootState> = {
  namespaced, state, actions, mutations,
};

export default storage;

interface State extends DefaultConfig {
  [name: string]: any;
}

interface UpdatePayload {
  type?: 'local' | 'sync' | 'managed';
  data: DefaultConfig;
}
