import merge from 'deepmerge'
import store from '@/stores/background'
import { runtime } from '@/globals'
import {
  BACKGROUND_INITIALIZE
} from '@/types'

try {
  ;(async () => [await store.dispatch(BACKGROUND_INITIALIZE)])()
  .then(([success]) => {
    if (!success) return false

    // do something after all initial successfully
    // store.watch(state => state.settings.test, a => console.log(a))
  })

  // initialize everything
} catch (error) {
  console.log(
    '!!!something is wrong!!!'.toUpperCase(),
    '\n',
    error
  )
}

// auto forward message to vuex store's actions;
// action just is message of `sendMessage` and must
// accord with { type: 'SOME_ACTION_TYPE', [, payload] };
// allow asynchronous emit(response).
runtime.onMessage.addListener((action, sender, emit) =>
  (typeof store.dispatch(merge({ sender, emit }, action))) && true)

if (module.hot) module.hot.accept()
