import { sendMessage } from '@/functions/runtime'
import {
  GET_LANGUAGE_LIST,
  CURRENT_LANGUAGES
} from '@/types'

const __ = {}

__[GET_LANGUAGE_LIST] = ({ commit }, payload = []) => {
  sendMessage({
    type: GET_LANGUAGE_LIST,
    payload
  }).then(list => {
    console.log('list', list)
    commit(CURRENT_LANGUAGES, list)
  })
}

export default __
