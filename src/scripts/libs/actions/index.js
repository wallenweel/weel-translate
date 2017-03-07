import * as types from './types'

export const do_translate = (payload = {}) => {
  return {
    type: TRANSLATE,
    payload,
  }
}
