import { jpjs, istype } from '@/functions/utils'

export const globalTip = (state, [open, msg]) => {
  state.globalTip = [open, msg]
}

export const drawerNavigationToggle = state => {
  state.drawerNavigationToggle = !state.drawerNavigationToggle
}

export const swapLanguages = state => {
  const [src, dest] = state['src_dest']

  state['src_dest'] = [dest, src]
}

export const sourcesVisibleChanges = (state, ids) => {
  state.sources.visible = ids
}

export const settingChanges = (state, [key, value]) => {
  state.settings[key] = value
}

export const preferenceChanges = (state, [key, value]) => {
  state.preferences[key] = value
}

export const languageChanges = (state, langs) => {
  state.src_dest = langs
}

export const removeHistory = (state, index) => {
  state.tmp.history.splice(index, 1)
  state.translation_history = jpjs(state.tmp.history)
}

export const clearHistory = (state) => {
  state.tmp.history = []
  state.translation_history = jpjs(state.tmp.history)
}

export const addCollection = (state, { q, from, to, name, id, result: { translation } }) => {
  state.translation_collection.unshift({
    meta: { q, from, to },
    source: { name, id },
    result: {
      translation: istype(translation, 'array') ? translation.join(' ') : translation
    }
  })
  state.currentCollected = true
}

export const removeCollection = (state, index) => {
  if (index === -1) {
    state.currentCollected = false
    state.translation_collection.splice(0, 1)
    return false
  }

  if (index === 0 && state.currentCollected) {
    state.currentCollected = false
  }

  state.translation_collection.splice(index, 1)
}

export const updateTmpState = (state, [key, value]) => {
  state.tmp[key] = value
}
