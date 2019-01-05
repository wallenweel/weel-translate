import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { State as RootState } from '../index';
import i18n from '@/i18n';

import { update, clear } from '@/stores/mutations';
import {
  State,
  namespaced,
  state as commonState,
  register,
  actions as commonActions,
  webActions,
  ipcActions,
  getters as commonGetters,
} from '@/stores/modules/translation';
import {
  translationResultParser as resultParser,
} from '@/functions';

const state: State = {
  ...commonState,
};

const mutations = Object.assign({
  flag: (state, type: 'voice' | '' = '') => {
    const item = `${type}flag` as 'flag' | 'voiceflag';
    state[item] = !state[item];
  },
  text: (state, text) => { state.text = text; },
} as MutationTree<State>, { update, clear });

const actions = Object.assign({
  ...commonActions,

  init: ({ state, commit, dispatch }) => {/** */},

  done: ({ state, getters, commit, dispatch }, { type, data, error }) => {
    if (type === 'text') {
      commit('flag');

      const [, result] = resultParser(data, getters.preset!);

      commit('update', { result });

      dispatch('record');
      dispatch('notify', null);

      if (!!error) {
        let message: string = error;

        if (/cancel/i.test(message)) { message = i18n.t('request_cancel_msg') as string; }
        if (/timeout/i.test(message)) { message = i18n.t('request_timeout_msg') as string; }

        dispatch('notify', message || i18n.t('__failed__.translation'));
      }
    }

    if (type === 'audio') {
      commit('flag', 'voice');
      dispatch('notify', null);

      if (!!error) { dispatch('notify', i18n.t('__failed__.voice')); }
    }
  },
} as ActionTree<State, RootState>, TARGET_BROWSER === 'web' ? webActions : ipcActions);

const getters: GetterTree<State, RootState> = {
  ...commonGetters,
};

export const translation: Module<State, RootState> = {
  namespaced, state, actions, mutations, getters,
};

export default translation;

export { register };
