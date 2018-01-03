import merge from 'deepmerge'
import { sendMessage } from '@/functions/runtime'
import {
  INITIAL_FROM_BACKGROUND,
  UPDATE_STORAGE_STATE,
  SAVE_CUSTOM_SOURCES_PRESET,
  REQUEST_TRANSLATION
} from '@/types'
import * as mocks from '@/api/mocks'

const __ = {}

__[INITIAL_FROM_BACKGROUND] = async ({ state, commit }) => {
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

__[REQUEST_TRANSLATION] = ({ state: { tmp }, commit }, { q, from, to }) => {
  const text = tmp.sources.current_api.query.text({ q: 'egg', from: 'en', to: 'zh-cn' })

  tmp.sources.query_detail = text

  fetch(text, {
    mode: 'no-cors'
  })
  .then(res => {
    if (res.ok) {
      return res.json()
    } else {
      return JSON.parse(mocks.response)
    }
  })
  .then(data => {
    // console.log(data)
    // console.log(JSON.parse(data))
    commit('tmpResponse', data)
  })
}

export default __
