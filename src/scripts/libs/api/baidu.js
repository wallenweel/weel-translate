import { i18n } from '../functions'

export const domain = 'http://fanyi.baidu.com'

export default {
  name: '百度翻译',
  slug: 'baidu',
  dataType: 'json',

  parse: ({
    dict_result = {},
    trans_result = {},
  }, args) => {
    // console.log(dict_result)
    const explains = []
    const phonetic = {}

    if (Object.keys(dict_result).length) {
      const { simple_means, content, voice } = dict_result

      if (!!simple_means) {
        const { ph_am, ph_en, parts } = simple_means.symbols[0]

        phonetic['us'] = ph_am
        phonetic['uk'] = ph_en

        parts.forEach(({
          part,
          part_name,
          means,
        }) => {
          const _p = part || part_name || ''
          const { has_mean } = means[0]

          if (!parseInt(has_mean)) {
            return explains.push(`${_p} ${means.join(', ')}`)
          } else {
            return explains.push(`${_p} ${means[0].text}`)
          }
        })
      } else if (!!voice) {
        phonetic['us'] = voice[1].us_phonic
        phonetic['uk'] = voice[0].en_phonic

        content ? content[0].mean.forEach(({
          cont,
          pre,
        }) => {
          return explains.push(`${pre} ${Object.keys(cont)[0]}`)
        }) : ''
      }
    }

    const translation = [trans_result['data'][0].dst]

    return ({ phonetic, explains, translation })
  },

  text: ({ q, from, to }) => ({
    url: `${domain}/v2transapi`,
    params: new Set([
      ['from', from],
      ['to', to],
      ['transtype', 'translang'],
      ['simple_means_flag', 3],
      ['query', q],
    ]),
  }),

  voice: ({ q, from }) => ({
    url: `${domain}/gettts`,
    params: new Set([
      ['lan', from],
      ['text', q],
      ['spd', 5],
      ['source', 'web'],
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
      'jp': 'jp',
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
    code: 'jp',
    name: 'にほんご',
    slug: 'japanese',
    trans: i18n.get('LANG_TRANS_JP'),
  }],
}
