import { add_action } from "../functions"
import { translate_to } from "./"
import { settings } from "../ui/config"
import {
  MESSAGE_IN_BACKGROUND,
} from "./types"

import translate from "../services/translation"

add_action(MESSAGE_IN_BACKGROUND, ({ type, meta = {}, payload = {} }, port) => {
  settings(['api_src', 'lang_from', 'lang_to']).get(({ api_src, lang_from, lang_to }) => {
    const { q, from = lang_from.value, to = lang_to.value } = payload
    
    translate(api_src, { q, from, to }).then(json => {
      port.postMessage(translate_to(meta.from, json))
    })
  })
})
