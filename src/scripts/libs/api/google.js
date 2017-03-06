export default {
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
