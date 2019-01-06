import { MutationTree, ActionTree, Module, GetterTree } from 'vuex';
import { State as RootState } from '../index';
import {
  presetInvoker,
} from '@/functions';
import { translation as translationQuery } from '@/apis/request';
import debug from '@/functions/debug';

const namespaced: boolean = true;

const state: State = {};

const mutations: MutationTree<State> = {};

const actions: ActionTree<State, RootState> = {
  query: async ({ getters }, { type, params }): Promise<std> => {
    const { preset, timeout } = getters;
    return await translationQuery({ type, params, preset, timeout });
  },
};

const getters: GetterTree<State, RootState> = {
  preset: (state, getters, rootState) => {
    const {
      translation_sources: sources,
      translation_current_source: source,
    } = rootState.storage;
    return presetInvoker(source.id, sources)[1] as SourcePreset;
  },
  timeout: (state, getters, rootState) => rootState.storage.request_timeout,
};

export const translation: Module<State, RootState> = {
  namespaced, state, actions, mutations, getters,
};

export default translation;

interface State {
  [name: string]: any;
}
