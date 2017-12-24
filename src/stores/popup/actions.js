import merge from 'deepmerge'
import { sendMessage } from '@/functions/runtime'
import {
  INITIAL_FROM_BACKGROUND,
  UPDATE_STORAGE_STATE,
  REQUEST_TRANSLATION,
  REQUEST_VOICE,
  RESET_LOCAL_STORAGE
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
    translation_history,
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
      translation_history,
      settings,
      preferences,
      sources,
      templates
    })

    if (state.keep_all) {
      state.storage = merge(state.storage, state.storageKeep)
      state = Object.assign(state, { result, input_text })
    }

    state.tmp.history = merge([], translation_history)

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

__[UPDATE_STORAGE_STATE] = ({ state }, { type, key, value }) => {
  sendMessage({
    type: UPDATE_STORAGE_STATE,
    payload: {
      type,
      key,
      value: value || state[key]
    }
  }).then(over => {
    // TODO: update storage over
    // do something here, maybe an alert
  })
}

__[REQUEST_TRANSLATION] = ({ state }, { q, from, to }) => {
  const { tmp, currentSource, maxHistory, current_service_id } = state

  if (state.keep_all) state.input_text = q

  if (tmp.history.length >= maxHistory) {
    tmp.history.pop()
  }

  // const {}
  tmp.history.unshift({
    meta: { q, from, to },
    source: {
      id: current_service_id,
      name: currentSource.name
    }
  })

  sendMessage({
    payload: { q, from, to },
    type: REQUEST_TRANSLATION
  }).then(result => {
    state.result = result
    state.translation_history = tmp.history
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

__[RESET_LOCAL_STORAGE] = ({ state, dispatch, commit }) => {
  sendMessage({
    type: RESET_LOCAL_STORAGE
  }).then(status => {
    if (status === true) {
      // rebuild this page's state
      dispatch(INITIAL_FROM_BACKGROUND)

      commit('globalTip', [true, 'Reset Extension Successed.'])
    } else {
      commit('globalTip', [true, 'Reset Extension Failed.'])
    }
  })
}

__['keepAllTranslation'] = ({ state, dispatch }, { status }) => {
  state.keep_all = status

  if (status === true) {
    dispatch(UPDATE_STORAGE_STATE, { type: 'local', key: 'input_text', value: state.tmp.input_text })
    dispatch(UPDATE_STORAGE_STATE, { type: 'local', key: 'result' })
  }
  // TODO: if turn off keepAll, should clear
  // relatived data in storage
}

export default __
