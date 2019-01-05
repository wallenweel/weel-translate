import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { State as RootState } from '../index';
import i18n from '@/i18n';

import {
  State as CommonState,
  namespaced,
  state as commonState,
  register,
  mutations as commonMutations,
  actions as commonActions,
  webActions,
  ipcActions,
  getters as commonGetters,
} from '@/stores/modules/translation';
import {
  translationResultParser as resultParser,
  presetLanguagesFilter,
  presetLanguagesModifier,
} from '@/functions';
import languages from '@/assets/languages.json';

const state: State = {
  hotkey: 'enter',

  ...commonState,
};

const mutations: MutationTree<State> = {
  ...commonMutations,
};

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

  languages: (state, getters) => {
    const { preset } = getters;
    if (!preset) { return []; }

    let out: Language[];
    if (!!preset.languages) {
      out = preset.languages;
    } else {
      out = languages;
      // out = await import(/** webpackChunkName "languages" */ '@/assets/languages.json');
      // out = (languages as any).default;
    }

    out = presetLanguagesFilter(out, preset.include, preset.exclude)[1] as Language[];
    out = presetLanguagesModifier(out, preset.modify)[1] as Language[];

    return out;
  },
};

export const translation: Module<State, RootState> = {
  namespaced, state, actions, mutations, getters,
};

export default translation;

export { register };

interface State extends CommonState {
  hotkey: 'enter' | 'ctrl+enter';
}
