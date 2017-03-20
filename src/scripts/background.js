import { do_action, add_action } from './libs/functions'
import { translate_to } from './libs/actions'
import { settings } from './libs/ui/config'
import {
  BACKGROUND_ON_CONNECTED,
  MESSAGE_IN_BACKGROUND,
  NO_CONNECT_NAME,

  CONNECT_WITH_TRANSLATING,
  TRANSLATE_QUERY_DONE,
} from './libs/actions/types'

import translate from './libs/services/translation'

const scope = 'background'

// Initial Settings
settings().init()

browser.runtime.onConnect.addListener(port => {
  const { name, onMessage } = port

  switch (name) {

  case CONNECT_WITH_TRANSLATING:
    return onMessage.addListener(data => do_action(MESSAGE_IN_BACKGROUND, data, port))
  default:
    return onMessage.addListener(data => do_action(NO_CONNECT_NAME, data, port))

  }

})

add_action(MESSAGE_IN_BACKGROUND, ({ type, meta, payload }, port) => {
  const { q, from, to } = payload

  settings('api_src').get(({ api_src }) => {
    translate(api_src, { q, from, to }).then(json => {
      port.postMessage(translate_to(meta.from, json))
    })
  })
})
