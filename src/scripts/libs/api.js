export const google = {}

export const bing = {}

export const youdao = {
  fetch(args = {}, type = 'text') {
    if (!args.content) return console.error('Required Content To Translating!')

    const { url, params } = this[type](args)

    const s = new URLSearchParams()
    for (let [k, v] of params) s.append(k, v)

    return fetch(`${url}?${s}`, {
      mode: 'no-cors',
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
