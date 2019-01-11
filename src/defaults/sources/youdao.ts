export default {
  id: 'youdao',
  name: '网易有道',
  url: 'http://fanyi.youdao.com',
  method: 'get',
  query: {
    text: {
      method: '{method}',
      url: '{url}/translate',
      params: [
        ['i', '{q}'],
        ['from', '{from}'],
        ['to', '{to}'],
        ['smartresult', 'dict'],
        ['smartresult', 'rule'],
        ['smartresult', 'ugc'],
        ['client', 'fanyideskweb'],
        ['doctype', 'json'],
        ['version', '2.1'],
        ['keyfrom', 'fanyi.web'],
        ['typoResult', 'false'],
      ],
    },
    audio: {
      method: '{method}',
      url: 'https://dict.youdao.com/dictvoice',
      params: [
        ['audio', '{q}'],
        ['type', '1'],
      ],
    },
  },

  parser: {
    phonetic_src: '',
    translation: 'translateResult.0.0.tgt',
  },
  test: {
    phonetic_src: '.+',
    translation: '.+',
  },

  // tslint:disable-next-line:max-line-length
  languages: [{code: 'AUTO', name: '自动'}, {code: 'zh-CHS', name: '中文'}, {code: 'en', name: '英语'}, {code: 'ja', name: '日语'}, {code: 'ko', name: '韩语'}, {code: 'fr', name: '法语'}, {code: 'de', name: '德语'}, {code: 'ru', name: '俄语'}, {code: 'es', name: '西班牙语'}, {code: 'pt', name: '葡萄牙语'}, {code: 'vi', name: '越南语'}, {code: 'id', name: '印尼语'}, {code: 'ar', name: '阿拉伯语'}],

  fromto: ['AUTO', 'zh-CHS'],
} as SourcePreset;
