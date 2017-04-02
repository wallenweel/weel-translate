import { do_action, add_action, injectHTML } from '../functions'
import { handleMousedown, handleMouseup } from "../ui/selection"
import { WEEL_FAB } from "../ui/float-action-button"
import { WEEL_FAP } from "../ui/float-action-panel"
import {
  SELECTED_TEXT_IN_CONTENT,
  REMOVED_SELECTION_IN_CONTENT,
  FAB_TRIGGERED,
  RENDER_FLOAT_ACTION_PANEL,
  REMOVE_FAB_IN_CURRENT,
} from "./types"

add_action(SELECTED_TEXT_IN_CONTENT, (text, ev) => {
  const fab = document.querySelector(WEEL_FAB)

  if (!fab) return void 0

  const { clientX, clientY } = ev

  fab.style.webkitTransform = `translate3D(${clientX + 2}px, ${clientY + 2}px, 0)`

  fab.classList.add('_on')
})

add_action(REMOVED_SELECTION_IN_CONTENT, text => {
  const fab = document.querySelector(WEEL_FAB)
  const fap = document.querySelector(WEEL_FAP)

  if (fab) {
    fab.classList.remove('_on')
  }

  if (fap) {
    fap.classList.remove('_on')
  }
})

add_action(FAB_TRIGGERED, (port, q, fab) => {
  fab.classList.remove('_on')

  if (!q) return do_action(REMOVED_SELECTION_IN_CONTENT, q)

  const transform = fab.style.webkitTransform
  const action = {
    type: FAB_TRIGGERED,
    payload: { q },
  }

  port.postMessage(action)
})

add_action(RENDER_FLOAT_ACTION_PANEL, ({ payload = {} }) => {
  const fap = document.querySelector(WEEL_FAP)

  if (!fap) return void 0

  const fab = document.querySelector(WEEL_FAB)
  const transform = fab.style.webkitTransform

  const { explains, phonetic, translation } = payload

  const _phonetic = fap.querySelector('weel[id$="-phonetic-plain"]')
  const _explain = fap.querySelector('weel[id$="-explain-plain"]')
  const _detail = fap.querySelector('weel[id$="-explain-detail"]')

  _phonetic.innerText = `[ ${phonetic[0] || '...'} ]`
  _explain.innerText = `${translation.join(' ')}`

  _detail.classList[explains.length ? 'add' : 'remove']('_on')
  injectHTML(`${explains.join('<br>')}`, _detail)

  /** @type {Array} FAB Position */
  let pos = transform.match(/(\d+)px/gi).map(e => +e.match(/\d+/)[0])

  const [pW, pH] = [fap.clientWidth, fap.clientHeight]
  const [wW, wH] = [window.innerWidth, window.innerHeight]

  if (pos[0] + pW >= wW) {
    pos[0] = wW - pW
  }

  if (pos[1] + pH >= wH) {
    pos[1] = wH - pH
  }

  fap.style.webkitTransform = `translate3d(${pos.map(e => `${e}px`).join(', ')})`
  fap.classList.add('_on')
})

add_action(REMOVE_FAB_IN_CURRENT, () => {
  const fab = document.querySelector(WEEL_FAB)
  const fap = document.querySelector(WEEL_FAP)

  document.body.removeChild(fab)
  document.body.removeChild(fap)

  document.body.removeEventListener('mousedown', handleMousedown, false)
  document.body.removeEventListener('mouseup', handleMouseup, false)
})
