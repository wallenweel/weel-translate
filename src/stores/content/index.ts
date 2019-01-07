import Vue from 'vue';
import Vuex, { MutationTree, ActionTree, ModuleTree, GetterTree } from 'vuex';
import storage from '../modules/storage';
import preference, { register as preferenceRegister } from './modules/preference';
import translation, { register as translationRegister } from './modules/translation';
import { update, clear } from '@/stores/mutations';
import { presetInvoker } from '@/functions';
import { ipcActionRequestor } from '@/stores/';
import { UPDATED_CONFIG } from '@/types';
import debug from '@/functions/debug';

Vue.use(Vuex);

const register = [
  'template_layouts',
  'template_enabled_sources',
  ...Object.keys(preferenceRegister),
  ...Object.keys(translationRegister),
] as Array<keyof DefaultConfig>;

let Port: RuntimePort;

const state: State = {
  notify: null,

  text: null,
  lastText: null,
  rect: {
    offset: { x: 0, y: 0 },
    size: { height: 0, width: 0 },
    position: { top: 0, right: 0, bottom: 0, left: 0 },
  },
  initOffset: null,
};

const mutations: MutationTree<State> = {
  update, clear,
};

const ipcActions: ActionTree<State, State> = {
  [UPDATED_CONFIG]: ({ dispatch }, { payload }) => {
    dispatch('storage/fetch', register);
  },
};

const actions: ActionTree<State, State> = {
  ...ipcActions,

  init: ({ dispatch }, { port }) => {
    Port = port;

    dispatch('translation/init');

    dispatch('storage/init', { page: 'content', keys: register});
  },

  ipc: async (_, action) => ipcActionRequestor(Port, action),

  selection: ({ state, dispatch }, selection: Selection) => {
    const text: string = selection.toString().trim();

    if (!text.length) {
      if (!!state.text) { dispatch('unselect'); }
      return;
    }

    if (state.lastText === text) {
      if (!!state.lastText && !state.text) { dispatch('selected'); }
      return;
    }

    const rect: ClientRect = selection.getRangeAt(0).getBoundingClientRect();

    dispatch('select', [text, rect]);
  },

  select: ({ commit }, [text, rect]) => {
    const {
      x, y,
      height, width,
      top, right, bottom, left,
    } = rect;
    const [offset, size, position] = [
      { x, y },
      { height, width },
      { top, right, bottom, left },
    ];

    commit('update', {
      text, lastText: text,
      rect: { offset, size, position },
    });
    commit('translation/text', text);

    if (!state.initOffset) { commit('update', { initOffset: [x, y] }); }
  },

  selected: ({ commit, state }) => {
    commit('update', { text: state.lastText });
  },

  unselect: ({ commit }) => {
    commit('update', { text: null, initOffset: null });
    commit('translation/update', { result: null });
  },

  notify: ({ commit }, message: string) => {
    commit('update', { notify: message || null });
    setTimeout(() => {
      commit('update', { notify: null });
    }, 3000);
  },
};

const getters: GetterTree<State, State> = {
  locale: (state): Language['code'] => state.storage.ui_language,
  resultLayout: (state): LayoutPreset => {
    const {
      template_layouts: layouts,
      template_enabled_sources: sourcesTemplate,
    } = state.storage;
    const id = (sourcesTemplate[state.translation.source.id] || [])[0];
    return presetInvoker(id, layouts)[1] as LayoutPreset;
  },
  hasSelection: (state): boolean => !!state.text,
  rectOffsetCC: (state): [number, number] => {
    const { offset: { x, y }, size: { width, height } } = state.rect;
    return [x + width / 2, y + height / 2];
  },
  rectOffsetTC: (state): [number, number] => {
    const { offset: { x, y }, size: { width } } = state.rect;
    return [x + width / 2, y];
  },
  rectOffsetBC: (state): [number, number] => {
    const { offset: { x, y }, size: { width, height } } = state.rect;
    return [x + width / 2, y + height];
  },
  rectOffsetBR: (state): [number, number] => {
    const { offset: { x, y }, size: { width, height } } = state.rect;
    return [x + width, y + height];
  },
  isRectUp: (state): boolean => {
    const { initOffset, rect: { offset } } = state;
    const [, y]: [number, number] = initOffset || [0, 0];
    return offset.y < y;
  },
};

const modules: ModuleTree<State> = {
  storage, preference, translation,
};

const store = new Vuex.Store<State>({
  state, actions, mutations, getters, modules,
});

store.subscribe((mutation) => {
  if (mutation.type === 'storage/update') {
    store.dispatch('preference/fetch');
    store.dispatch('translation/fetch');
  }
});

export default store;

export interface State {
  notify: null | string;

  text: string | null;
  lastText: string | null;
  rect: {
    offset: { x: number; y: number; };
    size: { height: number; width: number; };
    position: { top: number; right: number; bottom: number; left: number; };
  };
  initOffset: null | [number, number];

  [name: string]: any;
}
