import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { State as RootState } from '../index';

import { update, clear } from '@/stores/mutations';
import request from '@/apis/request';
import {
  translationResultParser,
  presetInvoker,
  presetLanguagesFilter,
  presetLanguagesModifier,
} from '@/functions';

import debug from '@/functions/debug';

const namespaced: boolean = true;

const state: State = {
  hotkey: 'enter',

  text: '', // query text {q}
  languages: [],
  result: {},

  sources: [],
  source: { id: 'nil', name: 'Nil', fromto: ['nil', 'nil'] },
  enabledSources: [],
  recent: [],
  picked: [],
};

const mutations = Object.assign({
} as MutationTree<State>, { update, clear });

const webActions: ActionTree<State, RootState> = {
  query: ({ state, commit }, params) => {
    const { sources, source: { id } } = state;
    const preset = presetInvoker(id, sources)[1] as SourcePreset;
    const translationRequest = request(preset);

    return translationRequest(params).then(([_, { data }]) => {
      debug.log(data);
      const [error, result] = translationResultParser(data, preset.parser);
      commit('update', { result });
      return result;
    });
  },
};

const ipcActions: ActionTree<State, RootState> = {};

const actions = Object.assign({
  init: ({ commit, dispatch, rootState }) => {
    const {
      translation_sources: sources,
      translation_current_source: source,
      translation_enabled_sources: enabledSources,
      translation_recent: recent,
      translation_picked: picked,
    } = rootState.storage;

    commit('update', { source, sources, enabledSources, recent, picked });

    dispatch('languages');
  },

  translate: ({ state, dispatch }) => {
    const { text: q, source: { fromto: [from, to] } } = state;
    return dispatch('query', { q, from, to });
  },

  languages: async ({ state, commit }) => {
    let languages: Language[] = await import(/** webpackChunkName "languages" */ '@/assets/languages.json');

    const { source, sources } = state;
    const [_, preset] = presetInvoker(source.id, sources) as [null, SourcePreset];

    languages = (languages as any).default;
    languages = presetLanguagesFilter(languages, preset.include, preset.exclude)[1] as Language[];
    languages = presetLanguagesModifier(languages, preset.modify)[1] as Language[];

    commit('update', { languages });

    return languages;
  },

  text: ({ commit }, text) => { commit('update', { text }); },
  fromto: ({ state, commit }, fromto) => {
    commit('update', { source: { ...state.source, fromto } });
  },
} as ActionTree<State, RootState>, TARGET_BROWSER === 'web' ? webActions : ipcActions);

const getters: GetterTree<State, RootState> = {
  fromto: (state) => state.source.fromto,
};

export const translation: Module<State, RootState> = {
  namespaced, state, actions, mutations, getters,
};

export default translation;

interface State {
  hotkey: 'enter' | 'ctrl+enter';

  text: string;
  languages: Language[];
  result: { [name: string]: any };

  sources: presetStringJson[];
  source: SourcePresetItem;
  enabledSources: SourcePresetItem[];
  recent: translationListItem[] | [];
  picked: translationListItem[] | [];

  [key: string]: any;
}
