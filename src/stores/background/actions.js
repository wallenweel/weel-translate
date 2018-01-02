import merge from 'deepmerge'
import { storage, tabs, management, env } from '@/globals'
import { istype } from '@/functions/utils'
import {
  INITIAL_STORAGE_FROM_DEFAULT,
  INITIAL_BACKGROUND_SCRIPT,
  STORAGE_TYPE_SET,
  INITIAL_FROM_BACKGROUND,
  UPDATE_STORAGE_STATE,
  REQUEST_TRANSLATION,
  REQUEST_VOICE,
  RESET_LOCAL_STORAGE,
  TAB_LOADED_COMPLETE,
  UNINSTALL_EXTENSION
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

__[INITIAL_BACKGROUND_SCRIPT] = async ({ state, getters, commit, dispatch }, skipMerge = false) => {
  if (!skipMerge) {
    for (const type of Object.keys(state.storage)) {
      await storage[type].get().then(all => {
        // merge sync storage to state
        if (env.production) commit('mergeStorageState', all)

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

    // TODO: should remove the api state
    // state.api = state.sources.visible
    // .reduce((o, id) => {
    //   o[id] = state.sources.compiled[id]
    //   return o
    // }, {})

    const [id, ids] = [
      state['current_service_id'],
      state.sources.visible
    ]

    if (!id || !ids.includes(id)) state['current_service_id'] = ids[0]

    if (istype(getters.currentSource.fromto, 'array')) {
      state.src_dest = getters.currentSource.fromto
    } else {
      const code = getters.currentSource.languages[0]

      state.src_dest = [code, code]
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
  { emit, payload = { q: 'hello', from: 'AUTO', to: 'AUTO' } }
) => {
  const { query, parser, response = {} } = api[current_service_id]
  const queryText = query.text(payload)

  let [url, request] = [queryText, { mode: 'no-cors' }]

  if (istype(queryText, 'array')) {
    url = queryText[0]
    request = Object.assign(request, queryText[1])
    // console.log(url, decodeURI(request.body.toString()))
  }

  await fetch(url, request)
  .then(res => {
    return res[response.type || 'json']()
  })
  .then(data => {
    // console.log(data)
    // console.log(parser(data))
    emit && emit(parser(data))
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

__[UNINSTALL_EXTENSION] = ({ state }, { emit }) => {
  management.uninstallSelf({
    showConfirmDialog: true,
    dialogMessage: 'uninstalling extension'
  }).then(null, () => {
    emit(false)
  })
}

__[TAB_LOADED_COMPLETE] = ({ state, commit }, { emit }) => {
  const { templates, current_template_id } = state
  const style = templates.compiled[current_template_id].style

  tabs.insertCSS({
    code: style,
    allFrames: true,
    matchAboutBlank: true,
    runAt: 'document_idle'
  })
}

export default __
