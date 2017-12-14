import { sendMessage } from '@/functions/runtime'
import {
  SERVICE_LANGUAGE_LIST
} from '@/actions/types'

export const languageListGet = ({ commit }, payload = []) => {
  sendMessage({
    type: SERVICE_LANGUAGE_LIST,
    payload
  }).then(list => {
    // console.log(res)
    commit('currentLanguages', list)
  })
}
