// import { istype } from '@/functions/utils'
import languageHelper from '@/functions/languageHelper'
// import translatingHelper from '@/functions/translatingHelper'
// import { google } from '@/api/mocks'

export default ({ sources }) => {
  const presets = sources.preset

  // for (const id in presets) {
  //   if (presets.hasOwnProperty(id)) {
  //     const preset = JSON.parse(presets[id])
  //     // console.log(translatingHelper(preset, google))
  //     console.log(languageHelper(preset))
  //   }
  // }
  const preset = JSON.parse(presets['google'])
  console.log(languageHelper(preset))
  return languageHelper(preset)
}
