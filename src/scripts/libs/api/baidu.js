import { i18n } from '../functions'

export default {
  name: '百度翻译',
  slug: 'baidu',
  dataType: 'json',

  parse: (data, args) => {
    console.log(data)
    const {
      dict_result,
      trans_result,
    } = data

    const explains = []
    const phonetic = {}

    if (dict_result.length) {
      const { simple_means: { symbols } } = dict_result
      const { ph_am, ph_en, parts } = symbols[0]

      phonetic[0] = ph_am
      phonetic[1] = ph_en

      parts.forEach(({ part, means }) => explains.push(`${part} ${means.join(', ')}`))
    }

    const translation = [trans_result['data'][0].dst]

    return ({ phonetic, explains, translation })
  },

  text: ({ q, from, to }) => ({
    url: 'http://fanyi.baidu.com/v2transapi',
    params: new Set([
      ['from', from || 'en'],
      ['to', to || 'zh'],
      ['transtype', 'translang'],
      ['simple_means_flag', 3],
      ['query', q],
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
