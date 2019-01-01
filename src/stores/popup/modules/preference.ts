import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { State as RootState } from '../index';
import i18n from '@/i18n';

import { update, clear } from '@/stores/mutations';
import debug from '@/functions/debug';
import { presetLanguagesFilter } from '@/functions';

const namespaced: boolean = true;

const state: State = {
  timeout: 15000,
  locale: 'en',
  locales: [],

  theme: 'light',
  fabEnable: true,
  fabPosition: 'center',
  fapEnable: true,
  fapPosition: 'center',
  fapPositionEdge: 'tc',
  contextMenuEnable: true,
};

const serialize = (values: DefaultConfig) => {
  const {
    request_timeout: timeout,
    ui_language: locale,
    preference_theme: theme,
    preference_fab_enable: fabEnable,
    preference_fab_position: fabPosition,
    preference_fap_enable: fapEnable,
    preference_fap_position: fapPosition,
    preference_fap_position_edge: fapPositionEdge,
    preference_context_menu_enable: contextMenuEnable,
  } = values;

  // tslint:disable-next-line:max-line-length
  return { timeout, locale, theme, fabEnable, fabPosition, fapEnable, fapPosition, fapPositionEdge, contextMenuEnable };
};

const unserialize = (values: State) => {
  const {
    // tslint:disable:variable-name
    timeout: request_timeout,
    locale: ui_language,
    theme: preference_theme,
    fabEnable: preference_fab_enable,
    fabPosition: preference_fab_position,
    fapEnable: preference_fap_enable,
    fapPosition: preference_fap_position,
    fapPositionEdge: preference_fap_position_edge,
    contextMenuEnable: preference_context_menu_enable,
    // tslint:enable:variable-name
  } = values;

  // tslint:disable-next-line:max-line-length
  return { request_timeout, ui_language, preference_theme, preference_fab_enable, preference_fab_position, preference_fap_enable, preference_fap_position, preference_fap_position_edge, preference_context_menu_enable };
};

const webActions: ActionTree<State, RootState> = {
  reset: ({ dispatch }) => {
    dispatch('storage/reset', Object.keys(unserialize({} as State)), { root: true });
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
    commit('update', serialize(rootState.storage));
  },

  merge: async ({ commit, dispatch }, changes) => {
    await dispatch('storage/merge', unserialize(changes), { root: true });
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
    if (Object.keys(state).includes(c)) { p[c] = state[c]; }
    return p;
  }, {}),
};

export const preference: Module<State, RootState> = {
  namespaced, state, actions, mutations, getters,
};

export default preference;

interface State {
  timeout: number;
  locale: Language['code'];
  locales?: Language[];

  theme: 'dark' | 'light';
  fabEnable: boolean;
  fabPosition: 'after' | 'center' | 'follow';
  fapEnable: boolean;
  fapPosition: 'center' | 'follow' | 'edge';
  fapPositionEdge: 'tl' | 'tc' | 'tr' | 'bl' | 'bc' | 'br';
  contextMenuEnable: boolean;

  [name: string]: any;
}
