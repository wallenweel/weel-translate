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

  init: () => {/** */},

  done: ({ getters, commit, dispatch }, { type, data }) => {
    if (type === 'text') {
      commit('flag');

      const [error, result] = resultParser(data, getters.preset!);
      if (error !== null) { dispatch('notify', error); }

      commit('update', { result });

      dispatch('record');
    }

    if (type === 'audio') {
      commit('flag', 'voice');
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
