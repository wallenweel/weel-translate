import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { presetParamsParser } from '@/functions';
import debug from '@/functions/debug';

export const source = axios.CancelToken.source();

export const request: ApiRequest = (preset, type = 'text') => {
  const { query, url, method } = Object.assign({}, preset);

  let querier: TextQuery | AudioQuery | undefined;

  if (typeof query === 'object') {
    querier = query[type as 'text' | 'audio'];
    if (!!querier && !!querier.url) {
      // { url: '{url}/a/b' } + { ..., url: 'https://test' } => { url: 'https://test/a/b' }
      querier.url = querier.url
        .replace(/{(url)}/, (_, $: 'url') => preset[$] || _);
      // { method: '{method}' } + { ..., method: 'get' } => { method: 'get}
      querier.method = querier.method
        .replace(/{(method)}/, (_, $: 'method') => preset[$] || _);
    }
  }

  return (requestParams, userConfig = {} as AxiosRequestConfig) => {
    let config: AxiosRequestConfig = Object.assign({
      timeout: 5000,
      cancelToken: source.token,
      headers: {
        // 'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'application/json',
        // 'X-HTTP-Method-Override': 'GET',
      },
    } as AxiosRequestConfig, userConfig);

    if (!!querier) { // for translation
      const { method, url } = querier;

      config = { ...config, method, url };

      if (!/\?/.test(url)) {
        if (['post', 'put'].includes(method)) {
          const data = presetParamsParser(querier.params, requestParams)[1];
          config = { data, ...config };
        }
        if (['get'].includes(method)) {
          const params = presetParamsParser(querier.params, requestParams)[1];
          config = { params, ...config };
        }
      }
    } else { // for web crawl
      config = { ...config, url, method };
      if (/\?/.test(url)) {
        const [host, params] = url.split('?');
        config.url = `${host}?${presetParamsParser(params, requestParams)[1]}`;
      }
    }

    return new Promise((resolve, reject) => axios(config)
      .then((response: any) => resolve([null, response]))
      .catch((error: any) => reject([new Error(error)])));
  };
};

request.source = source;

export default request;

/** /apis/request */
declare type apiResponse = any;
declare type apiRequestType = 'text' | 'audio' | 'web';

declare interface ApiRequest {
  (sourcePreset: Preset, type?: apiRequestType):
    (requestParams: { [key: string]: string; }, userConfig?: AxiosRequestConfig) =>
      Promise<std<apiResponse>>;
  source: CancelTokenSource;
}
