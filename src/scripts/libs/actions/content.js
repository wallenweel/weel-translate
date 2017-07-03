import { do_action, add_action, injectHTML, detectLanguage } from '../functions'
import { selectionRect, handleMouseup } from "../ui/selection"
import { apiPick } from "../services/translation"
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
  const q = (text() || '').trim()

  if (!fab || !q.length) return void 0

  if (/true/.test(fab.getAttribute('data-check-aim'))) {
    const src = fab.getAttribute('data-api-src')
    const from = fab.getAttribute('data-lang-from')
    const api = apiPick(src)

    if (src !== 'youdao') {
      if (detectLanguage(q, api.uniform) !== from) {
        return void 0
      }
    }
  }

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

  if (!!fab) fab.classList.remove('_on')

  if (!!fap) fap.classList.remove('_on')
})

add_action(FAB_TRIGGERED, (port, q, ev) => {
  const fab = ev.currentTarget

  if (!!fab) fab.classList.remove('_on')

  if (!q) return do_action(REMOVED_SELECTION_IN_CONTENT, q)

  const action = {
    type: FAB_TRIGGERED,
    payload: { q },
  }

  port.postMessage(action)
})

add_action(RENDER_FLOAT_ACTION_PANEL, ({ payload = {} }, cfg) => {
  const fap = document.querySelector(WEEL_FAP)

  if (!fap) return do_action(REMOVED_SELECTION_IN_CONTENT)

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

  const show = {}

  show['near_fab'] = () => {
    const fab = document.querySelector(WEEL_FAB)
    const transform = fab.style.webkitTransform

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

  show['text_bc'] = () => {
    const { clientHeight, clientWidth } = fap
    const { x, y, height, width } = selectionRect()

    const midd_x = (x + width / 2) - 12
    const pos_x = midd_x
    const pos_y = (y + height + clientHeight) < wH ? fap.classList.remove('_reverse') || (y + height) : fap.classList.add('_reverse') || (y - clientHeight)

    fap.style.webkitTransform = `translate3D(${pos_x}px, ${pos_y}px, 0)`

    const fapContainer = fap.querySelector(`${WEEL_FAP}--container`)
    let halfCon = fapContainer.clientWidth / 2 - 12
    let offset_x = halfCon

    if ((midd_x + halfCon) >= wW) {
      offset_x = halfCon * 2 - 12
    }

    if (midd_x <= halfCon) {
      offset_x = 12
    }

    fapContainer.style.left = `-${offset_x}px`
  }

  show['page_br'] = () => {
    fap.classList.add('_no-arrow')
    fap.style.width = 'auto'
    fap.style.webkitTransform = `translate3D(${wW - pW}px, ${wH - pH - 12}px, 0)`
  }

  show[cfg.fab_pos || 'text_bc']()

  fap.classList.add('_on')
})

add_action(REMOVE_FAB_IN_CURRENT, () => {
  const fab = document.querySelector(WEEL_FAB)
  const fap = document.querySelector(WEEL_FAP)

  document.body.removeChild(fab)
  document.body.removeChild(fap)

  document.body.removeEventListener('mouseup', handleMouseup, false)
})
