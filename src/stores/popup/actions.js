import merge from 'deepmerge'
import { sendMessage } from '@/functions/runtime'
import {
  INITIAL_FROM_BACKGROUND,
  UPDATE_STORAGE_STATE,
  REQUEST_TRANSLATION,
  REQUEST_VOICE
} from '@/types'

const __ = {}

__[INITIAL_FROM_BACKGROUND] = async ({ state, commit }) => {
  let success = false

  await sendMessage({
    type: INITIAL_FROM_BACKGROUND
  }).then(({
    test,
    api,
    // storage,
    keep_all,
    current_service_id,
    src_dest,
    result,
    input_text,
    settings,
    preferences,
    sources,
    templates
  }) => {
    state = Object.assign(state, {
      test,
      api,
      // storage,
      keep_all,
      current_service_id,
      src_dest,
      // result,
      // input_text,
      settings,
      preferences,
      sources,
      templates
    })

    if (state.keep_all) {
      state.storage = merge(state.storage, state.storageKeep)
      state = Object.assign(state, { result, input_text })
    }

    commit('currentServiceSource', api[current_service_id])

    success = true
  }, error => {
    success = false

    console.error(
      `Popup Page Dose Not Initial Success, Because:`,
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

__[REQUEST_TRANSLATION] = ({ state }, { q, from, to }) => {
  if (state.keep_all) state.input_text = q

  sendMessage({
    payload: { q, from, to },
    type: REQUEST_TRANSLATION
  }).then(result => {
    state.result = result
  })
}

__[REQUEST_VOICE] = ({ state, commit }, { q, from }) => {
  sendMessage({
    payload: { q, from, id: state.current_service_id },
    type: REQUEST_VOICE
  }).then(status => {
    if (!status) {
      commit('globalTip', [true, 'Get this voice failed.'])
    }
  })
}

__['keepAllTranslation'] = ({ state, dispatch }, { status }) => {
  state.keep_all = status

  // TODO: if turn off keepAll, should clear
  // relatived data in storage
}

export default __
