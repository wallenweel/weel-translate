import merge from 'deepmerge'
import { storage } from '@/globals'
import {
  BACKGROUND_INITIALIZE,
  STORAGE_TYPE_SET,
  POPUP_PAGE_INITIAL,
  UPDATE_STORAGE_STATE
} from '@/types'

const __ = {}

__[BACKGROUND_INITIALIZE] = async ({ state, commit }) => {
  for (const [type, states] of Object.entries(state.storage)) {
    await storage[type].get(states).then(all => {
      // merge sync storage to state
      commit('mergeStorageState', all)

      state.initialized = true
    }, () => { state.initialized = false })
  }

  if (state.initialized === true) {
    // compile service "source.preset" to "api"
    commit('compileSourceAPI')

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

__[POPUP_PAGE_INITIAL] = ({ state }, { payload, emit }) => {
  emit(merge({}, state))
}

__[UPDATE_STORAGE_STATE] = ({ state, commit }, { emit, payload: {type, key, value} }) => {
  console.log(type, key, value)
  state[key] = value
  commit('emitMessage', { emit, message: 'hahaha' })
  // emit('success')
}

export default __
