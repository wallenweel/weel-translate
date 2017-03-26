import { weel as $ } from "../Weel"
import { log, do_action, add_action } from "../functions"
import { translate_from } from "./"
import { getTranslationParams } from '../ui/translation'
import { settings } from '../ui/config'
import {
  SELECT_LACK_OPTIONS,

  CONNECT_WITH_TRANSLATING,
  MESSAGE_IN_POPUP,

  RESPOND_TRANSLATING,
  TRANSLATE_IN_POPUP,
  TRANSLATE_QUERY_NONE,

  SETTINGS_SET_SUCCESS,

  SET_LANGUAGES_FROM_TO,
  SELECT_OPTION_CHANGED,
} from "../actions/types"

const scope = 'popup'

add_action(MESSAGE_IN_POPUP, ({ type, meta, payload }) => {
  switch (type) {

  case RESPOND_TRANSLATING:
    do_action(RESPOND_TRANSLATING, payload)
    do_action(`${RESPOND_TRANSLATING}_${meta.to.toUpperCase()}`, payload)
    break
  default:

  }
})

add_action(TRANSLATE_IN_POPUP, (
  port,
  params = getTranslationParams()
) => {
  if (!params.q.length) return do_action(TRANSLATE_QUERY_NONE)

  port.postMessage(translate_from(scope, params))
})

add_action(SETTINGS_SET_SUCCESS, (name, value) => {
  switch (name) {

  case 'api_src':
    return do_action(`CHANGED_SETTING_${name.toUpperCase()}`, value)
  default:

  }
})

add_action(SELECT_LACK_OPTIONS, select => {
  if (!$(select.parentElement).hasClass('language')) return 0

  console.log(`${$(select.parentElement).data('src').get()} 不支持选择语言。`)
})

add_action(SELECT_OPTION_CHANGED, (target, select) => {
  if (!$(select.parentElement).hasClass('language')) return 0

  select.setAttribute('data-text', target.textContent)
  select.setAttribute('data-value', target.getAttribute('data-value'))

  const cfgName = $(select).hasClass('-origin') ? 'lang_from' : 'lang_to'
  const cfg = {
    text: target.textContent,
    value: $(target).data('value').get(),
  }

  settings().set({ [cfgName]: cfg })
})

add_action(TRANSLATE_QUERY_NONE, () => console.error('Need Enter Some Words For Translating!'))

add_action(SET_LANGUAGES_FROM_TO, function setLanguages([origin, lang_from], [target, lang_to]) {
  origin.setAttribute('data-text', lang_from.text)
  origin.setAttribute('data-value', lang_from.value)
  target.setAttribute('data-text', lang_to.text)
  target.setAttribute('data-value', lang_to.value)

  settings(['lang_from', 'lang_to']).set({ lang_from, lang_to })
})
