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

  runtime.onMessage.addListener(({ type, meta = {}, payload = {} }) => {
    if (!document.body || !!document.querySelector('weel')) return

    if (type === TABS_UPDATE_COMPLETE) {
      storage.local.get(cfg => {
        selection(cfg)(port)

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

})()
