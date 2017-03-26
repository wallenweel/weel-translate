import { add_action } from "../functions"
import { translate_to } from "./"
import { settings } from "../ui/config"
import {
  MESSAGE_IN_BACKGROUND,
} from "./types"

import translate from "../services/translation"

add_action(MESSAGE_IN_BACKGROUND, ({ type, meta = {}, payload = {} }, port) => {
  settings().get(cfg => {
    const { api_src, lang_from, lang_to, custom_api } = cfg
    const { q, from = lang_from.value, to = lang_to.value } = payload
    const params = { q, from, to }

    if (api_src === 'youdao') {
      const custom = JSON.parse(custom_api)

      for (let i = 0; i < custom.length; i++) {
        const { keyfrom, key } = custom[i]

        if (!keyfrom || !key) break

        params.keyfrom = keyfrom
        params.key = key
      }
    }

    translate(api_src, params).then(json => {
      port.postMessage(translate_to(meta.from, json))
    })
  })
})
