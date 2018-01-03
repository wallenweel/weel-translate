import merge from 'deepmerge'
import { clog, istype } from '@/functions/utils'
import languageHelper from '@/functions/languageHelper'
import parserHelper from '@/functions/parserHelper'
import queryHelper from '@/functions/queryHelper'

// full preset(no inherit) json compile to api
export const compilePreset = json => merge(json, {
  languages: languageHelper(json),
  parser: parserHelper(json),
  query: queryHelper(json)
}, { arrayMerge: (des, src) => src })

export const parsePreset = (preset, presets) => {
  let presetJSON = JSON.parse(preset)

  if (istype(presetJSON, 'array') && presetJSON.length) {
    const realPreset = presetJSON.pop()

    let incorrect = false
    for (let n = 0; n < presetJSON.length; n++) {
      const _id = presetJSON[n]

      if (
        !istype(_id, 'string') ||
        !presets[_id]
      ) incorrect = true
    }

    if (!istype(realPreset, 'object') || incorrect) {
      // TODO: add wrong alert to frontend
      clog(
        'wrong preset is supplied and skipped',
        JSON.stringify(presetJSON)
      )
      return false
    }

    presetJSON = merge(
      ...presetJSON.map(id => JSON.parse(presets[id])),
      realPreset,
      { arrayMerge: (des, src) => src }
    )
  }

  return presetJSON
}

export default (presets, __ = {}) => {
  for (const [id, preset] of Object.entries(presets)) {
    const presetJSON = parsePreset(preset, presets)

    if (!presetJSON) continue

    __[id] = compilePreset(presetJSON)
  }

  return __
}
