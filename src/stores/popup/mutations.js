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
  const IDs = Object.keys(state.api)

  let nextIndex = IDs.indexOf(state.currentSource.id) + 1
  if (nextIndex === IDs.length) nextIndex = 0

  state.currentSource = Object.values(state.api)[nextIndex]
}

export const languageChanges = (state, langs) => {
  state.src_dest = langs
}

export const updateTmpState = (state, [key, value]) => {
  state.tmp[key] = value
}
