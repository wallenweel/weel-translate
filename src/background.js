import merge from 'deepmerge'
import store from '@/stores/background'
import {
  runtime
} from '@/globals'
import {
  BACKGROUND_INITIALIZE
} from '@/types'

try {
  // watch change of some states that same with storage
  for (const name of store.state.inStorage) {
    store.watch(state => state[name], (curr, prev) => {
      // console.log(curr, prev)
    })
  }

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
runtime.onMessage.addListener((action, source, emit) =>
  !store.dispatch(merge({ source, emit }, action)))

if (module.hot) module.hot.accept()
