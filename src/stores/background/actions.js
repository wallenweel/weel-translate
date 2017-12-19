import merge from 'deepmerge'
import { storage } from '@/globals'
import {
  INITIAL_BACKGROUND_SCRIPT,
  STORAGE_TYPE_SET,
  INITIAL_FROM_BACKGROUND,
  UPDATE_STORAGE_STATE,
  REQUEST_TRANSLATION
} from '@/types'

const __ = {}

__[INITIAL_BACKGROUND_SCRIPT] = async ({ state, commit }) => {
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

__[STORAGE_TYPE_SET] = async (
  { state },
  { type, key, value = state[key] }
) => {
  // storage[sync|local]
  await storage[type].set({
    [key]: typeof value === 'object' ? merge({}, value) : value
  }).then(
    () => {
      // update "state"
      state[key] = value

      storage[type].get().then(all =>
        console.log(`storage.${type}.set success\n`, all))
    },
    error => console.log(`storage.${type}.set fail\n`, error)
  )
}

// feedback all of "state"
__[INITIAL_FROM_BACKGROUND] = ({ state }, { emit }) => emit(merge({}, state))

__[UPDATE_STORAGE_STATE] = async (
  { state, commit, dispatch },
  { emit, payload: {type, key, value} }
) => {
  await dispatch(STORAGE_TYPE_SET, { type, key, value })

  emit(true) // feedback status
}

// TODO: complete this
__[REQUEST_TRANSLATION] = async (
  { state: { api, current_service_id } },
  { emit = () => {}, payload = { q: 'hello', from: 'en', to: 'zh-cn' } }
) => {
  const { query, parser } = api[current_service_id]

  await fetch(query.text(payload), { mode: 'no-cors' })
  .then(res => {
    return res.json()
  })
  .then(data => {
    // console.log(data)
    // console.log(parser(data))
    emit(parser(data))
  })
}

export default __
