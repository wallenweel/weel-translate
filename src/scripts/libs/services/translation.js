import { apiParse } from '../functions'
import google from '../api/google'
import youdao from '../api/youdao'
import bing from '../api/bing'

try {
  const port = chrome.runtime.connect({ name: 'Connecting:Translate' })
} catch (e) {
  console.info('ReferenceError: chrome is not defined!\n', 'Meybe You Are In Common Page For Developing, You might ignore the notice.')

  const port = {}
}

const apiPick = () => {

}

export const translator = ({ q = 'translate' }) => {
  const service = apiParse(youdao)

  service({ q }).then(json => {
    console.log(q, json)
  })
}
