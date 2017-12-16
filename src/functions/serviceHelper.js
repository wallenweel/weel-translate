import merge from 'deepmerge'
import languageHelper from '@/functions/languageHelper'
import parserHelper from '@/functions/parserHelper'
import queryHelper from '@/functions/queryHelper'

export default (sources, __ = {}) => {
  for (const [id, preset] of Object.entries(sources.preset)) {
    const presetJSON = JSON.parse(preset)

    __[id] = merge(presetJSON, {
      languages: languageHelper(presetJSON),
      parser: parserHelper(presetJSON),
      query: queryHelper(presetJSON)
    }, { arrayMerge: (des, src) => src })
  }

  return __
}
