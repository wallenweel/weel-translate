import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { State as RootState } from '../index';
import i18n from '@/i18n';
import { presetLanguagesFilter, configKeysReducer } from '@/functions';
import {
  namespaced,
  register as commonRegister,
  State as CommonState,
  state as commonState,
  mutations as commonMutations,
} from '@/stores/modules/preference';
import languages from '@/assets/languages.json';
import { moduleHelper } from '@/stores';
import debug from '@/functions/debug';

export const register: configPairs<State> = {
  ...commonRegister,

  translation_recent_numbers: 'recentNumbers',
  translation_hotkey: 'hotkey',
};

const state: State = {
  ...commonState,

  locales: [],
  recentNumbers: 0,
  hotkey: 'enter',
};

const mutations: MutationTree<State> = {
  ...commonMutations,
};

const webActions: ActionTree<State, RootState> = {};

const ipcActions: ActionTree<State, RootState> = {};

const actions: ActionTree<State, RootState> = {
  ...(TARGET_BROWSER === 'web' ? webActions : ipcActions),

  init: () => {/** */},

  reset: ({ dispatch }) => {
    dispatch('storage/reset', Object.keys(register), { root: true });
  },
};

const getters: GetterTree<State, RootState> = {
  locales: () => {
    const [error, locales] = presetLanguagesFilter(languages, Object.keys(i18n.messages));
    return locales;
  },
  options: (state) => configKeysReducer([
    'theme',
    'hotkey',
    'fabEnable', 'fabPosition',
    'fapEnable', 'fapPosition', 'fapPositionEdge',
    'contextMenuEnable',
  ], state)[1],
};

export const preference: Module<State, RootState> = {
  namespaced, state, actions, mutations, getters,
};

export default moduleHelper(preference, register);

type C = DefaultConfig;
interface State extends CommonState {
  locales?: Language[];
  recentNumbers: C['translation_recent_numbers'];
  hotkey: C['translation_hotkey'];
}
