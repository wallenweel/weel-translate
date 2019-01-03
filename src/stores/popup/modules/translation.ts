import { MutationTree, ActionTree, Action, Module, GetterTree } from 'vuex';
import { QUERY_TRANSLATION } from '@/types';
import { State as RootState } from '../index';
import i18n from '@/i18n';
import md5 from 'js-md5';
import store from '../';

import { update, clear } from '@/stores/mutations';
import {
  translationResultParser as resultParser,
  presetInvoker,
  presetLanguagesFilter,
  presetLanguagesModifier,
  istype,
} from '@/functions';
import { webQuery as query } from '@/stores/actions';
import debug from '@/functions/debug';

const namespaced: boolean = true;

const state: State = {
  hotkey: 'enter',

  text: '', // query text {q}
  languages: [],
  result: {},
  timeout: 1000,
  flag: false,
  voiceflag: false,
  preset: null,

  sources: [],
  source: { id: 'nil', name: 'Nil', fromto: ['nil', 'nil'] },
  enabledSources: [],
  recent: [],
  picked: [],
};

const mutations = Object.assign({
  flag: (state, type: 'voice' | '' = '') => {
    const item = `${type}flag`;
    state[item] = !state[item];
  },
  text: (state, text) => { state.text = text; },
} as MutationTree<State>, { update, clear });

const webActions: ActionTree<State, RootState> = {
  query,
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
  init: ({ state, commit, dispatch }) => {
    store.watch(() => state.source.id, () => {
      const preset = presetInvoker(state.source.id, state.sources)[1] as SourcePreset;
      commit('update', { preset });

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

  translate: ({ state, dispatch }, custom?: { text: string, source: SourcePresetItem }) => {
    const { text: q, source: { fromto: [from, to] } } = custom || state;

    if (!q.trim().length) {
      return dispatch('notify', i18n.t('blank_input_msg'));
    }

    dispatch('text', { q, from, to });
  },

  text: ({ commit, dispatch }, { q, from, to }) => {
    commit('flag');
    dispatch('query', ['text', { q, from, to }]);
  },

  voice: ({ state, dispatch, commit }, [src, dest]) => {
    const { text, source: { fromto: [f, t] }, result } = state;
    let [q, from]: [string, Language['code']] = ['', ''];

    if (!!src) { [q, from] = [text, f]; }
    if (!!dest) { [q, from] = [dest || result.translation, t]; }

    commit('flag', 'voice');
    dispatch('query', ['audio', { q, from }]);
  },

  pick: ({ state, dispatch }, params) => {
    const { source, result, text, picked } = state;

    let { title = '', excerpt = '' } = params || {};
    title = title || result.translation;

    const id: string = md5(`${text + title + source.fromto.join('')}`);

    if (!!picked.filter((p) => p.id === id)[0]) {
      return dispatch('notify', 'item has picked');
    }

    title = title === '__unfound__' ? i18n.t(title) : title;
    excerpt = (excerpt || result.explain);
    excerpt = excerpt === '__unfound__' ? i18n.t(excerpt) : excerpt;
    excerpt = excerpt.length >= 21 ? excerpt.slice(0, 21) + '...' : excerpt;

    const item: translationListItem[] = [{ id, source, text, title, excerpt }];

    dispatch('merge', { picked: item.concat(picked) });
  },
  unpick: ({ state, dispatch }, id) => {
    const { picked } = state;
    delete picked[id];
    dispatch('merge', { picked: picked.filter((p) => !!p) });
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

  fromto: ({ state, dispatch }, fromto) => {
    const changes = { source: { ...state.source, fromto } };
    dispatch('merge', changes);
  },

  done: ({ state, commit, dispatch }, { type, data, error }) => {
    if (type === 'text') {
      commit('flag');

      const [, result] = resultParser(data, state.preset!);

      commit('update', { result });
      dispatch('notify', null);

      if (!!error) {
        let message: string = error;

        if (/cancel/i.test(message)) { message = i18n.t('request_cancel_msg') as string; }
        if (/timeout/i.test(message)) { message = i18n.t('request_timeout_msg') as string; }

        dispatch('notify', message || i18n.t('__failed__.translation'));
      }
    }

    if (type === 'audio') {
      commit('flag', 'voice');
      dispatch('notify', null);

      if (!!error) { dispatch('notify', i18n.t('__failed__.voice')); }
    }
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
  voiceflag: boolean;
  preset: null | SourcePreset;

  sources: presetStringJson[];
  source: SourcePresetItem;
  enabledSources: SourcePresetItem[];
  recent: translationListItem[] | [];
  picked: translationListItem[] | [];

  [key: string]: any;
}
