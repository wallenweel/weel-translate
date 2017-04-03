import { do_action } from "../functions"
import { getFAP } from "./float-action-panel"
import {
  SELECTED_TEXT_IN_CONTENT,
  REMOVED_SELECTION_IN_CONTENT,
} from "../actions/types"

export const selectionRect = () => {
  const selection = window.getSelection()
  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()

  return selection.toString().trim() ? rect : {}
}

export const selectedText = () => window.getSelection().toString().trim()

export default () => {
  return () => {
    document.body.addEventListener('mouseup', handleMouseup, false)
  }
}

export function handleMouseup(ev) {
  if (ev.button === 2) return void 0

  const coll = window.getSelection().isCollapsed
  const isOn = getFAP().classList.contains('_on')

  if (coll || isOn) return do_action(REMOVED_SELECTION_IN_CONTENT, selectedText, ev)

  const fixSelection = setTimeout(() => {
    do_action(SELECTED_TEXT_IN_CONTENT, selectedText, ev)

    clearTimeout(fixSelection)
  }, 100)
}
