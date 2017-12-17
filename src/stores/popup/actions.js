import { sendMessage } from '@/functions/runtime'
import {
  GET_LANGUAGE_LIST,
  CURRENT_LANGUAGES,
  POPUP_PAGE_INITIAL,
  CURRENT_SERVICE_SOURCE
} from '@/types'

const __ = {}

__[POPUP_PAGE_INITIAL] = async ({ state, commit }) => {
  let success = false

  await sendMessage({
    type: POPUP_PAGE_INITIAL
  }).then(({
    api,
    current_service_id
  }) => {
    console.log(current_service_id)

    state.api = api

    commit(CURRENT_LANGUAGES, api[current_service_id].languages)
    commit(CURRENT_SERVICE_SOURCE, api[current_service_id])

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

__[GET_LANGUAGE_LIST] = ({ commit }, payload = { id: '' }) => {
  sendMessage({
    type: GET_LANGUAGE_LIST,
    payload
  }).then(list => {
    // console.log('list', list)
    commit(CURRENT_LANGUAGES, list)
  })
}

export default __
