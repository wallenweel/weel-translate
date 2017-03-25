import { do_action } from "../functions"
import {
  SELECTED_TEXT_IN_CONTENT,
  REMOVED_SELECTION_IN_CONTENT,
} from "../actions/types"

export const selectedText = () => window.getSelection().toString().trim()

export default () => {
  return () => {
    document.body.addEventListener('mousedown', handleMousedown, false)
    document.body.addEventListener('mouseup', handleMouseup, false)
  }
}

export function handleMousedown(ev) {
  if (ev.button === 2) return void 0

  if (!selectedText()) return void 0

  do_action(REMOVED_SELECTION_IN_CONTENT, selectedText(), ev)
  const fixSelection = setTimeout(() => {
    if (selectedText()) return void 0


    clearTimeout(fixSelection)
  }, 300)
}

export function handleMouseup(ev) {
  if (ev.button === 2) return void 0

  if (!selectedText()) return void 0

  const fixSelection = setTimeout(() => {
    if (!selectedText()) return do_action(REMOVED_SELECTION_IN_CONTENT, selectedText(), ev)

    do_action(SELECTED_TEXT_IN_CONTENT, selectedText(), ev)

    clearTimeout(fixSelection)
  }, 100)
}
