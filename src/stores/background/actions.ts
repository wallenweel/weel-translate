import axios, { Canceler } from 'axios';
import { ActionTree } from 'vuex';
import { State } from './';
import { versionCheck, presetInvoker, translationResultParser, istype } from '@/functions';
import * as types from '@/types';
import request from '@/apis/request';
import debug from '@/functions/debug';

let cancelRequest: Canceler | null;

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

  [types.QUERY_TRANSLATION]: ({ rootState }, { payload: { type, params } }) => {
    if (istype(cancelRequest, 'function')) {
      (cancelRequest as Canceler)();
      return [`Don't repeat request.`];
    }

    const {
      request_timeout: timeout,
      translation_sources: sources,
      translation_current_source: source,
    } = rootState.storage;

    const preset = presetInvoker(source.id, sources)[1] as SourcePreset;
    const translationRequest = request(preset);
    return translationRequest(params, {
      timeout,
      cancelToken: new axios.CancelToken((cancel: Canceler) => {
        cancelRequest = cancel;
      }),
    }).then(([_, { data }]) => {
      const [error, result] = translationResultParser(data, preset);
      return [error, { type, data }];
    }).catch(([error]) => {
      return [error];
    }).finally(() => {
      cancelRequest = null;
    });
  },
};

export default {
  ...actions,
  ...ipcActions,
};
