import Vue from 'vue';
import Vuex, { MutationTree, ActionTree, ModuleTree, GetterTree } from 'vuex';
import storage from '../modules/storage';
import preference, { register as preferenceRegister } from './modules/preference';
import translation, { register as translationRegister } from './modules/translation';
import { update, clear } from '@/stores/mutations';
import { presetInvoker } from '@/functions';
import { ipcActionRequestor } from '@/stores/';
import debug from '@/functions/debug';

Vue.use(Vuex);

let Port: RuntimePort;

const state: State = {
  notify: null,
};

const mutations = Object.assign({
} as MutationTree<State>, { update, clear });

const actions: ActionTree<State, State> = {
  init: ({ state, dispatch, rootState }, { port }) => {
    // initial a port for connecting other end
    // useless in "web" mode
    Port = port;

    dispatch('preference/init');
    dispatch('translation/init');

    const keys = [
      'template_layouts',
      'template_enabled_sources',
      ...Object.keys(preferenceRegister),
      ...Object.keys(translationRegister),
    ] as Array<keyof DefaultConfig>;

    dispatch('storage/init', { page: 'popup', keys});
  },

  ipc: async (_, action) => ipcActionRequestor(Port, action),

  notify: ({ commit }, message: string) => {
    commit('update', { notify: message || null });
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

  [name: string]: any;
}
