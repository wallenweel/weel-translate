export const templateLoaded = (state, { container, targets }) => {
  state.container = container
  state.targets = targets
}

export const getSelection = (state, selection) => {
  state.selectionText = selection.toString()
  state.selectionRect = selection.getRangeAt(0).getBoundingClientRect()
}
