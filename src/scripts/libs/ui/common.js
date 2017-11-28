import Weel, { weel as $ } from '../Weel'
import { do_action, i18n } from '../functions'
import {
  PAGE_IS_SWITCHING,
  SELECT_LACK_OPTIONS,
  SELECT_OPTION_CHANGED,
} from '../actions/types'

export const wave = ev => {
  const target = ev.target

  if (!$(target).isUI('wave')) return void 0

  const wave = document.createElement('span')

  target.appendChild(wave)

  if (!wave.offsetParent) return void 0

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
