import Vue from 'vue';
import Vuex, { MutationTree, ModuleTree, GetterTree } from 'vuex';
import actions from './actions';
import { update, clear } from '@/stores/mutations';
import translation from './modules/translation';
import storage from './modules/storage';
import debug from '@/functions/debug';

Vue.use(Vuex);

const state: State = {};

const mutations: MutationTree<State> = {
  update, clear,
};

const modules: ModuleTree<State> = {
  storage, translation,
};

const store = new Vuex.Store<State>({
  state, actions, mutations, modules,
});

export default store;

export interface State {
  [name: string]: any;
}
