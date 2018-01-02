import { sendMessage } from '@/functions/runtime'
import {
  INITIAL_FROM_BACKGROUND,
  TAB_LOADED_COMPLETE,
  REQUEST_TRANSLATION,
  REQUEST_VOICE,
  CONTEXT_MENU_ACTION_TRANSLATE
} from '@/types'

const __ = {}

__[INITIAL_FROM_BACKGROUND] = ({ state, dispatch }) => {
  return sendMessage(INITIAL_FROM_BACKGROUND)
  .then(({
    result,
    templates,
    preferences,
    settings,
    src_dest,
    current_service_id,
    current_template_id
  }) => {
    state = Object.assign(state, {
      result,
      templates,
      preferences,
      settings,
      src_dest,
      current_service_id,
      current_template_id
    })

    dispatch(TAB_LOADED_COMPLETE)

    return true
  }, () => false)
}

__[TAB_LOADED_COMPLETE] = ({ commit }) => {
  sendMessage(TAB_LOADED_COMPLETE)
}

__[REQUEST_TRANSLATION] = (
  { state },
  { q, from = state.src_dest[0], to = state.src_dest[1] }
) => {
  return sendMessage({
    payload: { q, from, to },
    type: REQUEST_TRANSLATION
  }).then(result => {
    return (state.result = result)
  })
}

__[REQUEST_VOICE] = ({ state }, { q, from }) => {
  sendMessage({
    payload: { q, from, id: state.current_service_id },
    type: REQUEST_VOICE
  }).then(s => {
    console.log(s)
  })
}

__[CONTEXT_MENU_ACTION_TRANSLATE] = async ({ state, commit, dispatch }) => {
  await dispatch(REQUEST_TRANSLATION, { q: state.selectionText })

  commit('fapToggle', true)
}

export default __
