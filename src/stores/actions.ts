import axios, { Canceler } from 'axios';
import { Action } from 'vuex';
import { State } from '.';
import request from '@/apis/request';
import {
  translationResultParser as resultParser,
  presetInvoker,
  istype,
} from '@/functions';
import debug from '@/functions/debug';

type A = Action<{ [k: string]: any }, State>;

let cancelTranslate: Canceler | null;

export const webTranslationQuery: A = ({ state, dispatch }, params) => {
  if (istype(cancelTranslate, 'function')) {
    (cancelTranslate as Canceler)();
    return dispatch('notify', `Don't repeat request.`);
  }

  const { timeout, sources, source: { id } } = state;
  const preset = presetInvoker(id, sources)[1] as SourcePreset;
  const translationRequest = request(preset);

  return translationRequest(params, {
    timeout,
    cancelToken: new axios.CancelToken((cancel: Canceler) => {
      cancelTranslate = cancel;
    }),
  }).then(([_, { data }]) => {
    debug.log(data);
    const [error, result] = resultParser(data, preset);
    dispatch('done', result);
    dispatch('notify', null);
  }).catch(([error]) => {
    debug.log(error);
    dispatch('notify', error.message);
  }).finally(() => {
    cancelTranslate = null;
  });
};
