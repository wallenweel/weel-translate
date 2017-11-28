import { i18n } from '../functions'

export const domain = 'https://translate.google.com'

export default {
  name: 'Google Translate',
  slug: 'google',
  dataType: 'json',

  parse: ({
    sentences,
    dict,
  }, args) => {
    const [{ trans }, { src_translit }] = sentences
    const phonetic = {
      0: src_translit,
    }
    const explains = dict ? dict[0].terms : []
    const translation = [trans]

    return ({ phonetic, explains, translation })
  },

  text: ({ q, from, to }) => ({
    url: `${domain}/translate_a/single`,
    params: new Set([
      ['client', 'gtx'],
      // ['tk', '313938.164950'],

      ['sl', from],
      ['tl', to],
      ['hl', to],

      ['ie', 'UTF-8'],
      ['oe', 'UTF-8'],

      ['dt', 'at'],
      ['dt', 'bd'],
      ['dt', 'ex'],
      ['dt', 'ld'],
      ['dt', 'md'],
      ['dt', 'qca'],
      ['dt', 'rw'],
      ['dt', 'rm'],
      ['dt', 'ss'],
      ['dt', 't'],

      ['dj', '1'],
      ['source', 'icon'],

      ['q', q],
    ]),
  }),

  voice: ({ q, from }) => ({
    url: `${domain}/translate_tts`,
    params: new Set([
      ['tl', from],
      ['q', q],
      ['client', 'gtx'],
      ['ie', 'UTF-8'],
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
        text: languages[1].trans,
        value: languages[1].code,
      },
    })
  },

  uniform(code) {
    return ({
      'zh': 'zh',
      'zh-CN': 'zh',
      'en': 'en',
      'jp': 'ja',
    })[code]
  },

  languages: [{
    code: 'en',
    name: 'English',
    slug: 'english',
    trans: i18n.get('LANG_TRANS_EN'),
  }, {
    code: 'zh',
    name: '中文',
    slug: 'chinese',
    trans: i18n.get('LANG_TRANS_ZH'),
  }, {
    code: 'ja',
    name: 'にほんご',
    slug: 'japanese',
    trans: i18n.get('LANG_TRANS_JP'),
  }],
}
