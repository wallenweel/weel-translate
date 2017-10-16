import Weel, { weel as $ } from '../Weel'
import { do_action, add_action, i18n } from '../functions'
import config, { settings } from '../config'
import {
  SET_LANGUAGES_FROM_TO,
  SWAP_LANGUAGE_COMPLETED,
  TRANSLATE_WITH_CONTEXT_MENU,
  FAB_TRIGGERED,

  CONNECT_FROM_CONTEXT_MENU,
} from '../actions/types'

import { apiPick } from "../services/translation"

export const swapLanguages = ({ currentTarget: {
  previousElementSibling,
  nextElementSibling,
}}) => {
  const fCfg = {
    text: previousElementSibling.getAttribute('data-text'),
    value: previousElementSibling.getAttribute('data-value'),
  }

  const tCfg = {
    text: nextElementSibling.getAttribute('data-text'),
    value: nextElementSibling.getAttribute('data-value'),
  }

  if (!fCfg.value && !tCfg.value) return 0

  do_action(
    SET_LANGUAGES_FROM_TO,
    [previousElementSibling, tCfg],
    [nextElementSibling, fCfg]
  )

  do_action(
    SWAP_LANGUAGE_COMPLETED,
    [previousElementSibling, fCfg],
    [nextElementSibling, tCfg]
  )
}

Weel.prototype.initLanguages = function ({ name, languages = [] }, src = '') {
  this.data('src').set(name)

  const _gen = elem => {
    const fgm = document.createDocumentFragment()
    const ato = (code, trans) => {
      const opt = document.createElement('div')

      opt.setAttribute('data-value', code)
      opt.className = '-opt'
      opt.innerText = trans

      return opt
    }

    if (languages && languages.length)
      languages.forEach(({ code, trans }) => fgm.appendChild(ato(code, trans)))

    this.html(fgm, elem)
  }

  const fObj = this.elem.querySelector('.select.-origin')
  const tObj = this.elem.querySelector('.select.-target')

  if (src) {
    const { lang_from, lang_to } = apiPick(src).presets()

    do_action(
      SET_LANGUAGES_FROM_TO,
      [fObj, lang_from],
      [tObj, lang_to]
    )
  }

  _gen(fObj)
  _gen(tObj)
}

Weel.prototype.textArea = function () {
  const target = this.elems[0]

  if (target.nodeName.toLowerCase() !== 'textarea') return 0

  return ({
    out: ()   => (target.value.trim()),
    in: str   => (target.value = str),
    copy: ()  => (target.select() || document.execCommand('copy')),
    // TODO: Implement paste text by clicking a button
    paste: ev => {
      console.log(ev.clipboardData.getData('text/plain'))
      // (target.value = ev.clipboardData.trim())
    },
    clear: () => (target.value = ''),
  })
}

export const getTranslationParams = context => {
  const inputStream = (context || document).querySelector('.input-stream')

  return ({
    q: $('textarea', inputStream).textArea().out(),
    from: $('.language .-origin', inputStream).getAttr('data-value'),
    to: $('.language .-target', inputStream).getAttr('data-value'),
  })
}

export const option_to_config = target => {
  const { name, value } = target

  switch (target.type) {

  case 'checkbox':
    return settings().set({ [name]: target.checked })

  default:
    return settings().set({ [name]: value })

  }
}

export const config_to_option = (cfg, target) => {
  const { name, value } = target

  switch (target.type) {

  case 'radio':
    return (value === cfg[name]) ? (target.checked = true) : void 0

  case 'checkbox':
    return target.checked = cfg[name]

  default:
    return target.value = cfg[name]

  }
}

export const config_to_render = scope => {
  try {
    settings().get().then(cfg => {
      let targets = scope.querySelectorAll('input, textarea')

      targets = ([...targets]).filter(target => target.name.length)

      targets.forEach(target => config_to_option(cfg, target))
    })
  } catch (e) {}
}

export const register_contextMenus = active => {
  if (active === false) {
    browser.contextMenus.remove(TRANSLATE_WITH_CONTEXT_MENU)
  } else {
    browser.contextMenus.create({
      id: TRANSLATE_WITH_CONTEXT_MENU,
      title: i18n.get('TRANSLATE_SELECTED_CONTENT'),
      contexts: [ "all" ],
      // command: "_execute_browser_action",
    })

    browser.contextMenus.onClicked.addListener(({ menuItemId, selectionText }, tab) => {
      const { id } = tab

      if (menuItemId === TRANSLATE_WITH_CONTEXT_MENU) {
        const port = browser.tabs.connect(id, { name: CONNECT_FROM_CONTEXT_MENU })

        port.postMessage({
          type: TRANSLATE_WITH_CONTEXT_MENU,
          payload: {
            q: selectionText,
          },
        })
      }
    })
  }
}
