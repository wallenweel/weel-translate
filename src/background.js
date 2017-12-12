import { whattype } from '@/globals'
import { onMessage } from '@/functions/runtime'
import * as storage from '@/functions/storage'
import {
  STORAGE_CHANGE,
  STORAGE_LOCAL,
  STORAGE_SYNC
} from '@/actions/types'
import languageHelper from '@/api/languages'

try {
  const storageSources = [
    // Google
    `{
      "id": "google",
      "name": "Google",
      "icon": "base64:",

      "url": "https://translate.google.com",
      
      "parser": "phonetic/translation/explain",
      "parser": {
        "phonetic": {
          "us": "$1.src_translit",
          "uk": "$1.src_translit"
        },
        "translation": ["$0.trans", "$1.trans"],
        "explain": "$2",
        "variables": ["$.sentences[0]", "$.sentences[1]", "$.dict"]
      },
      
      "support": ["zh", "jp"],
      
      "languages": [{
        "code": "zh-cn",
        "name": "Chinese Simplified",
        "locale": "中文(简体)"
      }, {
        "code": "jp",
        "name": "Japanese",
        "locale": "日文"
      }]
    }`
  ]

  languageHelper(storageSources)
} catch (error) {
}
// storage.sync.clear()
storage.sync.set({
  test: false
})
storage.sync.get().then(res => {
  // console.log(res)
})

onMessage.addListener((message, from, send) => {
  const {
    type,
    payload
  } = message

  switch (type) {
    case STORAGE_CHANGE:
      storage.sync.set(payload)
      send(payload)
      break

    case STORAGE_LOCAL:
      if (whattype(payload) === 'object') {
        // set
      } else {
        // get
      }
      break
    case STORAGE_SYNC:
      break

    default:
      console.log(
        `%cYou Must Provide A Object Data Contains 'type' Key At Least When You Call '[type].sendMessage'!`,
        'background-color: crimson; color: white; display: block;',
        `Yours: ${JSON.stringify(message)}`
      )
      break
  }
})

if (module.hot) {
  module.hot.accept()
}
