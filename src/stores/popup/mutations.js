export const globalTip = (state, [open, msg]) => {
  state.globalTip = [open, msg]
}

export const drawerNavigationToggle = state => {
  state.drawerNavigationToggle = !state.drawerNavigationToggle
}

export const currentServiceSource = (state, {
  id, name, icon,
  languages
}) => {
  state.currentSource = { id, name, icon, languages }
}

export const nextServiceSource = (state) => {
  const ids = Object.keys(state.api)

  let nextIndex = ids.indexOf(state.currentSource.id) + 1
  if (nextIndex === ids.length) nextIndex = 0

  state.current_service_id = ids[nextIndex]
  state.currentSource = state.api[ids[nextIndex]]
}

export const languageChanges = (state, langs) => {
  state.src_dest = langs
}

export const removeHistory = (state, index) => {
  state.tmp.history.splice(index, 1)
  state.translation_history = state.tmp.history
}

export const clearHistory = (state) => {
  state.translation_history = state.tmp.history = []
}

export const updateTmpState = (state, [key, value]) => {
  state.tmp[key] = value
}
