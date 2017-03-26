import {
  REQUEST_TRANSLATING,
  RESPOND_TRANSLATING,
} from './types'

export const translate_from = (from = '', payload = {}, meta = {}) => ({
  type: REQUEST_TRANSLATING,
  meta: {
    from,
    ...meta,
  },
  payload: {
    ...payload,
  },
})

export const translate_to = (to = '', payload = {}, meta = {}) => ({
  type: RESPOND_TRANSLATING,
  meta: {
    to,
    ...meta,
  },
  payload: {
    ...payload,
  },
})
