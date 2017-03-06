export const type = (obj, val = '') => {
  const str = /(\w+)\]$/.exec(Object.prototype.toString.apply(obj).toLowerCase())[1]

  return !val ? str : (val === str)
}

export const log = (...params) => {
  console.log(...params)
}

/**
 * Generate API's fetch request
 * @param  {Object}  preset          API's kinds of service
 * @param  {String}  [type='text'] The kind of service
 * @return {Closure}
 */
export const parseEngine = (preset, type = 'text') => {
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
