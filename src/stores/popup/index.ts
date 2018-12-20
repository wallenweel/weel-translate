import Vue from 'vue';
import Vuex, { MutationTree, ActionTree, ModuleTree } from 'vuex';
import storage from './modules/storage';
import preference from './modules/preference';
import translation from './modules/translation';
import debug from '@/functions/debug';

Vue.use(Vuex);

const state: State = {};

const mutations: MutationTree<State> = {};

const actions: ActionTree<State, State> = {
  init: ({ state, dispatch }) => {
    dispatch('storage/init')
      .then(() => dispatch('preference/init'))
      .then(() => dispatch('translation/init'))
      .then(() => {
        // debug.log(state.storage);
      });
  },
};

const modules: ModuleTree<State> = {
  storage, preference, translation,
};

export default new Vuex.Store<State>({
  state, actions, mutations, modules,
});

export interface State {
  [name: string]: any;
}
