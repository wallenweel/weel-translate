import { istype } from '@/functions/utils'
import * as mocks from '@/api/mocks'

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
export default ({
  parser: {
    phonetic = {},
    translation = [],
    explain = [],
    variable = []
  }
}, apiID) => {
  // TODO: here is mock respond data
  // will update to AJAX request
  const respond = mocks[apiID]

  let result = { phonetic, translation, explain }

  if (istype(variable, 'array') && variable.length) {
    result = JSON.stringify({phonetic, translation, explain})

    // replace variables placeholder, e.g. $0/$1/...
    result = variable.reduce((prev, curr, i, arr) =>
      prev.replace(new RegExp(`\\$${i}`, 'gm'), arr[i]),
      JSON.stringify({phonetic, translation, explain})
    )

    result = JSON.parse(result)
  }

  loopParse(result, respond)

  return result
}
