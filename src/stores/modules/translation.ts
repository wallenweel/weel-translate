import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { State as RootState } from '@/stores/';
import { update, clear } from '@/stores/mutations';
import {
  istype,
  presetInvoker,
} from '@/functions';
import i18n from '@/i18n';
import md5 from 'js-md5';
import { QUERY_TRANSLATION } from '@/types';
import { translation as translationQuery } from '@/apis/request';
import { requestTimeout } from '@/variables';
import debug from '@/functions/debug';

export const namespaced: boolean = true;

export const register: configPairs<State> = {
  request_timeout: 'timeout',
  translation_sources: 'sources',
  translation_current_source: 'source',
  translation_enabled_sources: 'enabledSources',
  translation_recent: 'recent',
  translation_recent_numbers: 'recentNumbers',
  translation_picked: 'picked',
};

export const state: State = {
  text: '', // query text {q}
  result: {},
  timeout: 1000,
  translating: false,
  voicing: false,

  sources: [],
  source: { id: '', name: '', fromto: ['', ''] },
  enabledSources: [],
  recent: [],
  recentNumbers: 0,
  picked: [],
};

export const mutations: MutationTree<State> = {
  translating: (state, status: boolean) => {
    state.translating = status;
  },
  voicing: (state, status: boolean) => {
    state.voicing = status;
  },
  text: (state, text) => { state.text = text; },
  update,
  clear,
};

export const webActions: ActionTree<State, RootState> = {
  query: async ({ state, dispatch, getters }, { type = 'text', params }) => {
    const { timeout = requestTimeout } = state;
    const { preset } = getters;
    const [error, payload] = await translationQuery({ type, params, timeout, preset });

    return { error, payload };
  },
};

export const ipcActions: ActionTree<State, RootState> = {
  query: async ({ dispatch }, { type, params }) => {
    const action: IpcAction = {
      type: QUERY_TRANSLATION,
      payload: { type, params },
    };

    return await dispatch('ipc', action, { root: true });
  },
};

export const actions: ActionTree<State, RootState> = {
  source: ({ state, dispatch }, id) => {
    const source: SourcePresetItem = state.enabledSources
      .filter((item: SourcePresetItem) => item.id === id)[0];
    dispatch('merge', { source });
  },

  translate: async ({ state, dispatch }, custom?: { text: string, source: SourcePresetItem }) => {
    const { text: q, source: { fromto: [from, to] } } = custom || state;

    if (!q.trim().length) {
      return dispatch('notify', i18n.t('blank_input_msg'));
    }

    const result = await dispatch('text', { q, from, to });
    if (!result) { return; }

    dispatch('result', result);
  },

  text: async ({ commit, dispatch }, { q, from, to }) => {
    commit('translating', true);

    const { error, payload } = await dispatch('query', { type: 'text', params: { q, from, to } });

    commit('translating', false);

    if (await dispatch('cancel', { type: 'text', error })) { return; }

    return payload;
  },

  voice: async ({ state, dispatch, commit }, [src, dest]) => {
    const { text, source: { fromto: [f, t] }, result } = state;
    let [q, from]: [string, Language['code']] = ['', ''];

    if (!!src) { [q, from] = [text, f]; }
    if (!!dest) { [q, from] = [dest || result.translation, t]; }

    commit('voicing', true);

    const { error } = await dispatch('query', { type: 'audio', params: { q, from } });

    commit('voicing', false);
    if (await dispatch('cancel', { type: 'text', error })) { return; }
  },

  pick: ({ state, dispatch }, params) => {
    const { source, result, text, picked } = state;

    let {
      title = '',
      // excerpt = '',
    } = params || {};
    title = title || result.translation;

    const id: string = md5(`${text + title + source.fromto.join('')}`);

    if (!!picked.filter((p) => p.id === id)[0]) {
      return dispatch('notify', 'item has picked');
    }

    title = title === '__unfound__' ? i18n.t(title) : title;
    // excerpt = (excerpt || result.explain);
    // excerpt = excerpt === '__unfound__' ? i18n.t(excerpt) : excerpt;
    // excerpt = excerpt.length >= 21 ? excerpt.slice(0, 21) + '...' : excerpt;

    const item: translationListItem[] = [{ id, source, text, title }];

    dispatch('merge', { picked: item.concat(picked) });
  },

  unpick: ({ state, dispatch }, id: string | string[]) => {
    const picked = (state.picked as translationListItem[]).reduce((p: any[], c) => {
      if (!!c) {
        if ((istype(id, 'string') && id === c.id) ||
          (istype(id, 'array') && id.includes(c.id))) { return p; }
      }
      p.push(c);
      return p;
    }, []);

    if (picked.length === state.picked.length) { return; }

    dispatch('merge', { picked });
  },

  record: ({ state, dispatch }) => {
    const { text, source, recent, recentNumbers } = state;
    const id = md5(`${text + source.fromto.join('')}`);
    const item: translationListItem[] = [{ id, text, source }];
    let items: translationListItem[] = [...recent];
    if (!!recent.filter((r) => r.id === id)[0]) {
      items = items.reduce((p: any[], c) => {
        if (!!c) {
          if ((istype(id, 'string') && id === c.id) ||
            (istype(id, 'array') && id.includes(c.id))) { return p; }
        }
        p.push(c);
        return p;
      }, []);
    }
    if (items.length >= recentNumbers) {
      items = items.slice(0, recentNumbers);
    }

    dispatch('merge', { recent: item.concat(items) });
  },

  fromto: ({ state, dispatch }, fromto) => {
    const changes = { source: { ...state.source, fromto } };
    dispatch('merge', changes);
  },

  clear: ({ state, dispatch }, type) => {
    if (!type) { return; }
    if (type === 'picked') {
      const ids = (state.picked as translationListItem[]).map((p) => p.id);
      dispatch('unpick', ids);
    }
    if (type === 'recent') {
      // const ids = (state.recent as translationListItem[]).map((p) => p.id);
      dispatch('merge', { recent: [] });
    }
  },

  cancel: ({ dispatch }, { type, error }) => {
    if (error !== null) {
      let message: string = error;

      if (/cancel/i.test(message)) { message = i18n.t('request_cancel_msg') as string; }
      if (/timeout/i.test(message)) { message = i18n.t('request_timeout_msg') as string; }

      const m = { text: 'translation', audio: 'voice' }[type as 'text' | 'audio'];
      dispatch('notify', message || i18n.t(`__failed__.${m}`));

      return true;
    }

    return false;
  },

  notify: ({ dispatch }, message: string) => {
    dispatch('notify', message, { root: true });
  },
};

export const getters: GetterTree<State, RootState> = {
  preset: (state) => presetInvoker(state.source.id, state.sources)[1] as SourcePreset,
  fromto: (state): Array<Language['code']> => state.source.fromto,
  hasResult: (state): boolean => !!Object.values(state.result).length,
};

type C = DefaultConfig;
export interface State {
  text: string;
  result: translationResult;
  translating: boolean;
  voicing: boolean;

  timeout?: C['request_timeout'];

  sources: C['translation_sources'];
  source: C['translation_current_source'];
  enabledSources: C['translation_enabled_sources'];
  recent: C['translation_recent'];
  recentNumbers: C['translation_recent_numbers'];
  picked: C['translation_picked'];
}
