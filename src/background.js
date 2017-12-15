import store from '@/stores/background'
import {
  storage,
  runtime
} from '@/globals'
import {
  STORAGE_CHANGE,
  STORAGE_LOCAL,
  STORAGE_SYNC,
  SERVICE_LANGUAGE_LIST
} from '@/types'
import { whattype } from '@/functions/utils'
import serviceHelper from '@/functions/serviceHelper'
import storageHelper from '@/functions/storageHelper'

try {
  serviceHelper()
  storageHelper()
} catch (error) {
  console.log('!!!something is wrong!!!')
}

runtime.onMessage.addListener((message, from, send) => {
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
      // send(languageHelper({}))
      send(serviceHelper(store.state, store))
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
