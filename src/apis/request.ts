import axios, { AxiosRequestConfig, CancelTokenSource, Canceler } from 'axios';
import { presetParamsParser, paramsParaser, istype } from '@/functions';
import { requestTimeout } from '@/variables';
import debug from '@/functions/debug';

export const audio: HTMLAudioElement = new Audio();

export const source = axios.CancelToken.source();

/**
 * Base request method
 * @param preset (crawler|source) preset
 * @param type request type
 */
export const request: ApiRequest = (preset, type = 'text'): (a: any, b: any) => Promise<std> => {
  const { query, url, method } = Object.assign({}, preset);

  let querier: TextQuery | AudioQuery | undefined;

  if (typeof query === 'object') {
    querier = query[type as 'text' | 'audio'];
    if (!!querier && !!querier.url) {
      // { url: '{url}/a/b' } + { ..., url: 'https://test' } => { url: 'https://test/a/b' }
      querier.url = querier.url
      .replace(/{(url)}/, (_, $: 'url') => preset[$] || _);
    }
    if (!!querier && !!querier.method) {
      // { method: '{method}' } + { ..., method: 'get' } => { method: 'get}
      querier.method = querier.method
        .replace(/{(method)}/, (_, $: 'method') => preset[$] || _);
    }
  }

  return (requestParams, userConfig = {} as AxiosRequestConfig): Promise<std> => {
    let config: AxiosRequestConfig = Object.assign({
      timeout: 5000,
      cancelToken: source.token,
      headers: {
        // 'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'application/json',
        // 'X-HTTP-Method-Override': 'GET',
      },
    } as AxiosRequestConfig, userConfig);

    if (!!querier) { // for translation api
      const { method, url } = querier;

      config = { ...config, method, url };

      if (!/\?/.test(url) && !!querier.params) {
        if (['post', 'put'].includes(method)) {
          const data = presetParamsParser(querier.params, requestParams)[1];
          config = { data, ...config };
        }
        if (['get'].includes(method)) {
          const params = presetParamsParser(querier.params, requestParams)[1];
          config = { params, ...config };
        }
      } else {
        config.url = paramsParaser(config.url, requestParams)[1];
      }

      if (type === 'audio') {
        const src: string = `${config.url!}?${config.params.toString()}`;

        return new Promise(async (resolve, reject) => {
          // TODO: may add a few tune preferences
          // audio.addEventListener('play', () => {
          //   // audio.volume = .2;
          // }, false);
          try {
            audio.src = src;
            const ended = () => {
              resolve([null, response]);
              audio.removeEventListener('ended', ended, false);
            };
            audio.addEventListener('ended', ended, false);
            const response = await audio.play();
          } catch (error) {
            reject([new Error(error)]);
          }
        });
      }
    } else { // for web crawl
      // TODO: not complete
      config = { ...config, url, method };

      if (/\?/.test(url)) {
        const [host, params] = url.split('?');
        config.url = `${host}?${presetParamsParser(params, requestParams, true)[1]}`;
      }
      if (!querier!.params) {
        config.url = paramsParaser(config.url, requestParams)[1];
      }
    }

    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios(config);
        resolve([null, response]);
      } catch (error) {
        reject([new Error(error)]);
      }
    });
  };
};

request.source = source;

export default request;

// cancel translate
let translatingCanceler: Canceler | null;

/**
 * Translation request method
 * @param options type, params, source preset, ...
 */
export const translation = ({
  type = 'text',
  params,
  preset,
  timeout = requestTimeout,
}: {
  type: 'text' | 'audio';
  params: { q: string; from: Language['code'], to?: Language['code'] }
  preset: SourcePreset;
  timeout: number,
}): Promise<std> => {
  if (istype(translatingCanceler, 'function')) { translatingCanceler!(); }

  const query = request(preset, type);

  return query(params, {
    timeout,
    cancelToken: new axios.CancelToken((cancel: Canceler) => {
      translatingCanceler = cancel;
    }),
  }).then(([_, response]) => {
    const { data } = response || {} as any;
    debug.info(type, data);
    return [null, { type, data }];
  }).catch(([error]) => {
    debug.info(type, error);
    return [error.message, { type }];
  }).finally(() => {
    translatingCanceler = null;
  }) as Promise<std>;
};

/** /apis/request */
declare type apiResponse = any;
declare type apiRequestType = 'text' | 'audio' | 'web';

declare interface ApiRequest {
  (sourcePreset: Preset, type?: apiRequestType):
    (requestParams: { [key: string]: string | undefined; }, userConfig?: AxiosRequestConfig) =>
      Promise<std<apiResponse>>;
  source: CancelTokenSource;
}
