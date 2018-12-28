import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { State as RootState } from '../index';
import { update, clear } from '@/stores/mutations';

const namespaced: boolean = true;

const state: State = {
  timeout: 15000,
  locale: 'en',

  theme: 'light',
  fabEnable: true,
  fabPosition: 'center',
  fapEnable: true,
  fapPosition: 'center',
  fapPositionEdge: 'tc',
  contextMenuEnable: true,
};

const actions = {
  init: ({ rootState, commit, dispatch }) => {
    //
  },

  fetch: ({ commit, rootState }) => {
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
    } = rootState.storage;

    // tslint:disable-next-line:max-line-length
    commit('update', { timeout, locale, theme, fabEnable, fabPosition, fapEnable, fapPosition, fapPositionEdge, contextMenuEnable });
  },

  merge: async ({ commit, dispatch }, changes) => {
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
    } = changes;

    // tslint:disable-next-line:max-line-length
    const config = { request_timeout, ui_language, preference_theme, preference_fab_enable, preference_fab_position, preference_fap_enable, preference_fap_position, preference_fap_position_edge, preference_context_menu_enable };

    await dispatch('storage/merge', config, { root: true });
  },
} as ActionTree<State, RootState>;

const mutations = Object.assign({
} as MutationTree<State>, { update, clear });

export const preference: Module<State, RootState> = {
  namespaced, state, actions, mutations,
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
