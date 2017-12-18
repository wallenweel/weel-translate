import { sendMessage } from '@/functions/runtime'
import {
  INITIAL_POPUP_SCRIPT,
  UPDATE_STORAGE_STATE,
  REQUEST_TRANSLATION
} from '@/types'

const __ = {}

__[INITIAL_POPUP_SCRIPT] = async ({ state, commit }) => {
  let success = false

  await sendMessage({
    type: INITIAL_POPUP_SCRIPT
  }).then(({
    api,
    storage,
    current_service_id
  }) => {
    state.api = api
    state.storage = storage

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
  sendMessage({
    payload: { q, from, to },
    type: REQUEST_TRANSLATION
  }).then(result => {
    console.log(result)
    state.result = result
    state.result.over = true
  })

  state.result.over = true
}

export default __
