import { sendMessage } from '@/functions/runtime'
import { adaptation, env } from '@/globals'
import {
  INITIAL_FROM_BACKGROUND
} from '@/types'

import store from '@/stores/content'
// import scriptLoader from './scriptLoader'

import './style.scss'
import Vue from 'vue'

// TODO: remember comment here, due to "web-ext" is
// not working fine for reloading tab page in development
if (env.development) {
  ;((w, d, t) => d.body.hasAttribute(t) ? setTimeout(() => w.location.reload(), 150) : d.body.setAttribute(t, ''))(window, document, 'weel-translate-dev')
}

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
    return false
  }

  const { templates, current_template_id } = store.state
  const { template, script } = templates.compiled[current_template_id]

  // float action container
  const rootDom = document.createElement('div')

  document.body.appendChild(rootDom)

  const defaultOptions = { el: rootDom, template, store }

  /* eslint-disable no-eval */
  const options = Object.assign(defaultOptions, eval(script)())

  /* eslint-disable no-new */
  new Vue(options).$mount(rootDom)
})
