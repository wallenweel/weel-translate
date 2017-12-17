import merge from 'deepmerge'
import store from '@/stores/background'
import { runtime } from '@/globals'
import {
  BACKGROUND_INITIALIZE,
  STORAGE_TYPE_SET
} from '@/types'

const { state, dispatch } = store

try {
  ;(async () => [await dispatch(BACKGROUND_INITIALIZE)])()
  .then(([success]) => {
    if (!success) return false

    // watch change of some states that should
    // be store in storage
    for (const [type, states] of Object.entries(state.storage)) {
      for (const key of states) {
        store.watch(state => state[key], (curr, prev) => {
          dispatch(STORAGE_TYPE_SET, { type, key })
        }, { deep: true })
      }
    }
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
  typeof dispatch(merge({ sender, emit }, action)))

if (module.hot) module.hot.accept()
