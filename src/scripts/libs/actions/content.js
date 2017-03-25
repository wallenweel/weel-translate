import { do_action, add_action } from '../functions'
import { WEEL_FAB } from "../ui/float-action-button"
import { WEEL_FAP } from "../ui/float-action-panel"
import {
  SELECTED_TEXT_IN_CONTENT,
  REMOVED_SELECTION_IN_CONTENT,
  FAB_TRIGGERED,
  RENDER_FLOAT_ACTION_PANEL,
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

add_action(FAB_TRIGGERED, (port, text, fab) => {
  const transform = fab.style.webkitTransform
  const action = {
    type: FAB_TRIGGERED,
    payload: {
      q: text,
    },
  }

  port.postMessage(action)

  do_action(RENDER_FLOAT_ACTION_PANEL, port, action, transform)
})

add_action(RENDER_FLOAT_ACTION_PANEL, (port, action, transform) => {
  const fap = document.querySelector(WEEL_FAP)

  if (!fap) return void 0

  port.onMessage.addListener(({ type, meta, payload }) => {
    const { explains, phonetic, translation } = payload

    const _phonetic = fap.querySelector('weel[id$="-phonetic-plain"]')
    const _explain = fap.querySelector('weel[id$="-explain-plain"]')
    const _detail = fap.querySelector('weel[id$="-explain-detail"]')

    _phonetic.innerText = `[ ${phonetic[0] || '...'} ]`
    _explain.innerText = `${translation.join(' ')}`
    _detail.innerHTML = `${explains.join('<br>')}`

    fap.style.webkitTransform = transform
    fap.classList.add('_on')

  })
})
