import languageHelper from '@/functions/languageHelper'
import translatingHelper from '@/functions/translatingHelper'

// TODO: implement this
export default (store) => {
  const {
    state: {
      sources
    }
  } = store

  for (const [id, preset] of Object.entries(sources.preset)) {
    const json = JSON.parse(preset)
    // console.log(languageHelper(json))
    // console.log(translatingHelper(json, id))
    return languageHelper(json)
  }
}
