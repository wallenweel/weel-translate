import merge from 'deepmerge'
import { tabs } from '@/globals'
import { jpjs } from '@/functions/utils'
import { sendMessage } from '@/functions/runtime'
import { getMessage as i } from '@/functions/i18n'
import {
  INITIAL_FROM_BACKGROUND,
  UPDATE_STORAGE_STATE,
  REQUEST_TRANSLATION,
  REQUEST_VOICE,
  RESET_LOCAL_STORAGE,
  UNINSTALL_EXTENSION
} from '@/types'

const __ = {}

__[INITIAL_FROM_BACKGROUND] = ({ state, commit, dispatch }) => {
  return sendMessage({
    type: INITIAL_FROM_BACKGROUND
  }).then(({
    test,
    // storage,
    keep_all,
    current_service_id,
    src_dest,
    result,
    input_text,
    translation_history,
    translation_collection,
    settings,
    preferences,
    sources,
    templates
  }) => {
    state = Object.assign(state, {
      test,
      // storage,
      keep_all,
      current_service_id,
      src_dest,
      // result,
      // input_text,
      translation_history,
      translation_collection,
      settings,
      preferences,
      sources,
      templates
    })

    if (state['keep_all']) {
      state.storage = merge(state.storage, state.storageKeep)
      state = Object.assign(state, { result, input_text })
    }

    if (
      settings['browser_action_translate'] ||
      (settings['use_context_menu'] && settings['context_menu_way'] === 'popup')
    ) {
      tabs.query({
        currentWindow: true,
        active: true,
        status: 'complete'
      }).then(([{ id }]) => {
        tabs.executeScript({
          code: 'window.getSelection().toString().trim();'
        }, ([text]) => {
          if (!text) return false

          state['input_text'] = text

          dispatch(REQUEST_TRANSLATION, { q: text })
        })
      })
    }

    state.tmp.history = jpjs(translation_history)
    state.tmp.collection = jpjs(translation_collection)

    return true
  }, () => false)
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

__[REQUEST_TRANSLATION] = ({ state, commit, getters }, { q, from, to }) => {
  const { tmp, maxHistory, current_service_id } = state

  if (state['keep_all']) state['input_text'] = q

  if (tmp.history.length >= maxHistory) {
    tmp.history.pop()
  }

  tmp.history.unshift({
    meta: { q, from, to },
    source: {
      id: current_service_id,
      name: getters.currentSource.name
    }
  })

  return sendMessage({
    payload: { q, from, to },
    type: REQUEST_TRANSLATION
  }).then(result => {
    if (result === 'timeout') {
      commit('globalTip', [true, i('TIMEOUT')])
      return true
    }

    if (!result) {
      commit('globalTip', [true, i('TRANSLATING_FAILED_TIP')])
      return true
    }

    state.result = result

    // increase translating history
    state['translation_history'] = jpjs(tmp.history)

    // reset result star status
    state.currentCollected = false

    return true
  })
}

__[REQUEST_VOICE] = ({ state, commit }, { q, from }) => {
  sendMessage({
    payload: { q, from, id: state.current_service_id },
    type: REQUEST_VOICE
  }).then(status => {
    if (!status) {
      commit('globalTip', [true, i('VOICE_FAILED_TIP')])
    }
  })
}

__[RESET_LOCAL_STORAGE] = ({ state, dispatch, commit }) => {
  sendMessage({
    type: RESET_LOCAL_STORAGE
  }).then(status => {
    if (status === true) {
      // rebuild this page's state
      // dispatch(INITIAL_FROM_BACKGROUND)
      window.location.reload()

      // commit('globalTip', [true, i('RESET_SUCCESS_TIP')])
    } else {
      commit('globalTip', [true, i('RESET_FAIL_TIP')])
    }
  })
}

__[UNINSTALL_EXTENSION] = ({ commit }) => {
  sendMessage(UNINSTALL_EXTENSION)
  .then(status => {
    if (status === false) {
      commit('globalTip', [true, i('UNINSTALL_CANCEL_TIP')])
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

__['nextServiceSource'] = ({ state, getters }) => {
  const ids = state.sources.visible

  let nextIndex = ids.indexOf(state['current_service_id']) + 1
  if (nextIndex === ids.length) nextIndex = 0

  state['current_service_id'] = ids[nextIndex]

  const source = getters.currentSource
  const code = source.languages[0].code

  // clear result panel
  state.result = {}

  state['src_dest'] = source.fromto || [code, code]
}

export default __
