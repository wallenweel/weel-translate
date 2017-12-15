import { sendMessage } from '@/functions/runtime'
import {
  SERVICE_LANGUAGE_LIST
} from '@/types'

export const languageListGet = ({ commit }, payload = []) => {
  sendMessage({
    type: SERVICE_LANGUAGE_LIST,
    payload
  }).then(list => {
    commit('currentLanguages', list)
  })
}
