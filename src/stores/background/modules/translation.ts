import { MutationTree, ActionTree, Action, Module, GetterTree } from 'vuex';
import { QUERY_TRANSLATION } from '@/types';
import { State as RootState } from '../index';
import md5 from 'js-md5';
import store from '../';

import { update, clear } from '@/stores/mutations';
import {
  translationResultParser as resultParser,
  presetInvoker,
  presetLanguagesFilter,
  presetLanguagesModifier,
  istype,
  configRegister,
} from '@/functions';
import { translationQuery } from '@/stores/actions';
import debug from '@/functions/debug';

const namespaced: boolean = true;

const state: State = {
  text: '', // query text {q}
  languages: [],
  result: {},
  timeout: 1000,
  preset: null,

  sources: [],
  source: { id: 'nil', name: 'Nil', fromto: ['nil', 'nil'] },
  enabledSources: [],
  recent: [],
  recentNumbers: 0,
  picked: [],
};

export const register: configPairs<State> = {
  request_timeout: 'timeout',
  translation_sources: 'sources',
  translation_current_source: 'source',
  translation_enabled_sources: 'enabledSources',
  translation_recent: 'recent',
  translation_recent_numbers: 'recentNumbers',
  translation_picked: 'picked',
};

const pullConfig = (configRegister as ConfigRegistFn<State, DefaultConfig>)(register, 'pull');
const pushConfig = (configRegister as ConfigRegistFn<DefaultConfig, State>)(register, 'push');

const mutations = Object.assign({
  text: (state, text) => { state.text = text; },
} as MutationTree<State>, { update, clear });

type A = Action<State, RootState>;
const actions: ActionTree<State, RootState> = {
  init: async ({ state, dispatch, commit }) => {
    await dispatch('fetch');
    // const preset = presetInvoker(state.source.id, state.sources)[1] as SourcePreset;
    // commit('update', { preset });
  },
  fetch: ({ commit, rootState }) => {
    commit('update', pullConfig(rootState.storage));
  },
  query: translationQuery as A,
};

const getters: GetterTree<State, RootState> = {
  preset: (state) => presetInvoker(state.source.id, state.sources)[1] as SourcePreset,
  fromto: (state): Array<Language['code']> => state.source.fromto,
  hasResult: (state): boolean => !!Object.values(state.result).length,
};

export const translation: Module<State, RootState> = {
  namespaced, state, actions, mutations, getters,
};

export default translation;

type C = DefaultConfig;
interface State {
  text: string;
  languages: Language[];
  result: translationResult;
  preset: null | SourcePreset;

  timeout?: C['request_timeout'];

  sources: C['translation_sources'];
  source: C['translation_current_source'];
  enabledSources: C['translation_enabled_sources'];
  recent: C['translation_recent'];
  recentNumbers: C['translation_recent_numbers'];
  picked: C['translation_picked'];
}
