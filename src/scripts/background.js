import * as config from './libs/ui/config'
import { do_action, add_action } from './libs/functions'
import { translate_to } from './libs/actions'
import translate from './libs/services/translation'
import {
  BACKGROUND_ON_CONNECTED,
  MESSAGE_IN_BACKGROUND,
  TRANSLATE_QUERY_DONE,
  CONNECT_WITH_TRANSLATING,
} from './libs/actions/types'

const scope = 'background'
const localStorage = browser.storage.local

localStorage.get().then(cfg => {
  if (Object.keys(cfg).length > 0) return void 0

  browser.storage.local.set(config)
})

browser.runtime.onConnect.addListener(port => {
  const { name, onMessage } = port
  switch (name) {
  case CONNECT_WITH_TRANSLATING:

    return onMessage.addListener(data => do_action(MESSAGE_IN_BACKGROUND, data, port))
  default:

  }

})

add_action(MESSAGE_IN_BACKGROUND, ({ type, meta, payload }, port) => {
  const { q } = payload

  localStorage.get('api_src').then(({ api_src }) => {
    // translate(api_src, { q }).then(json => {
    translate('google', { q }).then(json => {
      port.postMessage(translate_to(meta.from, json))
    })
  })
})
