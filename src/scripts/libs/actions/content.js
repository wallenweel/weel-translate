import { do_action, add_action, injectHTML } from '../functions'
import { selectionRect, handleMouseup } from "../ui/selection"
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
  const { clientHeight, clientWidth } = fab
  const { x, y, height, width } = selectionRect()

  const pos_x = clientX + 2
  const pos_y = (clientY - y) > (height / 2) ? (y + height) : (clientY - clientHeight)

  fab.style.webkitTransform = `translate3D(${pos_x}px, ${pos_y}px, 0)`
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

add_action(FAB_TRIGGERED, (port, q, ev) => {
  const fab = ev.currentTarget

  fab.classList.remove('_on')

  if (!q) return do_action(REMOVED_SELECTION_IN_CONTENT, q)

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

  const [wW, wH] = [window.innerWidth, window.innerHeight]
  const [pW, pH] = [fap.clientWidth, fap.clientHeight]

  const show_by_fab = () => {
    /** @type {Array} FAB Position */
    let pos = transform.match(/([\d\.]+)px/gi).map(e => +e.match(/\d+/)[0])

    if (pos[0] + pW >= wW) {
      pos[0] = wW - pW
    }

    if (pos[1] + pH >= wH) {
      pos[1] = wH - pH
    }

    fap.classList.add('_no-arrow')
    fap.style.width = 'auto'
    fap.style.webkitTransform = `translate3d(${pos.map(e => `${e}px`).join(', ')})`
  }

  const show_by_selection = () => {
    const { clientHeight, clientWidth } = fap
    const { x, y, height, width } = selectionRect()

    const midd_x = (x + width / 2) - (clientWidth / 2)
    const pos_x = midd_x
    const pos_y = (y + height + clientHeight) < wH ? fap.classList.remove('_reverse') || (y + height) : fap.classList.add('_reverse') || (y - clientHeight)

    fap.style.webkitTransform = `translate3D(${pos_x}px, ${pos_y}px, 0)`

    const fapContainer = fap.querySelector(`${WEEL_FAP}--container`)
    let offset_x = fapContainer.clientWidth / 2

    if ((midd_x + offset_x) >= wW) {
      offset_x += (midd_x + offset_x - wW)
    }

    if (midd_x <= offset_x) {
      offset_x -= (wW - (midd_x + offset_x))
    }

    fapContainer.style.left = `-${offset_x}px`
  }

  const show_at_br = () => {
    fap.classList.add('_no-arrow')
    fap.style.width = 'auto'
    fap.style.webkitTransform = `translate3D(${wW - pW}px, ${wH - pH - 12}px, 0)`
  }

  // show_by_fab()
  // show_by_selection()
  show_at_br()

  fap.classList.add('_on')
})

add_action(REMOVE_FAB_IN_CURRENT, () => {
  const fab = document.querySelector(WEEL_FAB)
  const fap = document.querySelector(WEEL_FAP)

  document.body.removeChild(fab)
  document.body.removeChild(fap)

  document.body.removeEventListener('mouseup', handleMouseup, false)
})
