import merge from 'deepmerge'
import { storage } from '@/globals'
import {
  INITIAL_STORAGE_FROM_DEFAULT,
  INITIAL_BACKGROUND_SCRIPT,
  STORAGE_TYPE_SET,
  INITIAL_FROM_BACKGROUND,
  UPDATE_STORAGE_STATE,
  REQUEST_TRANSLATION,
  REQUEST_VOICE,
  RESET_LOCAL_STORAGE
} from '@/types'
import originalState from './state'

const initialState = merge({}, originalState)

const __ = {}

__[INITIAL_STORAGE_FROM_DEFAULT] = async ({ state }) => {
  // get value in 'state.a.b.c'
  const value = (k, s) => k.split('.').reduce((p, c) => p[c], s)
  // generate storage type data
  const helper = (k, v) => k.split('.').reduceRight((p, c) => ({[c]: p}), v)

  for (const [type, states] of Object.entries(state.storage)) {
    const config = states.reduce((p, c) => {
      if (/\./.test(c)) p = Object.assign(p, helper(c, value(c, state)))
      else p[c] = state[c]

      return merge({}, p)
    }, {})

    await storage[type].set(config)
    .then(() => {
      storage[type].get().then(all =>
        console.log(`storage.${type}.set success\n`, all))
    })
  }
}

__[INITIAL_BACKGROUND_SCRIPT] = async ({ state, commit, dispatch }, skipMerge = false) => {
  if (!skipMerge) {
    for (const type of Object.keys(state.storage)) {
      await storage[type].get().then(all => {
        // merge sync storage to state
        // commit('mergeStorageState', all)

        state.initialized = true
      }, () => { state.initialized = false })
    }
  } else {
    state.initialized = true
  }

  if (state.initialized === true) {
    // compile service preset from "sources.preset" to "sources.compiled"
    commit('compileSourcesPreset')
    // compile from "templates.preset" to "templates.compiled"
    // `preset` to { parser, template, style }
    commit('compileTemplatesPreset')

    // TODO: should make api to current api, not "apis"
    state.api = state.sources.compiled

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
  // ('a.b.c', v) => {a: {b: {c: v}}}
  const helper = (k, v) => k.split('.').reduceRight((p, c) => ({[c]: p}), v)

  // storage[sync|local]
  await storage[type].set(merge({}, helper(key, value))).then(
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

__[REQUEST_VOICE] = ({ state: { api } }, { emit, payload: { q, from, id } }) => {
  const url = api[id].query.audio({ q, from })
  const audio = new Audio()

  audio.src = url
  audio.play()
  .then(() => true, () => false)
  .then(status => emit(status))
}

__[RESET_LOCAL_STORAGE] = async ({ state, dispatch }, { emit }) => {
  await storage.local.clear()
  .then(
    async () => {
      // reset state
      state = Object.assign(state, initialState)

      // rebuild local storage
      await dispatch(INITIAL_STORAGE_FROM_DEFAULT)
      // rebuild background's state
      await dispatch(INITIAL_BACKGROUND_SCRIPT)

      // window.location.reload()
      emit(true)
    },
    () => emit(false)
  )
}

export default __
