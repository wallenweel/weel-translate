import { add_action } from "../functions"
import { translate_to } from "./"
import { settings } from "../ui/config"
import {
  MESSAGE_IN_BACKGROUND,
} from "./types"

import translate from "../services/translation"

add_action(MESSAGE_IN_BACKGROUND, ({ type, meta = {}, payload = {} }, port) => {
  const { q, from, to } = payload

  settings('api_src').get(({ api_src }) => {
    translate(api_src, { q, from, to }).then(json => {
      port.postMessage(translate_to(meta.from, json))
    })
  })
})
