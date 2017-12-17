import { sendMessage } from '@/functions/runtime'
import {
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

export default __
