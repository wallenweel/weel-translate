export const getSelection = (state, selection = document.getSelection()) => {
  state.selectionText = selection.toString()
  state.selectionRect = selection.getRangeAt(0).getBoundingClientRect()
}

export const clearSelection = (state) => {
  state.selectionText = ''
  state.selectionRect = null
}

export const fabToggle = (state, value = false) => {
  if (!state.settings.use_fab) return false
  state.fabShow = value
}

export const fapToggle = (state, value = false) => {
  state.fapShow = value
}
