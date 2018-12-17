import { MutationTree, ActionTree, Module } from 'vuex';
import { State as RootState } from '../index';

import { update, clear } from '@/stores/mutations';
import request from '@/apis/request';
import google from '@/defaults/sources/google';
import { translationResultParser } from '@/functions';

import debug from '@/functions/debug';

const namespaced: boolean = true;

const state: State = {
  text: '', // query text {q}

  hotkey: 'enter',

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

    const translationRequest = request(google);
    const response = await translationRequest({ q, from, to });
    const res = response[1].data;
    const result = translationResultParser(res, google.parser);
    debug.log(res, result);
  },
};

const ipcActions: ActionTree<State, RootState> = {};

const actions = Object.assign({
  init: ({ commit, rootState }) => {
    const {
      translation_sources: sources,
      translation_current_source: source,
      translation_enabled_sources: enabledSources,
      translation_recent: recent,
      translation_picked: picked,
    } = rootState.storage;

    commit('update', { source, sources, enabledSources, recent, picked });
  },

  query: ({ dispatch }, data: any) => {
    dispatch('translateText', data);
  },
} as ActionTree<State, RootState>, TARGET_BROWSER === 'web' ? webActions : ipcActions);

export const translation: Module<State, RootState> = {
  namespaced, state, actions, mutations,
};

export default translation;

interface State {
  text: string;

  hotkey: 'enter' | 'ctrl+enter';

  source: SourcePresetItem;
  sources: SourcePreset[];
  enabledSources: SourcePresetItem[];
  recent: translationListItem[] | [];
  picked: translationListItem[] | [];
  [key: string]: any;
}
