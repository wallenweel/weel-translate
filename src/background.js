import merge from 'deepmerge'
import store from '@/stores/background'
import { clog } from '@/functions/utils'
import { runtime } from '@/globals'
import {
  INITIAL_STORAGE_FROM_DEFAULT,
  INITIAL_BACKGROUND_SCRIPT,
  REMOVE_CONTEXT_MENU,
  CREATE_CONTEXT_MENU
} from '@/types'

try {
  runtime.onInstalled.addListener(detail => {
    switch (detail.reason) {
      case 'install':
        store.dispatch(INITIAL_STORAGE_FROM_DEFAULT)
        break

      case 'update':
        break

      default:
        break
    }
  })

  ;(async () => [await store.dispatch(INITIAL_BACKGROUND_SCRIPT)])()
  .then(([success]) => {
    if (!success) return false

    // do something after all initial successfully
    // store.dispatch('REQUEST_TRANSLATION', {})
    store.watch(state => state.settings.use_context_menu, (value) => {
      if (!value) store.dispatch(REMOVE_CONTEXT_MENU)
      else store.dispatch(CREATE_CONTEXT_MENU)
    })

    store.watch(state => state.settings.context_menu_way, async () => {
      await store.dispatch(REMOVE_CONTEXT_MENU)
      await store.dispatch(CREATE_CONTEXT_MENU)
    })
  })

  // initialize everything
} catch (error) {
  clog(
    '!!!something is wrong!!!'.toUpperCase(),
    `\n${error}`
  )
}

// auto forward message to vuex store's actions;
// action just is message of `sendMessage` and must
// accord with { type: 'SOME_ACTION_TYPE', [, payload] };
// allow asynchronous emit(response).
runtime.onMessage.addListener((action, sender, emit) =>
  (typeof store.dispatch(merge({ sender, emit }, action))) && true)

if (module.hot) module.hot.accept()
