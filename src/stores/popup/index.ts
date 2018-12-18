import Vue from 'vue';
import Vuex, { MutationTree, ActionTree, ModuleTree } from 'vuex';
import translation from './modules/translation';
import storage from './modules/storage';
import debug from '@/functions/debug';

Vue.use(Vuex);

const state: State = {};

const mutations: MutationTree<State> = {};

const actions: ActionTree<State, State> = {
  init: ({ state, dispatch }) => {
    dispatch('storage/init')
      .then(() => dispatch('translation/init'))
      .then(() => {
        // debug.log(state.storage);
      });
  },
};

const modules: ModuleTree<State> = {
  translation, storage,
};

export default new Vuex.Store<State>({
  state, actions, mutations, modules,
});

export interface State {
  [name: string]: any;
}
