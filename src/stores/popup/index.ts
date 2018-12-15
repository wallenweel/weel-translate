import Vue from 'vue';
import Vuex, { MutationTree, ActionTree, ModuleTree } from 'vuex';
import translation from './modules/translation';

Vue.use(Vuex);

const state: State = {};

const mutations: MutationTree<State> = {};

const actions: ActionTree<State, State> = {};

const modules: ModuleTree<State> = {
  translation,
};

export default new Vuex.Store<State>({
  state, actions, mutations, modules,
});

export interface State {
  [name: string]: any;
}
