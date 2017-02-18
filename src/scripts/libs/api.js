export default (preset, type = 'text') => {
  const { json } = preset

  if (!json) return console.error('Supply A `json` Formatter in API Preset!')

  return (args = {}) => {
    if (!args.content) return console.error('Required Content to Translating!')

    const s = new URLSearchParams()
    const { url, params } = preset[type](args)

    for (let [k, v] of params) s.append(k, v)

    return fetch(`${url}?${s}`, { mode: 'no-cors' })
      .then(res => res.json())
      .then(data => preset.json(data, args))
  }
}

export const google = {}

export const bing = {}

export const youdao = {
  json: (json, args) => {
    const { basic = {}, translation = [] } = json
    const phonetic = {
      0: basic['phonetic'] || '',
      uk: basic['uk-phonetic'] || '',
      us: basic['us-phonetic'] || '',
    }
    const explains = basic.explains || []

    return ({
      phonetic,
      explains,
      translation,
    })
  },

  voice: ({content, type = 2}) => ({
    url: 'http://dict.youdao.com/dictvoice',
    params: new Map([
      ['audio', content],
      ['type', type],
    ]),
  }),
  text: ({ content, id, key }) => ({
    url: 'http://fanyi.youdao.com/openapi.do',
    params: new Map([
      ['keyfrom', id || 'weel-translate'],
      ['key', key || '554026358'],
      ['type', 'data'],
      ['doctype', 'json'],
      ['version', 1.1],
      ['q', content],
    ]),
  }),
}
