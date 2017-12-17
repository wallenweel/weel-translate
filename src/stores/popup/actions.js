import { sendMessage } from '@/functions/runtime'
import {
  POPUP_PAGE_INITIAL,
  UPDATE_STORAGE_STATE
} from '@/types'

const __ = {}

__[POPUP_PAGE_INITIAL] = async ({ state, commit }) => {
  let success = false

  await sendMessage({
    type: POPUP_PAGE_INITIAL
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
  // console.log('state', state)
  sendMessage({
    type: UPDATE_STORAGE_STATE,
    payload: {
      type,
      key,
      value: state[key]
    }
  }).then(success => {
    console.log(success)
  })
}

export default __
