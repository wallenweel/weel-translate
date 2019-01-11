export default {
  // extends preset from 'google_com'
  extends: 'google_com',

  id: 'google_cn',
  name: '谷歌',
  url: 'https://translate.google.cn',
  method: 'get',
  query: {
    text: {
      method: '{method}',
      url: '{url}/translate_a/single',
      params: [
        ['q', '{q}'],
        ['sl', '{from}'],
        ['tl', '{to}'],
        ['hl', '{to}'],
        ['client', 'gtx'],
        ['ie', 'UTF-8'],
        ['oe', 'UTF-8'],
        ['dt', 'bd'],
        ['dt', 'rm'],
        ['dt', 't'],
        ['dj', '1'],
        ['source', 'icon'],
      ],
    },
    audio: {
      unsupport: ['auto'],
      method: '{method}',
      url: '{url}/translate_tts',
      params: [
        ['q', '{q}'],
        ['tl', '{from}'],
        ['client', 'gtx'],
        ['ie', 'UTF-8'],
      ],
    },
  },
  fromto: ['auto', 'zh-cn'],
} as SourcePreset;
