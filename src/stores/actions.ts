import axios, { Canceler } from 'axios';
import { Action } from 'vuex';
import { State } from '.';
import request from '@/apis/request';
import {
  presetInvoker,
  istype,
} from '@/functions';
import debug from '@/functions/debug';

type A = Action<{ [k: string]: any }, State>;

let cancelTranslate: Canceler | null;

export const webQuery: A = ({ state, dispatch }, [type = 'text', params]) => {
  if (istype(cancelTranslate, 'function')) {
    (cancelTranslate as Canceler)();
    dispatch('notify', `Please wait a moment.`);
  }

  const { timeout, preset } = state;
  const webRequest = request(preset, type);

  return webRequest(params, {
    timeout,
    cancelToken: new axios.CancelToken((cancel: Canceler) => {
      cancelTranslate = cancel;
    }),
  }).then(([_, response]) => {
    const { data } = response || {} as any;
    debug.log(type, data);
    dispatch('done', { type, data });
  }).catch(([error]) => {
    debug.log(type, error);
    dispatch('done', { type, error: error.message });
  }).finally(() => {
    cancelTranslate = null;
  });
};
