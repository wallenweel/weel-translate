import axios, { Canceler } from 'axios';
import { Action } from 'vuex';
import { State, State as RootState } from '.';
import request from '@/apis/request';
import {
  istype,
} from '@/functions';
import debug from '@/functions/debug';

type A = Action<State, RootState>;

let cancelTranslate: Canceler | null;

export const translationQuery: A = ({ state, dispatch, getters }, { type = 'text', params }) => {
  if (istype(cancelTranslate, 'function')) {
    (cancelTranslate as Canceler)();
    dispatch('notify', `Please wait a moment.`);
  }

  const { timeout } = state;
  const { preset } = getters;
  const query = request(preset, type);

  return query(params, {
    timeout,
    cancelToken: new axios.CancelToken((cancel: Canceler) => {
      cancelTranslate = cancel;
    }),
  }).then(([_, response]) => {
    const { data } = response || {} as any;
    debug.log(type, data);
    return { type, data };
  }).catch(([error]) => {
    debug.log(type, error);
    return { type, error: error.message };
  }).finally(() => {
    cancelTranslate = null;
  });
};
