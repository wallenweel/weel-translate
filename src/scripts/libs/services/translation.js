import { apiParse } from '../functions'
import google from '../api/google'
import youdao from '../api/youdao'
import bing from '../api/bing'
import baidu from '../api/baidu'

try {
  const port = chrome.runtime.connect({ name: 'Connecting:Translate' })
} catch (e) {
  console.info('ReferenceError: chrome is not defined!\n', 'Meybe You Are In Common Page For Developing, You might ignore the notice.')

  const port = {}
}

export default (src, args) => {
  let service

  switch (src) {

  case 'youdao':
    service = youdao
    break
  case 'google':
    service = google
    break
  case 'baidu':
    service = baidu
    break
  case 'bing':
    service = bing
    break

  }

  return apiParse(service)(args)
}
