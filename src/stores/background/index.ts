import Vue from 'vue';
import Vuex, { ModuleTree } from 'vuex';

import { storage } from './modules/storage';

Vue.use(Vuex);

const state: RootState = {
  test: true,
};

const modules: ModuleTree<RootState> = {
  storage,
};

export default new Vuex.Store<RootState>({
  state, modules,
});

export interface RootState {
  test: boolean;
}
