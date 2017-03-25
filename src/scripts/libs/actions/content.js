import { add_action } from '../functions'
import { WEEL_APP } from "../ui/fab"
import {
  SELECTED_TEXT_IN_CONTENT,
  REMOVED_SELECTION_IN_CONTENT,
  FAB_TRIGGERED,
} from "./types"

add_action(SELECTED_TEXT_IN_CONTENT, (text, ev) => {
  const app = document.querySelector(WEEL_APP)

  if (!app) return void 0

  const rect = app.offsetParent.getBoundingClientRect()
  const [ left, top ] = [
    ev.clientX - rect.x,
    ev.clientY - rect.y,
  ]

  app.style.left = `${left}px`
  app.style.top = `${top + app.clientHeight}px`

  app.classList.add('_on')
})

add_action(REMOVED_SELECTION_IN_CONTENT, text => {
  const app = document.querySelector(WEEL_APP)

  if (!app) return void 0

  app.classList.remove('_on')
})

add_action(FAB_TRIGGERED, text => {
  console.log(text)
  browser.runtime.sendMessage({
    type: FAB_TRIGGERED,
    payload: {
      q: text,
    },
  })
})
