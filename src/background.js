import merge from 'deepmerge'
import store from '@/stores/background'
import { runtime } from '@/globals'
import { generateWatchers } from '@/functions/utils'
import {
  BACKGROUND_INITIALIZE,
  STORAGE_TYPE_SET
} from '@/types'

try {
  ;(async () => [await store.dispatch(BACKGROUND_INITIALIZE)])()
  .then(([success]) => {
    if (!success) return false

    // watch change of some states that should
    // be store in storage
    generateWatchers(store, (type, key) =>
      typeof store.dispatch(STORAGE_TYPE_SET, { type, key }))
  })

  // initialize everything
} catch (error) {
  console.log(
    '!!!something is wrong!!!'.toUpperCase(),
    '\n',
    error
  )
}

// forward message to vuex store's actions
runtime.onMessage.addListener((action, sender, emit) =>
  typeof store.dispatch(merge({ sender, emit }, action)))

if (module.hot) module.hot.accept()
