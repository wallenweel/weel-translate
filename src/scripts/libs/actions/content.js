import { do_action, add_action } from '../functions'
import { WEEL_FAB } from "../ui/float-action-button"
import {
  SELECTED_TEXT_IN_CONTENT,
  REMOVED_SELECTION_IN_CONTENT,
  FAB_TRIGGERED,
  RENDER_FLOAT_ACTION_PANEL,
} from "./types"

add_action(SELECTED_TEXT_IN_CONTENT, (text, ev) => {
  const app = document.querySelector(WEEL_FAB)

  if (!app) return void 0

  const { clientX, clientY } = ev

  app.style.webkitTransform = `translate3D(${clientX}px, ${clientY}px, 0)`

  app.classList.add('_on')
})

add_action(REMOVED_SELECTION_IN_CONTENT, text => {
  const app = document.querySelector(WEEL_FAB)

  if (!app) return void 0

  app.classList.remove('_on')
})

add_action(FAB_TRIGGERED, (text, app) => {
  const transform = app.style.webkitTransform
  const action = {
    type: FAB_TRIGGERED,
    payload: {
      q: text,
    },
  }

  browser.runtime.sendMessage(action)

  do_action(RENDER_FLOAT_ACTION_PANEL, action, transform)
})

add_action(RENDER_FLOAT_ACTION_PANEL, (action, transform) => {

})
