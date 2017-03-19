import { i18n } from '../functions'

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
    url: 'https://translate.google.cn/translate_a/single',
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

  languages: [{
    code: 'en',
    name: 'English',
    slug: 'english',
    trans: i18n.get('LANG_SLUG_EN'),
  }, {
    code: 'zh',
    name: '中文',
    slug: 'chinese',
    trans: i18n.get('LANG_SLUG_ZH'),
  }, {
    code: 'ja',
    name: 'にほんご',
    slug: 'japanese',
    trans: i18n.get('LANG_SLUG_JP'),
  }],
}
