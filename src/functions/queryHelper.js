import { istype } from '@/functions/utils'

export default ({
  url,
  query
}, __ = {}) => {
  for (const [ type, data ] of Object.entries(query)) {
    const { params } = data
    const searchParams = new URLSearchParams()

    let host = url
    if (data.url && data.url.length) {
      host = data.url.replace('{{url}}', url)
    }

    let search = istype(params, 'string') ? params : ''
    if (istype(params, 'array') && params.length) {
      for (const [name, value] of params) searchParams.append(name, value)

      search = decodeURI(searchParams.toString())
    }

    // allow only use <type>[url] but
    // that will void <type>[params]
    let sheep = /\?/g.test(host) ? host : `${host}?${search}`

    // { a, from, to } must be given or else be ''
    __[type] = (arg = {}) =>
      encodeURI(sheep.replace(/\{\{(q|from|to)\}\}/g, (pattern, key) => arg[key] || ''))
  }

  return __
}
