const stringToPath = str => {
  if (!str) return []

  const s = str.replace(/\[['"]{0,1}([\d\w-]+)['"]{0,1}\]/g, '.$1')

  return s.split('.')
}

const parserGet = (str, json) => {
  const s = str.replace(/^\$[\d]*\./, '') // delete "$" data placeholder
  const path = stringToPath(s)

  return path.reduce((prev, curr) => {
    return prev[curr]
  }, json)
}

export const languageHelper = sources => {
  const json = JSON.parse(sources[0])
  // console.log(json)

  let s = `$.parser.variables[1]`

  console.log(parserGet(s, json))

  // console.log(json['parser']['variables'][1])

  return []
}

export default languageHelper
