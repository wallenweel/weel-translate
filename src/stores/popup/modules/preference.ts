import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { State as RootState } from '../index';
import i18n from '@/i18n';

import { update, clear } from '@/stores/mutations';
import debug from '@/functions/debug';
import { presetLanguagesFilter, configRegister } from '@/functions';

const namespaced: boolean = true;

const state: State = {
  timeout: 15000,
  locale: 'en',
  locales: [],

  recentNumbers: 0,

  theme: 'light',
  fabEnable: true,
  fabPosition: 'center',
  fapEnable: true,
  fapPosition: 'center',
  fapPositionEdge: 'tc',
  contextMenuEnable: true,
};

export const register: configPairs<State> = {
  request_timeout: 'timeout',
  ui_language: 'locale',
  translation_recent_numbers: 'recentNumbers',
  preference_theme: 'theme',
  preference_fab_enable: 'fabEnable',
  preference_fab_position: 'fabPosition',
  preference_fap_enable: 'fapEnable',
  preference_fap_position: 'fapPosition',
  preference_fap_position_edge: 'fapPositionEdge',
  preference_context_menu_enable: 'contextMenuEnable',
};

const pullConfig = (configRegister as ConfigRegistFn<State, DefaultConfig>)(register, 'pull');
const pushConfig = (configRegister as ConfigRegistFn<DefaultConfig, State>)(register, 'push');

const webActions: ActionTree<State, RootState> = {
  reset: ({ dispatch }) => {
    dispatch('storage/reset', Object.keys(pushConfig({} as State)), { root: true });
  },
};

const ipcActions: ActionTree<State, RootState> = {};

const actions = Object.assign({
  init: ({ rootState, commit, dispatch }) => {
    dispatch('locales');
  },

  locales: async ({ commit }) => {
    let languages: Language[] = await import(/** webpackChunkName "languages" */ '@/assets/languages.json');
    languages = (languages as any).default;
    const locales = Object.keys(i18n.messages);
    languages = presetLanguagesFilter(languages, locales)[1] as Language[];
    commit('update', { locales: languages });
  },

  fetch: ({ commit, rootState }) => {
    commit('update', pullConfig(rootState.storage));
  },

  merge: async ({ commit, dispatch }, changes) => {
    await dispatch('storage/merge', pushConfig(changes), { root: true });
  },
} as ActionTree<State, RootState>, TARGET_BROWSER === 'web' ? webActions : ipcActions);

const mutations = Object.assign({
} as MutationTree<State>, { update, clear });

const getters: GetterTree<State, RootState> = {
  options: (state) => [
    'theme',
    'fabEnable',
    'fabPosition',
    'fapEnable',
    'fapPosition',
    'fapPositionEdge',
    'contextMenuEnable',
  ].reduce((p: any, c: string) => {
    if (Object.keys(state).includes(c)) { p[c] = state[c as keyof State]; }
    return p;
  }, {}),
};

export const preference: Module<State, RootState> = {
  namespaced, state, actions, mutations, getters,
};

export default preference;

type C = DefaultConfig;
interface State {
  locales?: Language[];

  timeout: C['request_timeout'];
  locale: C['ui_language'];

  recentNumbers: C['translation_recent_numbers'];

  theme: C['preference_theme'];
  fabEnable: C['preference_fab_enable'];
  fabPosition: C['preference_fab_position'];
  fapEnable: C['preference_fap_enable'];
  fapPosition: C['preference_fap_position'];
  fapPositionEdge: C['preference_fap_position_edge'];
  contextMenuEnable: C['preference_context_menu_enable'];
}
