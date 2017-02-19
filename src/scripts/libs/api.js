/**
 * Generate API's fetch request
 * @param  {Object} preset          API's kinds of service
 * @param  {String} [type='detail'] The kind of service
 * @return {Closure}
 */
export default (preset, type = 'text') => {
  if (!preset.parse) return console.error('Supply A `parse` Method in API Preset!')

  /**
   * Beginning the fetch
   * @param  {Object} [args={}] API's params
   * @return {Response}         Use `then` method to recevie a json data
   */
  return (args = {}) => {
    if (!args.q) return console.error('Required Content to Translating!')

    const s = new URLSearchParams()
    const { url, params } = preset[type](args)

    for (let [k, v] of params) s.append(k, v)

    return fetch(`${url}?${s}`, { mode: 'no-cors' })
      .then(res => res[preset.dataType]())
      .then(data => preset.parse(data, args))
  }
}

export const google = {
  dataType: 'text',
  parse: (text, args) => {
    debugger

    const data = JSON.parse(JSON.stringify(eval(text)))
    console.log(typeof data)
    const phonetic = {
      0: data[0][1][3],
    }
    const explains = data[0]
    const translation = data[0][0]

    return ({ phonetic, explains, translation })
  },

  text: ({ q, source, target }) => ({
    url: 'http://translate.google.cn/translate_a/single',
    params: new Map([
      ['client', 't'],
      ['tk', '313938.164950'],
      ['sl', source || 'en'],
      ['tl', target || 'zh-CN'],
      ['hl', target || 'zh-CN'],
      ['ie', 'UTF-8'],
      ['oe', 'UTF-8'],
      ['dt', 'rm'],
      ['dt', 't'],
      ['dt', 'ex'],
      ['q', q],
    ]),
  }),
}

export const bing = {}

export const youdao = {
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
}
