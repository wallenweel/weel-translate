import api, { youdao } from './libs/api.js'
import {
  TRANSLATE,
  TRANSLATE_QUERY_DONE,
  NO_CORRESPONDING_ACTION,
} from './libs/actions.js'

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(data => {
    const { type, payload = {} } = data

    switch (type) {
    case TRANSLATE:
      const { content } = payload
      const f = api(youdao, 'text')

      return f({ content: content || 'translate' })
        .then(json => {
          port.postMessage({
            type: TRANSLATE_QUERY_DONE,
            payload: {
              ...json,
            },
          })
        })
    default:
      postMessage({
        type: NO_CORRESPONDING_ACTION,
      })
    }
  })
})
