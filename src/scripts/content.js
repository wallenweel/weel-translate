import Weel, { weel as $ } from "./libs/Weel"
import fabLoader from "./libs/ui/fab"
import {
  RESPONSE_FROM_BACKGROUND,
  CONNECT_FROM_CONTENT,
  TABS_UPDATE_CONNECT,
} from "./libs/actions/types"

;(() => {
  const { runtime, storage } = browser

  runtime.onConnect.addListener(port => {
    const { name, onMessage } = port

    if (name === TABS_UPDATE_CONNECT) {
      onMessage.addListener(({ type, meta = {}, payload = {} }) => {
        storage.local.get(({ api_src, use_fab }) => {
          // Float Action Button
          if (use_fab) fabLoader(runtime, api_src)
        })
      })
    }
  })





})()
