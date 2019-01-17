import Vue from 'vue';
import Vuex, { MutationTree, ActionTree, ModuleTree, GetterTree } from 'vuex';
import storage from '../modules/storage';
import preference, { register as preferenceRegister } from './modules/preference';
import translation, { register as translationRegister } from './modules/translation';
import template, { register as templateRegister } from './modules/template';
import { update, clear } from '@/stores/mutations';
import { locale, theme } from '@/stores/getters';
import { ipcActionRequestor } from '@/stores/';

Vue.use(Vuex);

// regist config keys to states by the hash
const register = [
  ...Object.keys(preferenceRegister),
  ...Object.keys(translationRegister),
  ...Object.keys(templateRegister),
] as Array<keyof DefaultConfig>;

let Port: RuntimePort;

const state: State = {
  notify: null,
};

const mutations: MutationTree<State> = { update, clear };

const actions: ActionTree<State, State> = {
  init: ({ state, dispatch, rootState }, { port }) => {
    // initial a port for connecting other end
    // useless in "web" mode
    Port = port;

    dispatch('storage/init', { page: 'popup', keys: register});
  },

  // send messages to background and get responses
  ipc: async (_, action) => ipcActionRequestor(Port, action),

  // global notify message
  notify: ({ commit }, message: string) => commit('update', { notify: message || null }),
};

const getters: GetterTree<State, State> = {
  locale, theme,
};

const modules: ModuleTree<State> = {
  storage, preference, translation, template,
};

const store = new Vuex.Store<State>({
  state, actions, mutations, getters, modules,
});

// let modules fetch(update) the newest states
store.subscribe((mutation) => {
  if (mutation.type === 'storage/update') {
    store.dispatch('preference/fetch');
    store.dispatch('translation/fetch');
    store.dispatch('template/fetch');
  }
});

export default store;

export interface State {
  notify: null | string;

  [m: string]: any;
}
