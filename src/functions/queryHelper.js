import { istype } from '@/functions/utils'

const replaceHelper = (str, arg) =>
  str.replace(/\{\{(q|from|to|time|token)\}\}/g, (pattern, key) => arg[key] || '')

export default ({
  host,
  query
}, __ = {}) => {
  for (const [ type, data ] of Object.entries(query)) {
    const searchParams = new URLSearchParams()

    let { url, method = 'GET', params, header = {} } = data

    method = method.toUpperCase()
    url = !url ? host : url.replace('{{host}}', host)

    let search = istype(params, 'string') ? params : ''

    if (istype(params, 'array') && params.length) {
      for (const [name, value] of params) {
        if (istype(value, 'array')) {
          value.forEach(v => {
            searchParams.append(name, v)
          })
        } else {
          searchParams.append(name, value)
        }
      }

      search = decodeURI(searchParams.toString())
    }

    const defaultHeader = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
    const methods = {
      GET (arg = {}) {
        // allow only use <type>[url] but that will void <type>[params]
        return encodeURI(replaceHelper(/\?/g.test(url) ? url : `${url}?${search}`, arg))
      },
      POST (arg = {}) {
        return [encodeURI(replaceHelper(/\?/g.test(url) ? url : `${url}?${search}`, arg)), {
          method,
          // FIX: URLSearchParams run fail in fetch
          // body: new URLSearchParams(replaceHelper(search, arg)),
          header: Object.assign(defaultHeader, header)
        }]
      }
    }

    // { a, from, to } must be given or else be ''
    __[type] = methods[method]
  }

  return __
}
