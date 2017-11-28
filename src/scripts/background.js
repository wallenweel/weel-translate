import { do_action, add_action, i18n } from "./libs/functions"
import { translate_to } from "./libs/actions"
import { register_contextMenus } from "./libs/ui/translation"
import { settings } from "./libs/config"
import {
  MESSAGE_IN_BACKGROUND,
  NO_CONNECT_NAME,
  CONNECT_FROM_CONTENT,
  CONNECT_FROM_SYNTH,
  RESPONSE_FROM_BACKGROUND,
  CONNECT_WITH_TRANSLATING,
  TABS_UPDATE_CONNECT,
  FAB_TRIGGERED,
  TRANSLATE_WITH_CONTEXT_MENU,
} from "./libs/actions/types"

import translate from "./libs/services/translation"
import { APISpeaking, TTSSpeaking } from "./libs/services/synth"
import "./libs/actions/background"

const scope = 'background'
const { runtime, tabs } = browser

// Initial Settings
settings().init()

settings().get(({ context_menu_translate }) => {
  register_contextMenus(context_menu_translate)
})

runtime.onConnect.addListener(port => {
  const { name, onMessage } = port

  switch (name) {

  case CONNECT_WITH_TRANSLATING:
    return onMessage.addListener(data => do_action(MESSAGE_IN_BACKGROUND, data, port))

  case CONNECT_FROM_CONTENT:
    return onMessage.addListener(data => {
      do_action(MESSAGE_IN_BACKGROUND, data, port)
    })
  case CONNECT_FROM_SYNTH:
    return onMessage.addListener(({ content, cfg }) => {
      const { api_speaking } = cfg

      if (!!api_speaking) {
        APISpeaking(content, cfg)
      } else {
        TTSSpeaking(content, cfg)
      }
    })

  default:
    return onMessage.addListener(data => do_action(NO_CONNECT_NAME, data, port))

  }
})

tabs.onUpdated.addListener((id , {}, { status }) => {
  // if (!status) return void 0

  // const port = tabs.connect(id, { name: TABS_UPDATE_CONNECT })

  if (status !== 'complete') return void 0

  tabs.sendMessage(id, {
    type: `TABS_UPDATE_${status.toUpperCase()}`,
    meta: { status, id },
    payload: {},
  }).catch(err => console.error(`Error: ${err}`))
})
