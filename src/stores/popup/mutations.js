import {
  CURRENT_LANGUAGES,
  DRAWER_NAGIVATION_TOGGLE,
  CURRENT_SERVICE_SOURCE,
  NEXT_SERVICE_SOURCE
} from '@/types'

const __ = {}

__[DRAWER_NAGIVATION_TOGGLE] = state => {
  state.drawerNavigationToggle = !state.drawerNavigationToggle
}

__[CURRENT_LANGUAGES] = (state, languages = []) => {
  state.currentLanguages = languages
}

__[CURRENT_SERVICE_SOURCE] = (state, {
  id, name, icon,
  languages
}) => {
  // console.log(id, name, icon, languages)
  state.currentSource = { id, name, icon, languages }
}

__[NEXT_SERVICE_SOURCE] = (state) => {
  const IDs = Object.keys(state.api)

  let nextIndex = IDs.indexOf(state.currentSource.id) + 1
  if (nextIndex === IDs.length) nextIndex = 0

  state.currentSource = Object.values(state.api)[nextIndex]
}

export default __
