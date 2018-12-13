import axios, { AxiosRequestConfig } from 'axios';
import debug from '@/functions/debug';

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

  return (params) => {
    let config: AxiosRequestConfig;

    // TODO: use URLSearchParams here
    if (!!querier) { // for translation
      const search = JSON.parse(JSON.stringify(querier.params)
        .replace(/{{(.+?)}}/g, (_, $) => params[$]));

      let s: string = '';
      for (const [k, v] of Object.entries(search)) {
        if (typeof v === 'object') {
          for (const p of v as []) {
            s += `${k}=${p}&`;
          }
          continue;
        }
        s += `${k}=${v}&`;
      }

      config = {
        method: querier.method,
        url: querier.url + '?' + s,

        // { s: '{{q}}' } + { q: 'test' } => { s: 'test' }
        // params: search,
      };
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
