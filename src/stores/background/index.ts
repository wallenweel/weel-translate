import Vue from 'vue';
import Vuex, { MutationTree, ModuleTree } from 'vuex';
import debug from '@/functions/debug';
import actions from './actions';
import { storage } from './modules/storage';

Vue.use(Vuex);

const state: State = {};

const mutations: MutationTree<State> = {
  update: (state, data: object = {}): void => {
    for (const [key, value] of Object.entries(data)) {
      const target = state[key];

      if (!target) {
        state[key] = value;
      } else {
        state[key] = Object.assign({}, target, value);
      }
    }
  },
};

const modules: ModuleTree<State> = {
  storage,
};

export default new Vuex.Store<State>({
  state, actions, mutations, modules,
});

export interface State {
  [name: string]: any;
}
