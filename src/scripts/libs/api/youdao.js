import { i18n } from '../functions'

export default {
  name: '有道翻译',
  slug: 'youdao',
  dataType: 'json',

  parse: (json, args) => {
    const { basic = {}, translation = [] } = json
    const phonetic = {
      0: basic['phonetic'] || '',
      uk: basic['uk-phonetic'] || '',
      us: basic['us-phonetic'] || '',
    }
    const explains = basic.explains || []

    return ({ phonetic, explains, translation })
  },

  voice: ({ q, type = 2 }) => ({
    url: 'http://dict.youdao.com/dictvoice',
    params: new Map([
      ['audio', q],
      ['type', type],
    ]),
  }),

  text: ({ q, keyfrom, key }) => ({
    url: 'http://fanyi.youdao.com/openapi.do',
    params: new Set([
      ['keyfrom', keyfrom || 'weel-translate'],
      ['key', key || '554026358'],
      ['type', 'data'],
      ['doctype', 'json'],
      ['version', 1.1],
      ['q', q],
    ]),
  }),

  presets() {
    const { languages } = this

    return ({
      lang_from: {
        text: languages[0].trans,
        value: languages[0].code,
      },
      lang_to: {
        text: languages[0].trans,
        value: languages[0].code,
      },
    })
  },

  languages: [{
    code: '',
    name: 'Auto',
    slug: 'auto',
    trans: i18n.get('AUTOMATIC'),
  }],
}
