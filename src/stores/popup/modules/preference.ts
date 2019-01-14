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

  reset: ({ dispatch, getters }, name: 'preference' | 'settings') => {
    const reversedRegister: any = Object.entries({ ...register })
      .reduce((p, [c, s]) => ({ ...p, [s as string]: c }), {});
    const keys = Object.keys(getters[name]).map((k) => reversedRegister[k]);
    dispatch('storage/reset', keys, { root: true });
  },

  save: ({ state, dispatch }, [key, val]: [keyof State, any]) => {
    let value: any = val;

    const extra = {} as { [k in keyof State]: any };

    if (key === 'timeout') { value = val * 1000; }
    if (key === 'fabEnable' && val) {
      extra.immediateFap = false;
      if (!state.fapEnable) { extra.fapEnable = true; }
    }
    if (key === 'fapEnable' && !val) {
      extra.immediateFap = false;
    }
    if (key === 'immediateFap' && val && !state.fapEnable) {
      extra.fapEnable = true;
    }

    dispatch('merge', { [key]: value, ...extra });
  },
};

const getters: GetterTree<State, RootState> = {
  locales: (): Language[] => {
    const [error, locales] = presetLanguagesFilter(languages, Object.keys(i18n.messages));
    return locales as Language[];
  },
  preference: (state): { [k in keyof State]: any } => configKeysReducer([
    'locale',
    'theme',
    'primaryColor',
    'secondaryColor',
    'fabEnable', 'fabPosition',
    'immediateFap',
    'fapEnable', 'fapPosition', 'fapPositionEdge',
  ] as Array<keyof State>, state)[1],
  settings: (state): { [k in keyof State]: any } => configKeysReducer([
    'hotkey',
    'contextMenuEnable',
    'recentNumbers',
    'timeout',
  ] as Array<keyof State>, state)[1],
};

export const preference: Module<State, RootState> = {
  namespaced, state, actions, mutations, getters,
};

export default moduleHelper(preference, register);

type C = DefaultConfig;
export interface State extends CommonState {
  locales?: Language[];
  recentNumbers: C['translation_recent_numbers'];
  hotkey: C['translation_hotkey'];
}
