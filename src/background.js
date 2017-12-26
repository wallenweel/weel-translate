import merge from 'deepmerge'
import store from '@/stores/background'
import { runtime } from '@/globals'
import {
  INITIAL_STORAGE_FROM_DEFAULT,
  INITIAL_BACKGROUND_SCRIPT
} from '@/types'
import parserHelper from '@/functions/parserHelper'
import responseLines from '@/api/mocks/responseLines'
// import responseSingle from '@/api/mocks/responseSingle'

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
    const mock = {
      parser: {
        // 'explain': `{a}[dict]{pos, terms}`
        'phonetic_src': [`sentences.$.src_translit`, `sentences.$.translit`],
        'phonetic_dest': `sentences.$.translit`,
        'translation': `sentences(trans)`,
        'explain': `dict(pos////terms)`
        // 'explain': `dict.0.entry(////)`
      }
    }
    const res = parserHelper(mock)(responseLines)
    console.log(res)
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
