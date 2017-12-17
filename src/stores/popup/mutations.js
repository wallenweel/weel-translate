import {
  CURRENT_LANGUAGES,
  DRAWER_NAGIVATION_TOGGLE
} from '@/types'

const __ = {}

__[DRAWER_NAGIVATION_TOGGLE] = state => {
  state.drawerNavigationToggle = !state.drawerNavigationToggle
}

__[CURRENT_LANGUAGES] = (state, languages = []) => {
  state.currentLanguages = languages
}

export default __
