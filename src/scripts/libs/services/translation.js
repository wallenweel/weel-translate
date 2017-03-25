import { apiParse } from '../functions'
import google from '../api/google'
import youdao from '../api/youdao'
import bing from '../api/bing'
import baidu from '../api/baidu'

export const apiPick = src => {
  if (!src) return [google, youdao, baidu]

  switch (src) {

  case 'youdao': return youdao
  case 'google': return google
  case 'baidu':  return baidu
  case 'bing':   return bing
  default:       return youdao

  }
}

export default (src, args) => apiParse(apiPick(src))(args)
