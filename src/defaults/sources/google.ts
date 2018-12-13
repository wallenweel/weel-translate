export default {
  id: 'google_com',
  name: 'Google',
  url: 'https://translate.google.cn',
  method: 'get',
  query: {
    text: {
      method: '{{method}}',
      url: '{{url}}/translate_a/single',
      params: {
        q: '{{q}}',
        sl: '{{from}}',
        tl: '{{to}}',
        hl: '{{to}}',
        client: 'gtx',
        ie: 'UTF-8',
        oe: 'UTF-8',
        dt: ['bd', 'rm', 't'],
        dj: '1',
        source: 'icon',
      },
    },
    audio: {
      method: '{{method}}',
      url: '{{url}}/translate_a/translate_tts',
      params: {
        q: '{{q}}',
        tl: '{{from}}',
        client: 'gtx',
        ie: 'UTF-8',
      },
    },
  },
  parser: {
    phoneticSrc: 'sentences.$.src_translit',
    phoneticDest: 'sentences.$.translit',
    translation: 'sentences(trans)',
    explain: 'dict(pos....terms)',
  },
  fromto: ['auto', 'auto'],
} as SourcePreset;
