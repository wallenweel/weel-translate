import { whattype } from '@/globals'
import { onMessage } from '@/functions/runtime'
import * as storage from '@/functions/storage'
import {
  STORAGE_CHANGE,
  STORAGE_LOCAL,
  STORAGE_SYNC,
  SERVICE_LANGUAGE_LIST
} from '@/actions/types'

// import languageHelper from '@/api/languages'
// import { storageSources } from '@/api/mocks'

import languageHelper from '@/functions/languageHelper'

try {
  console.log(languageHelper())
  // console.log(languageHelper().reduce((a, b) => a + b.name + ', ', ''))
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

    case SERVICE_LANGUAGE_LIST:
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
