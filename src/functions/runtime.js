import { runtime } from '@/globals'
import { aid } from '@/functions/utils'
import {
  SIMULATE_SEND_MESSAGE
} from '@/types'

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/sendMessage
export const sendMessage = (message, payload) => {
  const msg = typeof message === 'string' ? { type: message, payload } : message

  return aid(
    () => runtime.sendMessage(msg),
    () => new Promise((resolve, reject) => {
      window.browser.message = msg
      window.postMessage({
        type: SIMULATE_SEND_MESSAGE,
        from: 'page_script'
      }, '*')

      const handleMessage = ({ data }) => {
        const { type, from, payload } = data

        if (type === SIMULATE_SEND_MESSAGE && from === 'content_script') {
          console.info(from, payload)
          resolve(payload)

          window.removeEventListener('message', handleMessage, false)
        }
      }

      window.addEventListener('message', handleMessage, false)
    })
  )
}

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onMessage
export const onMessage = {
  addListener: callback => aid(() => runtime.onMessage.addListener(callback)),
  removeListener: listener => aid(() => runtime.onMessage.removeListener(listener)),
  hasListener: listener => aid(() => runtime.onMessage.hasListener(listener))
}
