import merge from 'deepmerge'
import store from '@/stores/background'
import {
  runtime
} from '@/globals'
import {
  BACKGROUND_INITIALIZE,
  COMPILE_SERVICE_SOURCES,
  STORAGE_TYPE_SET
} from '@/types'

const { state, commit, dispatch } = store

try {
  window.browser.storage.sync.get().then(all => {
    console.log(all)
  })
  store.watch(state => state.initialized, (curr, prev) => {
    if (!Object.values(curr).includes(false)) {
      // compile service "source.preset" to "api"
      commit(COMPILE_SERVICE_SOURCES)

      // watch change of some states that should
      // be store in storage
      for (const [type, states] of Object.entries(state.storage)) {
        for (const key of states) {
          store.watch(state => state[key], (curr, prev) => {
            // console.log(curr.test, prev.test)
            dispatch(STORAGE_TYPE_SET, { type, key })
          })
        }
      }

      console.log('state.api', state.api)
    }
  }, { deep: true })

  // initialize everything
  dispatch(BACKGROUND_INITIALIZE)
} catch (error) {
  console.log(
    '!!!something is wrong!!!'.toUpperCase(),
    '\n',
    error
  )
}

// forward message to vuex store's actions
runtime.onMessage.addListener((action, sender, emit) =>
  !dispatch(merge({ sender, emit }, action)))

if (module.hot) module.hot.accept()
