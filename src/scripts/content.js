import FABLoader from "./libs/ui/fab"
import { do_action } from "./libs/functions"
import selection from "./libs/ui/selection"
import {
  RESPONSE_FROM_BACKGROUND,
  CONNECT_FROM_CONTENT,
  TABS_UPDATE_CONNECT,
  SELECTED_TEXT_IN_CONTENT,
} from "./libs/actions/types"

import "./libs/actions/content"

;(() => {
  const { runtime, storage } = browser

  runtime.onConnect.addListener(port => {
    const { name, onMessage } = port

    if (name === TABS_UPDATE_CONNECT) {

      selection()()

      onMessage.addListener(({ type, meta = {}, payload = {} }) => {
        storage.local.get(cfgs => {
          const { api_src, use_fab } = cfgs

          // Float Action Button
          if (use_fab) FABLoader(cfgs)
        })
      })
    }
  })

})()
