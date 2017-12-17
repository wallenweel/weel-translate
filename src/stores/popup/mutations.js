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
  state.settings.test = new Date()
  const IDs = Object.keys(state.api)

  let nextIndex = IDs.indexOf(state.currentSource.id) + 1
  if (nextIndex === IDs.length) nextIndex = 0

  state.currentSource = Object.values(state.api)[nextIndex]
}
