import FABLoader from "./libs/ui/float-action-button"
import FAPLoader from "./libs/ui/float-action-panel"
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
        storage.local.get(cfg => {
          const { api_src, use_fab } = cfg

          cfg.content_url = runtime.getURL('content.html')

          // Float Action Button
          if (use_fab) {
            FABLoader(cfg)
            FAPLoader(cfg)
          }
        })
      })
    }
  })

})()
