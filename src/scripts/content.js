import FABLoader from "./libs/ui/float-action-button"
import FAPLoader from "./libs/ui/float-action-panel"
import selection from "./libs/ui/selection"
import {
  RESPONSE_FROM_BACKGROUND,
  CONNECT_FROM_CONTENT,
  TABS_UPDATE_CONNECT,
  SELECTED_TEXT_IN_CONTENT,
  TABS_UPDATE_COMPLETE,
} from "./libs/actions/types"

import "./libs/actions/content"

;(() => {
  const { runtime, storage } = browser

  const port = runtime.connect({ name: CONNECT_FROM_CONTENT })

  runtime.onConnect.addListener(_port => {
    const { name, onMessage } = _port

    if (name === TABS_UPDATE_CONNECT) {
      selection()()

      onMessage.addListener(({ type, meta = {}, payload = {} }) => {
        if (type === TABS_UPDATE_COMPLETE) {
          storage.local.get(cfg => {
            const { api_src, use_fab, context_menu_translate } = cfg

            cfg.content_url = runtime.getURL('content.html')

            if (use_fab) {
              FABLoader(cfg, port) // Float Action Button
              FAPLoader(cfg, port) // Float Action Panel

              return
            }

            if (context_menu_translate) {
              FAPLoader(cfg, port) // Float Action Panel
            }
          })
        }
      })
    }
  })

})()
