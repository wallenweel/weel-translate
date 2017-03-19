import { weel as $ } from "../Weel"
import { log, do_action, add_action } from "../functions"
import { translate_from } from "./"
import { settings } from '../ui/config'
import {
  SELECT_LACK_OPTIONS,

  MESSAGE_IN_POPUP,
  TRANSLATE_IN_POPUP,

  RESPOND_TRANSLATING,
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

add_action(TRANSLATE_IN_POPUP, (port, params) => {
  if (!params.q.length) return do_action(TRANSLATE_QUERY_NONE)

  port.postMessage(translate_from(scope, params))
})

add_action(SETTINGS_SET_SUCCESS, (name, value) => {
  console.log(name, value)

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

  console.log(select)
  const cfgName = $(select).hasClass('-origin') ? 'lang_from' : 'lang_to'
  const cfg = {
    text: target.textContent,
    value: $(target).data('value').get(),
  }

  settings().set({ [cfgName]: cfg })
  settings().log()
})

add_action(TRANSLATE_QUERY_NONE, () => console.error('Need Enter Some Words For Translating!'))

add_action(SET_LANGUAGES_FROM_TO, function setLanguages([fObj, fCfg], [tObj, tCfg]) {
  fObj.setAttribute('data-text', fCfg.text)
  fObj.setAttribute('data-value', fCfg.value)
  tObj.setAttribute('data-text', tCfg.text)
  tObj.setAttribute('data-value', tCfg.value)
})
