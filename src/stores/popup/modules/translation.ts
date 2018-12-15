import { MutationTree, ActionTree, Module } from 'vuex';
import { State as RootState } from '../index';
import debug from '@/functions/debug';

const namespaced: boolean = true;

const state: State = {};

const mutations: MutationTree<State> = {};

const webActions: ActionTree<State, RootState> = {
  translateText: (_, data) => {
    debug.log(data);
  },
};

const ipcActions: ActionTree<State, RootState> = {};

const actions = Object.assign({
  queryText: ({ dispatch }, data: any) => {
    dispatch('translateText', data);
  },
} as ActionTree<State, RootState>, TARGET_BROWSER === 'web' ? webActions : ipcActions);

export const translation: Module<State, RootState> = {
  namespaced, state, actions, mutations,
};

export default translation;

interface State {
  [key: string]: any;
}
