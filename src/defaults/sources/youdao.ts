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
      url: 'http://tts.youdao.com/fanyivoice',
      params: [
        ['word', '{q}'],
        ['le', '{from}'],
        ['keyfrom', 'speaker-target'],
      ],
      modify: [['ja:>ja', 'p'].join('')],
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

  include: ['auto', 'zh-cn', 'en', 'ja', 'ko', 'fr', 'de', 'ru', 'es', 'pt', 'vi', 'id', 'ar'],
  modify: ['auto:>AUTO', 'zh-cn:>zh-CHS'],
  fromto: ['AUTO', 'zh-CHS'],
} as SourcePreset;
