import * as i18n from '@/functions/i18n'
import { whattype, istype } from '@/functions/utils'
import languageCollection from '@/api/languages.json'

const toHash = obj => {
  switch (whattype(obj)) {
    case 'string':
      return toHash(obj.split('/'))

    case 'object':
      return obj

    case 'array':
      return obj.reduce((prev, curr) => {
        if (!curr) return prev

        const val = curr.split(':>')

        return (prev[val[0]] = val[1] || true) && prev
      }, {})

    default:
      return {}
  }
}

// param is source's json treated preset
export default ({
  include,
  exclude,
  languages = []
}) => {
  const languageList = JSON.parse(JSON.stringify(languageCollection))
  const [inCodes, exCodes] = [toHash(include), toHash(exclude)]
  const inObject = (elem, obj) => Object.keys(obj).includes(elem)

  if (istype(languages, 'array')) {
    // merge exclude and deal with some languages's content e.g. "locale"
    Object.assign(exCodes, languages.reduce((prev, curr) => {
      // if can not get local text contiune with user's
      curr.locale = curr.trans || i18n.getMessage(curr.locale) || curr.name
      // delete curr.trans

      return (prev[curr.code] = true) && prev
    }, {}))
  } else {
    console.error(`"languages" Must To Be An [Array] Type!`)
  }

  return languages.concat(...languageList
    .reduce((prev, curr) => {
      // localize language's name in "locale" key
      curr.locale = i18n.getMessage(curr.locale)

      if (exclude && !inObject(curr.code, exCodes)) prev.push(curr)

      if (istype(exclude, 'undefined') && inObject(curr.code, inCodes)) {
        // change language's code, due to "zh:>zh-cn"
        if (inCodes[curr.code] !== true) curr.code = inCodes[curr.code]

        prev.push(curr)
      }

      if (!exclude && !include) prev.push(curr)

      return prev
    }, [])
  )
}
