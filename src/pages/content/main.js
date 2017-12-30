import { sendMessage } from '@/functions/runtime'
import { adaptation } from '@/globals'
import {
  INITIAL_FROM_BACKGROUND
} from '@/types'

import store from './store'
import scriptLoader from './scriptLoader'

import './style.scss'

// TODO: remember comment here, due to "web-ext" is
// not working fine for reloading tab page in development
;((w, d, t) => d.body.getAttribute(t) === 'running' ? setTimeout(() => w.location.reload(), 150) : d.body.setAttribute(t, 'running'))(window, document, 'weel-translate')

// for the development, implement extension run in normal
// page script but can get data from background script.
// @see popup: http://localhost:3030/dist/popup/#/home/translation
;(() => {
  if (!document.body.getAttribute(adaptation.flag)) return null

  const [input, output] = [
    document.querySelector(`${adaptation.i.tag}.${adaptation.i.flag}`),
    document.querySelector(`${adaptation.o.tag}.${adaptation.o.flag}`)
  ]

  // request data for page script
  const handleInput = () => sendMessage(JSON.parse(input.value))
  .then(state => {
    output.value = JSON.stringify(state)
    output[adaptation.o.event]()
  })

  handleInput() // immediately sendMessage for the first communication

  // add message coming listener
  input.addEventListener(adaptation.i.event, handleInput, false)
})()

// initial content script
store.dispatch(INITIAL_FROM_BACKGROUND)
.then(success => {
  if (!success) {
    console.log('Initialize failed.')
    return false
  }

  scriptLoader()
})
