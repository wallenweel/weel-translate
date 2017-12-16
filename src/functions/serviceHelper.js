import merge from 'deepmerge'
import { istype } from '@/functions/utils'
import languageHelper from '@/functions/languageHelper'
import parserHelper from '@/functions/parserHelper'
import queryHelper from '@/functions/queryHelper'

export default (sources, __ = {}) => {
  const presets = sources.preset

  for (const [id, preset] of Object.entries(presets)) {
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
        console.log(
          'wrong preset is supplied and skipped',
          JSON.stringify(presetJSON)
        )
        continue
      }

      presetJSON = merge(
        ...presetJSON.map(id => JSON.parse(presets[id])),
        realPreset,
        { arrayMerge: (des, src) => src }
      )
    }

    __[id] = merge(presetJSON, {
      languages: languageHelper(presetJSON),
      parser: parserHelper(presetJSON),
      query: queryHelper(presetJSON)
    }, { arrayMerge: (des, src) => src })
  }

  return __
}
