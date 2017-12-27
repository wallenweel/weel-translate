import { runtime, adaptation } from '@/globals'
import { aid } from '@/functions/utils'

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/sendMessage
export const sendMessage = (message, payload) => {
  const msg = typeof message === 'string' ? { type: message, payload } : message

  return aid(
    () => runtime.sendMessage(msg),
    () => new Promise((resolve, reject) => {
      let [input, output] = [
        document.querySelector(`${adaptation.i.tag}.${adaptation.i.flag}`),
        document.querySelector(`${adaptation.o.tag}.${adaptation.o.flag}`)
      ]

      if (!document.body.getAttribute(adaptation.flag)) {
        const fragment = document.createDocumentFragment()

        input = document.createElement(`${adaptation.i.tag}`)
        input.classList.add(adaptation.i.flag)

        output = document.createElement(`${adaptation.o.tag}`)
        output.classList.add(adaptation.o.flag)

        for (const target of [input, output]) {
          target.style.display = 'none'
          fragment.appendChild(target)
        }

        document.body.appendChild(fragment)
        document.body.setAttribute(adaptation.flag, true)
      }

      const handleOutput = ev => {
        // get recevicer's value and parse to json
        resolve(JSON.parse(ev.currentTarget.value))

        // remove the listener after resloving
        output.removeEventListener(adaptation.o.event, handleOutput, false)
      }

      // set message to trigger's value
      input.value = JSON.stringify(msg)
      input[adaptation.i.event]()

      // listen recevicer's value changes
      output.addEventListener(adaptation.o.event, handleOutput, false)
    })
  )
}

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onMessage
export const onMessage = {
  addListener: callback => aid(() => runtime.onMessage.addListener(callback)),
  removeListener: listener => aid(() => runtime.onMessage.removeListener(listener)),
  hasListener: listener => aid(() => runtime.onMessage.hasListener(listener))
}
