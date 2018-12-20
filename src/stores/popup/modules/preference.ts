import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { State as RootState } from '../index';

import { update, clear } from '@/stores/mutations';
import debug from '@/functions/debug';

const namespaced: boolean = true;

const state: State = {
  theme: 'light',
  fabEnable: true,
  fabPosition: 'center',
  fapEnable: true,
  fapPosition: 'center',
  fapPositionEdge: 'tc',
  contextMenuEnable: true,
};

const webActions: ActionTree<State, RootState> = {};

const ipcActions: ActionTree<State, RootState> = {};

const actions = Object.assign({
  init: ({ rootState, commit }) => {
    const {
      preference_theme: theme,
      preference_fab_enable: fabEnable,
      preference_fab_position: fabPosition,
      preference_fap_enable: fapEnable,
      preference_fap_position: fapPosition,
      preference_fap_position_edge: fapPositionEdge,
      preference_context_menu_enable: contextMenuEnable,
    } = rootState.storage;

    commit('update', { theme, fabEnable, fabPosition, fapEnable, fapPosition, fapPositionEdge, contextMenuEnable });
  },

  save: ({ commit }, [key, value]) => {
    debug.log({ [key]: value });
    commit('update', { [key]: value });
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
  theme: 'dark' | 'light';
  fabEnable: boolean;
  fabPosition: 'after' | 'center' | 'follow';
  fapEnable: boolean;
  fapPosition: 'center' | 'follow' | 'edge';
  fapPositionEdge: 'tl' | 'tc' | 'tr' | 'bl' | 'bc' | 'br';
  contextMenuEnable: boolean;

  [name: string]: any;
}
