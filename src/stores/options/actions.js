import merge from 'deepmerge'
import { istype } from '@/functions/utils'
import { sendMessage } from '@/functions/runtime'
import {
  INITIAL_FROM_BACKGROUND,
  UPDATE_STORAGE_STATE,
  SAVE_CUSTOM_SOURCES_PRESET,
  REQUEST_TRANSLATION,
  FETCH_REQUEST,
  REQUEST_VOICE
} from '@/types'

const __ = {}

__[INITIAL_FROM_BACKGROUND] = async ({ state, dispatch, commit }) => {
  let success = false

  await sendMessage({
    type: INITIAL_FROM_BACKGROUND
  }).then(({
    // storage,
    sources,
    templates,
    preferences
  }) => {
    state = Object.assign(state, {
      // storage,
      sources,
      templates,
      preferences
    })

    state.tmp.sources = merge(state.tmp.sources, sources)
    state.tmp.templates = merge(state.tmp.templates, templates)

    commit('compileTmpPreset')
    commit('initialTmpSource')

    // state.api = state.tmp.sources.compiled

    success = true
  }, error => {
    success = false

    console.error(
      `Options Page Dose Not Initial Success, Because:`,
      error
    )
  })

  // commit('compileCurrentCodes', ['sources', { id: 'google_cn', content: state.tmp.sources.preset['google_cn'] }])
  // dispatch(REQUEST_TRANSLATION)

  return success
}

__[UPDATE_STORAGE_STATE] = ({ state }, { type, key }) => {
  sendMessage({
    type: UPDATE_STORAGE_STATE,
    payload: {
      type,
      key,
      value: state[key]
    }
  }).then(over => {
    // TODO: update storage over
    // do something here, maybe an alert
  })
}

__[SAVE_CUSTOM_SOURCES_PRESET] = ({ state, commit }) => {
  commit('saveCurrentPreset', ['sources'])

  sendMessage({
    type: SAVE_CUSTOM_SOURCES_PRESET,
    payload: state.sources.preset
  })
  .then(success => {
    if (!success) {
      state.tmp['sources'].alert = [true, 'Save Presets Failed.']
      return false
    }

    state.tmp['sources'].alert = [true, 'All Presets Have Been Saved.']
  })
}

__[REQUEST_TRANSLATION] = ({ state: { tmp }, commit }, payload = {}) => {
  const { q = 'test', from = 'en', to = 'zh-cn' } = payload
  const { query, parser } = tmp.sources.current_api

  const queryText = query.text({ q, from, to })

  let [url, request] = [queryText, { mode: 'no-cors' }]
  if (istype(queryText, 'array')) {
    url = queryText[0]
    request = Object.assign(request, queryText[1])
  }

  tmp.sources['query_detail'] = url

  return sendMessage({
    type: FETCH_REQUEST,
    payload: {
      url,
      request,
      dataType: 'text'
    }
  })
  .then(data => {
    let json = null
    try {
      json = JSON.parse(data)
    } catch (error) {
      json = false
    }

    if (!json) return false

    tmp.sources['current_response'] = JSON.parse(data)
    tmp.sources['current_result'] = parser(tmp.sources['current_response'])

    return true
  })
}

__[REQUEST_VOICE] = (
  { state: { tmp }, getters },
  { q, from, id }
) => {
  const url = tmp.sources.current_api.query.audio({ q, from })

  sendMessage({
    type: REQUEST_VOICE,
    payload: { url }
  })
}

export default __
