import { MutationTree, ActionTree, Module } from 'vuex';
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

  source: { id: 'nil', name: 'Nil', fromto: ['nil', 'nil'] },
  sources: [],
  enabledSources: [],
  recent: [],
  picked: [],
};

const mutations = Object.assign({
  text: (state, text) => { state.text = text; },
} as MutationTree<State>, { update, clear });

const webActions: ActionTree<State, RootState> = {
  translateText: async ({ state }, data) => {
    const { text: q, source: { id, fromto: [from, to] } } = state;

    // const translationRequest = request(google);
    // const response = await translationRequest({ q, from, to });
    // const res = response[1].data;
    // const result = translationResultParser(res, google.parser);
    // debug.log(res, result);
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

  query: ({ dispatch }, data: any) => {
    dispatch('translateText', data);
  },

  languages: async ({ state, commit }) => {
    let languages: Language[] = await import(/** webpackChunkName: "languages" */ '@/assets/languages.json');

    const { source, sources } = state;
    const [_, preset] = presetInvoker(source.id, sources) as [null, SourcePreset];

    languages = (languages as any).default;
    languages = presetLanguagesFilter(languages, preset.include, preset.exclude)[1] as Language[];
    languages = presetLanguagesModifier(languages, preset.modify)[1] as Language[];

    commit('update', { languages });

    return languages;
  },
} as ActionTree<State, RootState>, TARGET_BROWSER === 'web' ? webActions : ipcActions);

export const translation: Module<State, RootState> = {
  namespaced, state, actions, mutations,
};

export default translation;

interface State {
  hotkey: 'enter' | 'ctrl+enter';

  text: string;
  languages: Language[];

  source: SourcePresetItem;
  sources: presetStringJson[];
  enabledSources: SourcePresetItem[];
  recent: translationListItem[] | [];
  picked: translationListItem[] | [];
  [key: string]: any;
}
