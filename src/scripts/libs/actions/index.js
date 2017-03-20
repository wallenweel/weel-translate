import {
  REQUEST_TRANSLATING,
  RESPOND_TRANSLATING,
} from './types'

export const translate_from = (from = '', data = {}, metas = {}) => ({
  type: REQUEST_TRANSLATING,
  meta: {
    from,
    ...metas,
  },
  payload: {
    ...data,
  },
})

export const translate_to = (to, data = {}, metas = {}) => ({
  type: RESPOND_TRANSLATING,
  meta: {
    to,
    ...metas,
  },
  payload: {
    ...data,
  },
})
