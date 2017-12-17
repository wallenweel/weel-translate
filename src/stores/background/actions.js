import merge from 'deepmerge'
import { storage } from '@/globals'
import {
  BACKGROUND_INITIALIZE,
  MERGE_STORAGE_STATE,
  GET_LANGUAGE_LIST,
  STORAGE_TYPE_SET,
  POPUP_PAGE_INITIAL,
  COMPILE_SERVICE_SOURCES
} from '@/types'

const __ = {}

__[BACKGROUND_INITIALIZE] = async ({ state, commit }) => {
  for (const [type, states] of Object.entries(state.storage)) {
    await storage[type].get(states).then(all => {
      // merge sync storage to state
      commit(MERGE_STORAGE_STATE, all)

      state.initialized = true
    }, () => { state.initialized = false })
  }

  if (state.initialized === true) {
    // compile service "source.preset" to "api"
    commit(COMPILE_SERVICE_SOURCES)

    const [id, ids] = [
      state['current_service_id'],
      Object.keys(state.api)
    ]

    if (!id || !ids.includes(id)) {
      state['current_service_id'] = ids[0]
    }

    return true
  }

  return false
}

__[STORAGE_TYPE_SET] = ({ state }, { type, key }) => {
  const value = state[key]

  // storage[sync|local]
  storage[type].set({
    [key]: typeof value === 'object' ? merge({}, value) : value
  }).then(
    // TODO: remove here
    () => {
      storage[type].get().then(all =>
        console.log(`storage.${type}.set success\n`, all))
    },
    error => {
      console.log(`storage.${type}.set fail\n`, error)
    }
  )
}

__[GET_LANGUAGE_LIST] = ({ state }, { payload: { id }, emit }) => {
  const api = state.api[id] || Object.values(state.api)[0]

  if (!api) {
    // TODO: add alert
    console.log('Must Supply One API Preset At Least!')
    return
  }

  emit(merge([], api.languages))
}

__[POPUP_PAGE_INITIAL] = ({ state }, { payload, emit }) => {
  emit(merge({}, state))
}

export default __
