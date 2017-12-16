import merge from 'deepmerge'
import store from '@/stores/background'
import {
  runtime
} from '@/globals'
import {
  BACKGROUND_INITIALIZE,
  COMPILE_SERVICE_SOURCES
} from '@/types'

try {
  // watch change of some states that same with storage
  for (const name of store.state.storageSync) {
    store.watch(state => state[name], (curr, prev) => {
      // console.log(curr, prev)
    })
  }

  store.watch(state => state.initialized, (curr, prev) => {
    if (!Object.values(curr).includes(false)) {
      store.commit(COMPILE_SERVICE_SOURCES)

      console.log('store.state.api', store.state.api.google_cn.languages[0].name)
    }
  }, { deep: true })

  // initialize everything
  store.dispatch(BACKGROUND_INITIALIZE)
} catch (error) {
  console.log(
    '!!!something is wrong!!!'.toUpperCase(),
    '\n',
    error
  )
}

// forward message to vuex store's actions
runtime.onMessage.addListener((action, sender, emit) =>
  !store.dispatch(merge({ sender, emit }, action)))

if (module.hot) module.hot.accept()
