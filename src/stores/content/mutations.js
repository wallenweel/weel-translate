export const getSelection = (state, selection = document.getSelection()) => {
  state.selectionText = selection.toString()
  state.selectionRect = selection.getRangeAt(0).getBoundingClientRect()
}
