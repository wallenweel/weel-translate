import { do_action, add_action } from "./libs/functions"
import { translate_to } from "./libs/actions"
import { settings } from "./libs/ui/config"
import {
  MESSAGE_IN_BACKGROUND,
  NO_CONNECT_NAME,
  CONNECT_FROM_CONTENT,
  RESPONSE_FROM_BACKGROUND,
  CONNECT_WITH_TRANSLATING,
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

  case CONNECT_FROM_CONTENT:
    return settings().get(cfgs => {
      return port.postMessage({
        type: RESPONSE_FROM_BACKGROUND,
        payload: cfgs,
      })
    })

  default:
    return onMessage.addListener(data => do_action(NO_CONNECT_NAME, data, port))

  }
})

tabs.onUpdated.addListener(function(tabId , info) {
  if (info.status == "complete") {
    tabs.executeScript(tabId, {
      allFrames: true,
      file: "js/weel-translation.js",
      runAt: 'document_end',
    }).then(r => {
      console.log(r)
    })
  }
})
