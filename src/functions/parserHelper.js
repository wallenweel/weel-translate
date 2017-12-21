import merge from 'deepmerge'
import { istype } from '@/functions/utils'

 // 'obj.a[0].b[1]' -> [obj, a, 0, b, 1]
const stringToPath = (str, start = 0) => {
  if (!istype(str, 'string') || !str) return []
  return str
    // -> obj.a.0.b.1    rewrite all basket([$]) to dot(.$)
    .replace(/\[['"]{0,1}([\d\w-]+)['"]{0,1}\]/g, '.$1')
    .split('.').slice(start)
}

/**
 * get object's value by string as key
 * @param {String} str string path
 * @param {Object} respond plain object
 * @param {Number} start see same param in stringToPath
 * @return {Any}
 */
const lazyGet = (str, respond, start = 1) =>
  stringToPath(str, start)
  .reduce((prev, curr) => !prev ? null : prev[curr], respond)

/**
 * recursive loop for parsing real result
 * @param {Object} object referenced object contains phonetic/translation/explain
 * @param {Object} respond request's respond data
 * @param {Object} prevObj prevrious referenced object
 * @param {String/Integer} prevKey the key that need to be replaced value
 */
const loopParse = (object, respond, prevObj, prevKey) => {
  if (istype(object, 'string') && /^\$\./.test(object)) {
    return (prevObj[prevKey] = lazyGet(object, respond))
  }

  for (const [key, value] of Object.entries(object)) loopParse(value, respond, object, key)
}

// param is source's json treated preset
export default ({ parser }) => {
  const { variable } = parser

  let result = merge({}, parser)
  if (istype(variable, 'array') && variable.length) {
    result = JSON.parse(
      JSON.stringify(result)
      // replace variables placeholder, e.g. $0/$1/...
      .replace(/\$(\d+)\./g, (pattern, i) =>
        // append . to [basket], e.g. $.global[0] -> $.global[0].
        /\]$/.test(variable[i]) ? `${variable[i]}.` : variable[i]
      )
    )
  }
  delete result.variable

  return (respond) => {
    // prevent treated result is cached
    let _result = merge({}, result)

    loopParse(_result, respond)

    return _result
  }
}
