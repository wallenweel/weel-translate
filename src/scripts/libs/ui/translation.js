import Weel from '../Weel'
import { do_action, add_action, i18n } from '../functions'
import config, { settings } from '../ui/config'
import {
  SET_LANGUAGES_FROM_TO,
  SWAP_LANGUAGE_COMPLETED,
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

    settings(['lang_from', 'lang_to']).set({ lang_from, lang_to })
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
