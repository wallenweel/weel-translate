import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { State as RootState } from '@/stores/index';
import { update, clear } from '@/stores/mutations';
import debug from '@/functions/debug';

export const namespaced: boolean = true;

export const register: configPairs<State> = {
  template_source_layouts: 'sourceLayouts',
  template_crawler_layouts: 'crawlerLayouts',
  template_enabled_layouts: 'enabledLayouts',
  template_layouts: 'layouts',
};

export const state: State = {
  sourceLayouts: {},
  crawlerLayouts: {},
  enabledLayouts: [],
  layouts: [],
};

export const mutations: MutationTree<State> = { update, clear };

export const webActions: ActionTree<State, RootState> = {};

export const ipcActions: ActionTree<State, RootState> = {};

export const actions: ActionTree<State, RootState> = {
  ...(TARGET_BROWSER === 'web' ? webActions : ipcActions),
};

export const getters: GetterTree<State, RootState> = {};

export const template: Module<State, RootState> = {
  namespaced, state, actions, mutations, getters,
};

export default template;

type C = DefaultConfig;
export interface State {
  sourceLayouts: C['template_source_layouts'];
  crawlerLayouts: C['template_crawler_layouts'];
  enabledLayouts: C['template_enabled_layouts'];
  layouts: C['template_layouts'];
}
