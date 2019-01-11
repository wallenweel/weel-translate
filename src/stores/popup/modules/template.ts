import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { State as RootState } from '../index';
import {
  namespaced,
  register as commonRegister,
  State as CommonState,
  state as commonState,
  mutations as commonMutations,
} from '@/stores/modules/template';
import { moduleHelper } from '@/stores';
import debug from '@/functions/debug';

export const register: configPairs<State> = {
  ...commonRegister,
};

const state: State = {
  ...commonState,
};

const mutations: MutationTree<State> = {
  ...commonMutations,
};

const webActions: ActionTree<State, RootState> = {};

const ipcActions: ActionTree<State, RootState> = {};

const actions: ActionTree<State, RootState> = {
  ...(TARGET_BROWSER === 'web' ? webActions : ipcActions),

  init: () => {/** */},
};

const getters: GetterTree<State, RootState> = {
};

export const template: Module<State, RootState> = {
  namespaced, state, actions, mutations, getters,
};

export default moduleHelper(template, register);

type C = DefaultConfig;
export interface State extends CommonState {
  test?: boolean;
}
