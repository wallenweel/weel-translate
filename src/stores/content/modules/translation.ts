import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { State as RootState } from '../index';
import {
  State as CommonState,
  namespaced,
  state as commonState,
  register,
  mutations as commonMutations,
  actions as commonActions,
  webActions,
  ipcActions,
  getters as commonGetters,
} from '@/stores/modules/translation';
import {
  translationResultParser as resultParser,
} from '@/functions';

const state: State = {
  ...commonState,
};

const mutations: MutationTree<State> = {
  ...commonMutations,
};

const actions: ActionTree<State, RootState> = {
  ...(TARGET_BROWSER === 'web' ? webActions : ipcActions),
  ...commonActions,

  init: () => {/** */},

  result: ({ getters, commit, dispatch }, { type, data }) => {
    const [error, result] = resultParser(data, getters.preset!);
    if (error !== null) { dispatch('notify', error); }

    commit('update', { result });

    dispatch('record');
  },
};

const getters: GetterTree<State, RootState> = {
  ...commonGetters,
};

export const translation: Module<State, RootState> = {
  namespaced, state, actions, mutations, getters,
};

export default translation;

export { register };

type State = CommonState;
