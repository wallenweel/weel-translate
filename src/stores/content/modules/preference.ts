import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { State as RootState } from '../index';
import { update, clear } from '@/stores/mutations';
import { configRegister } from '@/functions';

const namespaced: boolean = true;

const state: State = {
  timeout: 15000,
  locale: 'en',

  theme: 'light',
  fabEnable: true,
  fabPosition: 'auto-center',
  fapEnable: true,
  fapPosition: 'follow',
  fapPositionEdge: 'tc',
  contextMenuEnable: true,
};

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

const pullConfig = (configRegister as ConfigRegistFn<State>)(register, 'pull');
const pushConfig = (configRegister as ConfigRegistFn<State>)(register, 'push');

const actions = {
  fetch: ({ commit, rootState }) => {
    commit('update', pullConfig(rootState.storage));
  },

  merge: async ({ commit, dispatch }, changes) => {
    await dispatch('storage/merge', pushConfig(changes), { root: true });
  },
} as ActionTree<State, RootState>;

const mutations = Object.assign({
} as MutationTree<State>, { update, clear });

const getters: GetterTree<State, RootState> = {
};

export const preference: Module<State, RootState> = {
  namespaced, state, actions, mutations, getters,
};

export default preference;

type C = PreferenceConfig;
interface State {
  timeout: number;
  locale: Language['code'];
  locales?: Language[];

  theme: C['preference_theme'];
  fabEnable: C['preference_fab_enable'];
  fabPosition: C['preference_fab_position'];
  fapEnable: C['preference_fap_enable'];
  fapPosition: C['preference_fap_position'];
  fapPositionEdge: C['preference_fap_position_edge'];
  contextMenuEnable: C['preference_context_menu_enable'];
}
