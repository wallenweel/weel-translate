export default {
  id: 'google_com',
  name: 'Google',
  url: 'https://translate.google.com',
  query: {
    text: {
      method: 'get',
      url: '{url}/translate_a/single',
      params: {
        q: '{q}',
        sl: '{from}',
        tl: '{to}',
        hl: '{to}',
        client: 'gtx',
        ie: 'UTF-8',
        oe: 'UTF-8',
        dt: ['bd', 'rm', 't'],
        dj: '1',
        source: 'icon',
      },
    },
    audio: {
      method: 'get',
      url: '{url}/translate_a/translate_tts',
      params: {
        q: '{q}',
        tl: '{from}',
        client: 'gtx',
        ie: 'UTF-8',
      },
    },
  },
  parser: {
    phoneticSrc: 'sentences.1.src_translit',
    phoneticDest: 'sentences.1.translit',
    translation: 'sentences.0.trans',
    explain: 'dict.0.pos/: /dict.0.terms[, ]',
  },
  fromto: ['auto', 'auto'],
} as SourcePreset;
