import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { State as RootState } from '@/stores/index';
import { update, clear } from '@/stores/mutations';
import debug from '@/functions/debug';

export const namespaced: boolean = true;

export const register: configPairs<State> = {
  request_timeout: 'timeout',
  ui_language: 'locale',
  preference_theme: 'theme',
  preference_fab_enable: 'fabEnable',
  preference_fab_position: 'fabPosition',
  preference_fap_enable: 'fapEnable',
  preference_fap_position: 'fapPosition',
  preference_fap_position_edge: 'fapPositionEdge',
  preference_context_menu_enable: 'contextMenuEnable',
};

export const state: State = {
  timeout: 15000,
  locale: '',
  theme: 'light',
  fabEnable: true,
  fabPosition: 'auto-center',
  fapEnable: true,
  fapPosition: 'follow',
  fapPositionEdge: 'tc',
  contextMenuEnable: true,
};

export const mutations: MutationTree<State> = { update, clear };

export const webActions: ActionTree<State, RootState> = {};

export const ipcActions: ActionTree<State, RootState> = {};

export const actions: ActionTree<State, RootState> = {
  ...(TARGET_BROWSER === 'web' ? webActions : ipcActions),
};

export const getters: GetterTree<State, RootState> = {};

export const preference: Module<State, RootState> = {
  namespaced, state, actions, mutations, getters,
};

export default preference;

type C = DefaultConfig;
export interface State {
  timeout: C['request_timeout'];
  locale: C['ui_language'];

  theme: C['preference_theme'];
  fabEnable: C['preference_fab_enable'];
  fabPosition: C['preference_fab_position'];
  fapEnable: C['preference_fap_enable'];
  fapPosition: C['preference_fap_position'];
  fapPositionEdge: C['preference_fap_position_edge'];
  contextMenuEnable: C['preference_context_menu_enable'];
}
