import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { State as RootState } from '../index';
import {
  namespaced,
  register as commonRegister,
  State as CommonState,
  state as commonState,
  mutations as commonMutations,
} from '@/stores/modules/preference';
import { moduleHelper } from '@/stores';

export const register: configPairs<State> = {
  ...commonRegister,
};

const state: State = {
  ...commonState,
};

const mutations: MutationTree<State> = {
  ...commonMutations,
};

const actions: ActionTree<State, RootState> = {};

const getters: GetterTree<State, RootState> = {};

export const preference: Module<State, RootState> = {
  namespaced, state, actions, mutations, getters,
};

export default moduleHelper(preference, register);

type State = CommonState;
