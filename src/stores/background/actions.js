// import merge from 'deepmerge'
import { storage, tabs, management, menus, env } from '@/globals'
import { clog, jpjs, istype, fetch2 as fetch } from '@/functions/utils'
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
  UNINSTALL_EXTENSION,
  CREATE_CONTEXT_MENU,
  REMOVE_CONTEXT_MENU,
  CONTEXT_MENU_ACTION_TRANSLATE,
  SAVE_CUSTOM_SOURCES_PRESET,
  SAVE_CUSTOM_TEMPLATES_PRESET,
  FETCH_REQUEST
} from '@/types'
import originalState from './state'

const initialState = jpjs(originalState)

const __ = {}

__[INITIAL_STORAGE_FROM_DEFAULT] = async ({ state }) => {
  // get value in 'state.a.b.c'
  // const value = (k, s) => k.split('.').reduce((p, c) => p[c], s)
  // generate storage type data
  // const helper = (k, v) => k.split('.').reduceRight((p, c) => ({[c]: p}), v)

  for (const [type, states] of Object.entries(state.storage)) {
    const config = states.reduce((p, k) => {
      // if (/\./.test(k)) p = Object.assign(p, helper(k, value(k, state)))
      // else p[k] = state[k]

      // return merge({}, p)
      p[k] = jpjs(state[k])
      return p
    }, {})

    await storage[type].set(config)
    .then(() => {
      if (env.production) return true

      storage[type].get().then(all =>
        clog(INITIAL_STORAGE_FROM_DEFAULT, `storage.${type}.set success\n`, all)
      )
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

    const [src, dest] = state.src_dest

    if (!src && !dest) {
      if (istype(getters.currentSource.fromto, 'array')) {
        state.src_dest = jpjs(getters.currentSource.fromto)
      } else {
        const code = getters.currentSource.languages[0].code

        state.src_dest = [code, code]
      }
    }

    // TODO: here may occur an unexpected error after "RESET_LOCAL_STORAGE"
    if (state.settings.use_context_menu) dispatch(CREATE_CONTEXT_MENU)

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

  const _value = jpjs(value)
  if (Object.keys(_value).includes('compiled')) {
    delete _value.compiled
  }

  // storage[sync|local]
  await storage[type].set(jpjs(helper(key, _value))).then(
    () => {
      // update "state"
      // TODO: need to support dot in keys such as 'sources.visible'
      state[key] = typeof _value !== 'object' ? _value : Object.assign(state[key], _value)

      if (env.production) return true

      storage[type].get().then(all =>
        clog(STORAGE_TYPE_SET, ` storage.${type}.set success\n`, all))
    },
    error => clog(`storage.${type}.set fail\n`, error)
  )
}

// feedback all of "state"
__[INITIAL_FROM_BACKGROUND] = ({ state }, { emit }) => emit(jpjs(state))

__[UPDATE_STORAGE_STATE] = async (
  { state, commit, dispatch },
  { emit, payload: {type, key, value} }
) => {
  await dispatch(STORAGE_TYPE_SET, { type, key, value })

  emit(true) // feedback status
}

__[SAVE_CUSTOM_SOURCES_PRESET] = async (
  { state, commit, dispatch },
  { emit, payload }
) => {
  const _sources = Object.assign(
    jpjs(state.sources),
    {
      visible: Object.keys(payload),
      preset: payload
    }
  )

  await dispatch(STORAGE_TYPE_SET, {
    type: 'local',
    key: 'sources',
    value: _sources
  })

  // state.sources.preset = payload
  // state.sources.visible = Object.keys(payload)
  state.sources.visible = _sources.visible
  state.sources.preset = _sources.preset

  commit('compileSourcesPreset')

  emit(true)
}

__[SAVE_CUSTOM_TEMPLATES_PRESET] = async (
  { state, commit, dispatch },
  { emit, payload }
) => {
  await dispatch(STORAGE_TYPE_SET, {
    type: 'local',
    key: 'templates',
    value: {
      preset: payload
    }
  })

  state.templates.preset = payload

  commit('compileTemplatesPreset')

  emit(true)
}

__[CREATE_CONTEXT_MENU] = ({ state }) => {
  const options = {
    id: CONTEXT_MENU_ACTION_TRANSLATE,
    title: 'Weel Translate It',
    contexts: ['all']
  }

  if (state.settings.context_menu_way === 'popup') {
    options.command = '_execute_browser_action'
  } else if (state.settings.context_menu_way === 'float') {
    state.menusListener = (menuInfo) => {
      const { menuItemId } = menuInfo

      if (menuItemId !== CONTEXT_MENU_ACTION_TRANSLATE) return true

      tabs.query({
        currentWindow: true,
        active: true,
        status: 'complete'
      }).then(([{ id }]) => {
        tabs.sendMessage(id, {
          type: CONTEXT_MENU_ACTION_TRANSLATE
        })
      })
    }

    menus.onClicked.addListener(state.menusListener)
  }

  menus.create(options, (a) => {
  })
}

__[REMOVE_CONTEXT_MENU] = ({ state }) => {
  menus.remove(CONTEXT_MENU_ACTION_TRANSLATE)
  .then(() => {
    if (menus.onClicked.hasListener(state.menusListener)) {
      menus.onClicked.removeListener(state.menusListener)
    }
  })
}

__[FETCH_REQUEST] = async ({ state }, { emit, parser, payload = {} }) => {
  const { url, request, dataType = 'json' } = payload

  try {
    await fetch(url, request)
    .then(res => {
      return res[dataType]()
    })
    .then(data => {
      if (typeof data === 'string') {
        emit(data)
      } else if (typeof data === 'object') {
        emit(parser(data))
      }
      return true
    })
  } catch (error) {
    emit('timeout')
  }
}

// TODO: complete this
__[REQUEST_TRANSLATION] = async (
  { state, getters },
  { emit, payload = {} }
) => {
  const {
    q,
    from = state.src_dest[0],
    to = state.src_dest[1]
  } = payload

  if (!q) return emit && emit(false)

  const { query, parser, response = {} } = getters.currentSource
  const queryText = query.text({ q, from, to })

  let [url, request] = [queryText, { mode: 'no-cors' }]

  if (istype(queryText, 'array')) {
    url = queryText[0]
    request = Object.assign(request, queryText[1])
    // console.log(url, decodeURI(request.body.toString()))
  }

  try {
    // request.timeout = 20
    await fetch(url, request)
    .then(res => {
      return res[response.type || 'json']()
    })
    .then(data => {
      // console.log(data)
      // console.log(parser(data))
      if (typeof data === 'string') {
        emit(data)
      } else if (typeof data === 'object') {
        emit(parser(data))
      }

      return true
    })
  } catch (err) {
    emit('timeout')
  }
}

__[REQUEST_VOICE] = (
  { state, getters },
  { emit, payload: {
    q,
    from,
    id,
    url
  } }
) => {
  const _url = url || getters.currentSource.query.audio({ q, from })
  const audio = new Audio()

  audio.src = _url
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
      await dispatch(INITIAL_BACKGROUND_SCRIPT, true)

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
