import Vue from 'vue';
import Vuex, { MutationTree, ModuleTree } from 'vuex';
import actions from './actions';
import translation from './modules/translation';
import storage from './modules/storage';
import debug from '@/functions/debug';

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
  storage, translation,
};

const store = new Vuex.Store<State>({
  state, actions, mutations, modules,
});

store.subscribe((mutation) => {
  if (mutation.type === 'storage/update') {
    store.dispatch('translation/fetch');
  }
});

export default store;

export interface State {
  [name: string]: any;
}
