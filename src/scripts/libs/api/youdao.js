import { i18n } from '../functions'

export default {
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

  text: ({ q, id, key }) => ({
    url: 'http://fanyi.youdao.com/openapi.do',
    params: new Map([
      ['keyfrom', id || 'weel-translate'],
      ['key', key || '554026358'],
      ['type', 'data'],
      ['doctype', 'json'],
      ['version', 1.1],
      ['q', q],
    ]),
  }),

  languages: [{
    code: 'en',
    name: 'english',
    slug: i18n.get('LANG_SLUG_EN'),
  }, {
    code: 'zh',
    name: '中文',
    slug: i18n.get('LANG_SLUG_ZH'),
  }, {
    code: 'ja',
    name: 'にほんご',
    slug: i18n.get('LANG_SLUG_JP'),
  }],
}
