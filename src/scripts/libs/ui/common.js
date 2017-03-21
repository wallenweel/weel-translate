import Weel, { weel as $ } from '../Weel'
import { do_action, i18n } from '../functions'
import {
  PAGE_IS_SWITCHING,
  SELECT_LACK_OPTIONS,
  SELECT_OPTION_CHANGED,
 } from '../actions/types'

export const setTitle = (title = '', localize = 1) => {
  const r = !localize ? title : i18n.get(title)

  document.querySelector('header.toolbar > h1.title').innerText = r
}

export const wave = ev => {
  const target = ev.target

  if (!$(target).isUI('wave')) return void 0

  const wave = document.createElement('span')

  target.appendChild(wave)

  const rect = wave.offsetParent.getBoundingClientRect()
  const [ left, top ] = [
    ev.clientX - rect.x,
    ev.clientY - rect.y,
  ]

  wave.classList.add('wave')
  wave.style.left = `${left}px`
  wave.style.top = `${top}px`

  setTimeout(() => target.removeChild(wave), 2000)
}

export const select = ev => {
  const target = ev.target
  const select = $(target.parentElement).isUI('select') ? target.parentElement : target

  if (!$(select).isUI('select')) return void 0
  // If has only one option
  if (select.querySelectorAll('.-opt').length <= 1) {
    return do_action(SELECT_LACK_OPTIONS, select, ev)
  }

  ev.stopPropagation()
  ev.preventDefault()

  if ($(target).hasClass('-opt')) {
    return do_action(SELECT_OPTION_CHANGED, target, select, ev)
  }

  $('.select.-js._on', ev.currentTarget).off()

  target.classList.add('_on')
}

Weel.prototype.pageSwitcher = function ({ href, innerText }) {
  const [ page, name ] = /\/([\w\-\_\.]+)\.html/.exec(href)
  const aim = this.sight(`.-${name}`)

  if ($(aim[0]).hasClass('_on') || !aim.length) return void 0

  do_action(PAGE_IS_SWITCHING, name)
  do_action(`${PAGE_IS_SWITCHING}_${name.toUpperCase()}`, name)

  setTitle(innerText, 0)

  this.off(this.elems)
  this.on(aim)
}

Weel.prototype.localizeHTML = function () {
  this.elems.forEach(elem => i18n.html(elem))

  return this
}
