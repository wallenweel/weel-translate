import Weel from '../Weel'
import { do_action } from '../functions'
import {
  SWAP_LANGUAGE_COMPLETED,
  TRANSLATE_IN_POPUP,
} from '../actions/types'

export const swapLanguages = ({ currentTarget: {
  previousElementSibling,
  nextElementSibling,
}}) => {
  const [ ov, dv ] = [
    previousElementSibling.getAttribute('data-value'),
    nextElementSibling.getAttribute('data-value'),
  ]

  if (!ov && !dv) return 0

  const [ot, dt ] = [
    previousElementSibling.getAttribute('data-text'),
    nextElementSibling.getAttribute('data-text'),
  ]

  previousElementSibling.setAttribute('data-value', dv)
  previousElementSibling.setAttribute('data-text', dt)
  nextElementSibling.setAttribute('data-value', ov)
  nextElementSibling.setAttribute('data-text', ot)

  do_action(SWAP_LANGUAGE_COMPLETED, ov, dv)
}

Weel.prototype.initLanguages = function ({ name, languages = [] }) {
  this.data('src').set(name)

  if (!languages.length) return 0

  const _gen = elem => languages.forEach(lang => {
    const opt = document.createElement('div')

    opt.setAttribute('data-value', lang.code)
    opt.className = '-opt'
    opt.innerText = lang.slug

    elem.appendChild(opt)
  })

  _gen(this.elem.querySelector('.select.-origin'))
  _gen(this.elem.querySelector('.select.-target'))
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
