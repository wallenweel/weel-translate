import { sendMessage } from '@/functions/runtime'
import {
  INITIAL_FROM_BACKGROUND,
  TAB_LOADED_COMPLETE
} from '@/types'

const __ = {}

__[INITIAL_FROM_BACKGROUND] = ({ state, dispatch }) => {
  return sendMessage(INITIAL_FROM_BACKGROUND)
  .then(({
    templates,
    preferences,
    current_template_id
  }) => {
    state = Object.assign(state, {
      templates,
      preferences,
      current_template_id
    })

    dispatch(TAB_LOADED_COMPLETE)

    return true
  }, () => false)
}

__[TAB_LOADED_COMPLETE] = ({ commit }) => {
  sendMessage(TAB_LOADED_COMPLETE)
}

export default __
