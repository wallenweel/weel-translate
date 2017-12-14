import store from '@/store/background'
import { whattype } from '@/functions/utils'
import { onMessage } from '@/functions/runtime'
import * as storage from '@/functions/storage'
import languageHelper from '@/functions/languageHelper'
import serviceHelper from '@/functions/serviceHelper'
import {
  STORAGE_CHANGE,
  STORAGE_LOCAL,
  STORAGE_SYNC,
  SERVICE_LANGUAGE_LIST
} from '@/actions/types'

store.watch(state => state.sources, (a, b) => {
  console.log(a.test, b.test)
})

// storage.sync.clear()
storage.sync.set({
  test: false
})
storage.sync.get().then(config => {
  store.commit('storageGet', config)
  // console.log(store.state)
})

try {
  console.log(serviceHelper(store.state, store))
} catch (error) {
  console.log('!!!something is wrong!!!')
}

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
      store.commit('storageGet', { test: 100 })
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
