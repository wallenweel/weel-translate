import merge from 'deepmerge'
import store from '@/stores/background'
import { runtime, tabs } from '@/globals'
import {
  INITIAL_STORAGE_FROM_DEFAULT,
  INITIAL_BACKGROUND_SCRIPT
} from '@/types'

try {
  runtime.onInstalled.addListener(detail => {
    switch (detail.reason) {
      case 'install':
        store.dispatch(INITIAL_STORAGE_FROM_DEFAULT)
        break

      case 'update':
        // store.dispatch(INITIAL_STORAGE_FROM_DEFAULT)
        // window.browser.storage.local.get().then(all => {
        //   console.log(all)
        // })
        break

      default:
        break
    }
  })

  ;(async () => [await store.dispatch(INITIAL_BACKGROUND_SCRIPT)])()
  .then(([success]) => {
    if (!success) return false

    // do something after all initial successfully
    // store.watch(state => state.settings.test, a => console.log(a))
    // store.dispatch('REQUEST_TRANSLATION', {})
    // console.log(store.state.templates['float-result-panel'])

    // tabs.onUpdated.addListener(() => {
    //   tabs.executeScript({
    //     file: '/content/app.js',
    //     allFrames: true,
    //     matchAboutBlank: true,
    //     runAt: 'document_idle'
    //   })
    // })
    console.log(store.state.templates.compiled['default'].style)
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
