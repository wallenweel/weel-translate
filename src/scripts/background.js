import { do_action, add_action } from "./libs/functions"
import { translate_to } from "./libs/actions"
import { settings } from "./libs/ui/config"
import {
  MESSAGE_IN_BACKGROUND,
  NO_CONNECT_NAME,
  CONNECT_FROM_CONTENT,
  RESPONSE_FROM_BACKGROUND,
  CONNECT_WITH_TRANSLATING,
  TABS_UPDATE_CONNECT,
  FAB_TRIGGERED,
} from "./libs/actions/types"

import translate from "./libs/services/translation"
import "./libs/actions/background"

const scope = 'background'
const { runtime, tabs } = browser

// Initial Settings
settings().init()

runtime.onConnect.addListener(port => {
  const { name, onMessage } = port

  switch (name) {

  case CONNECT_WITH_TRANSLATING:
    return onMessage.addListener(data => do_action(MESSAGE_IN_BACKGROUND, data, port))

  default:
    return onMessage.addListener(data => do_action(NO_CONNECT_NAME, data, port))

  }
})

runtime.onMessage.addListener(({ type, meta = {}, payload = {} }) => {
  switch (type) {
  case FAB_TRIGGERED:
    console.log(payload)
    console.log(browser.extension.getViews())
    break
  default:

  }
})

tabs.onUpdated.addListener((id , { status }) => {
  if (!status) return void 0

  const port = tabs.connect(id, { name: TABS_UPDATE_CONNECT })

  port.postMessage({
    type: `TABS_UPDATE_${status.toUpperCase()}`,
    meta: { status, id },
    payload: {},
  })
})
