import { sendMessage } from '@/functions/runtime'
import { env } from '@/globals'
import {
  INITIAL_FROM_BACKGROUND,
  SIMULATE_SEND_MESSAGE
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
  if (!env.development) return null

  const { message } = window.wrappedJSObject.browser

  sendMessage(message).then(state => {
    window.postMessage({
      type: SIMULATE_SEND_MESSAGE,
      from: 'content_script',
      payload: state
    }, '*')
  })

  window.addEventListener('message', ({ data }) => {
    const { type, from } = data
    const { message } = window.wrappedJSObject.browser

    if (type === SIMULATE_SEND_MESSAGE && from === 'page_script') {
      sendMessage(message).then(state => {
        window.postMessage({
          type: SIMULATE_SEND_MESSAGE,
          from: 'content_script',
          payload: state
        }, '*')
      })
    }
  }, false)
})()

// initial content script
store.dispatch(INITIAL_FROM_BACKGROUND)
.then(success => {
  if (success) {
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
