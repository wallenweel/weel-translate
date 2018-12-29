import axios, { Canceler } from 'axios';
import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { QUERY_TRANSLATION } from '@/types';
import { State as RootState } from '../index';
import i18n from '@/i18n';
import store from '../';

import { update, clear } from '@/stores/mutations';
import request from '@/apis/request';
import {
  translationResultParser as resultParser,
  presetInvoker,
  presetLanguagesFilter,
  presetLanguagesModifier,
  istype,
} from '@/functions';

import debug from '@/functions/debug';

let cancelTranslate: Canceler | null;

const namespaced: boolean = true;

const state: State = {
  hotkey: 'enter',

  text: '', // query text {q}
  languages: [],
  result: {},
  timeout: 1000,
  flag: false,

  sources: [],
  source: { id: 'nil', name: 'Nil', fromto: ['nil', 'nil'] },
  enabledSources: [],
  recent: [],
  picked: [],
};

const mutations = Object.assign({
} as MutationTree<State>, { update, clear });

const webActions: ActionTree<State, RootState> = {
  query: ({ state, dispatch }, params) => {
    if (istype(cancelTranslate, 'function')) {
      (cancelTranslate as Canceler)();
      return dispatch('notify', `Don't repeat request.`);
    }

    const { timeout, sources, source: { id } } = state;
    const preset = presetInvoker(id, sources)[1] as SourcePreset;
    const translationRequest = request(preset);

    return translationRequest(params, {
      timeout,
      cancelToken: new axios.CancelToken((cancel: Canceler) => {
        cancelTranslate = cancel;
      }),
    }).then(([_, { data }]) => {
      debug.log(data);
      const [error, result] = resultParser(data, preset.parser);
      dispatch('done', result);
      dispatch('notify', null);
    }).catch(([error]) => {
      debug.log(error);
      dispatch('notify', error.message);
    }).finally(() => {
      cancelTranslate = null;
    });
  },
};

const ipcActions: ActionTree<State, RootState> = {
  query: ({ dispatch }, params) => {
    const action: IpcAction = {
      type: QUERY_TRANSLATION,
      receiver: 'translation/receive',
      payload: { ...params },
    };

    dispatch('ipc', action, { root: true });
  },

  receive: ({ dispatch }, result = {}) => {
    dispatch('done', result);
  },
};

const actions = Object.assign({
  init: ({ state, dispatch }) => {
    store.watch(() => state.source.id, () => {
      dispatch('languages');
    });
  },

  fetch: ({ commit, rootState }) => {
    const {
      request_timeout: timeout,
      translation_sources: sources,
      translation_current_source: source,
      translation_enabled_sources: enabledSources,
      translation_recent: recent,
      translation_picked: picked,
    } = rootState.storage;

    commit('update', { timeout, source, sources, enabledSources, recent, picked });
  },

  merge: ({ dispatch }, changes) => {
    const {
      // tslint:disable:variable-name
      source: translation_current_source,
      recent: translation_recent,
      picked: translation_picked,
      // tslint:enable:variable-name
    } = changes;

    const config = { translation_current_source, translation_recent, translation_picked };

    dispatch('storage/merge', config, { root: true });
  },

  source: ({ state, dispatch }, id) => {
    const source: SourcePresetItem = state.enabledSources
      .filter((item: SourcePresetItem) => item.id === id)[0];
    dispatch('merge', { source });
  },

  translate: ({ state, dispatch }) => {
    const { text: q, source: { fromto: [from, to] } } = state;

    if (!q.trim().length) {
      return dispatch('notify', i18n.t('blank_input_msg'));
    }

    return dispatch('query', { q, from, to });
  },

  languages: async ({ state, commit }) => {
    const { source, sources } = state;
    const [_, preset] = presetInvoker(source.id, sources) as [null, SourcePreset];

    let languages: Language[];

    if (!!preset.languages) {
      languages = preset.languages;
    } else {
      languages = await import(/** webpackChunkName "languages" */ '@/assets/languages.json');
      languages = (languages as any).default;
    }

    languages = presetLanguagesFilter(languages, preset.include, preset.exclude)[1] as Language[];
    languages = presetLanguagesModifier(languages, preset.modify)[1] as Language[];

    commit('update', { languages });

    return languages;
  },

  text: ({ commit }, text) => { commit('update', { text }); },

  fromto: ({ state, dispatch }, fromto) => {
    const changes = { source: { ...state.source, fromto } };
    dispatch('merge', changes);
  },

  done: ({ state, commit }, result) => {
    commit('update', { result, flag: !state.flag });
  },

  notify: ({ dispatch }, message: string) => {
    dispatch('notify', message, { root: true });
  },
} as ActionTree<State, RootState>, TARGET_BROWSER === 'web' ? webActions : ipcActions);

const getters: GetterTree<State, RootState> = {
  fromto: (state): Array<Language['code']> => state.source.fromto,
  hasResult: (state): boolean => !!Object.values(state.result).length,
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
  timeout?: number;
  flag: boolean;

  sources: presetStringJson[];
  source: SourcePresetItem;
  enabledSources: SourcePresetItem[];
  recent: translationListItem[] | [];
  picked: translationListItem[] | [];

  [key: string]: any;
}
