import axios, { AxiosRequestConfig } from 'axios';
import debug from '@/functions/debug';
import { presetParamsParser } from '@/functions';

export const request: ApiRequest = (preset, type = 'text') => {
  const { query, url, method } = Object.assign({}, preset);

  let querier: TextQuery | AudioQuery | undefined;

  if (typeof query === 'object') {
    querier = query[type as 'text' | 'audio'];
    if (!!querier && !!querier.url) {
      // { url: '{{url}}/a/b' } + { ..., url: 'https://test' } => { url: 'https://test/a/b' }
      querier.url = querier.url
        .replace(/{{(url)}}/, (_, $: 'url') => preset[$] || _);
      // { method: '{{method}}' } + { ..., method: 'get' } => { method: 'get}
      querier.method = querier.method
        .replace(/{{(method)}}/, (_, $: 'method') => preset[$] || _);
    }
  }

  return () => {
    let config: AxiosRequestConfig;

    if (!!querier) { // for translation
      const { method, url } = querier;

      config = { method, url };

      if (!/\?/.test(url)) {
        if (['post', 'put'].includes(method)) {
          const data = presetParamsParser(querier.params)[1];
          config = { data, ...config };
        }
        if (['get'].includes(method)) {
          const params = presetParamsParser(querier.params)[1];
          config = { params, ...config };
        }
      }
      debug.log(config);
    } else { // for web crawl
      config = { url, method };
    }

    return new Promise((resolve, reject) => axios(config)
      .then((response: any) => resolve([null, response]))
      .catch((error: any) => reject([new Error(error)])));
  };
};

export default request;
