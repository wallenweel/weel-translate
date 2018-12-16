import { MutationTree, ActionTree, Module } from 'vuex';
import { State as RootState } from '../index';
import debug from '@/functions/debug';

import request from '@/apis/request';
import google from '@/defaults/sources/google';
import { translationResultParser } from '@/functions';

const namespaced: boolean = true;

const state: State = {
  text: '',
  hotkey: 'enter',
};

const mutations: MutationTree<State> = {
  text: (state, text) => {
    debug.log('text', text);
    state.text = text;
  },
};

const webActions: ActionTree<State, RootState> = {
  translateText: async ({ rootState }, data) => {
    const { storage } = rootState;

    const translationRequest = request(google);
    const response = await translationRequest({
      q: 'translation',
      from: 'auto',
      to: 'zh-cn',
    });
    const res = response[1].data;
    const result = translationResultParser(res, google.parser);
    debug.log(res, result);
  },
};

const ipcActions: ActionTree<State, RootState> = {};

const actions = Object.assign({
  query: ({ dispatch }, data: any) => {
    dispatch('translateText', data);
  },
} as ActionTree<State, RootState>, TARGET_BROWSER === 'web' ? webActions : ipcActions);

export const translation: Module<State, RootState> = {
  namespaced, state, actions, mutations,
};

export default translation;

interface State {
  text: string;
  hotkey: 'enter' | 'ctrl+enter';
  [key: string]: any;
}
