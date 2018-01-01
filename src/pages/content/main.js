import Vue from 'vue'
import WebExtUtils from '@/plugins/WebExtUtils'
import { mapState, mapMutations, mapActions } from 'vuex'
import { sendMessage } from '@/functions/runtime'
import { env } from '@/globals'
import {
  INITIAL_FROM_BACKGROUND,
  SIMULATE_SEND_MESSAGE
} from '@/types'

import store from '@/stores/content'
import defaultOptions from './defaultOptions'

import './style.scss'

Vue.use(WebExtUtils)

// TODO: remember comment here, due to "web-ext" is
// not working fine for reloading tab page in development
if (env.development) {
  ;((w, d, t) => d.body.hasAttribute(t) ? setTimeout(() => w.location.reload(), 150) : d.body.setAttribute(t, ''))(window, document, 'weel-translate-dev')
}

// for the development, implement extension run in normal
// page script but can get data from background script.
// @see popup: http://localhost:3030/dist/popup/#/home/translation
;(() => {
  if (!env.development || !window.wrappedJSObject.browser) return null

  const messageHelper = () =>
    sendMessage(window.wrappedJSObject.browser.message)
    .then(state => {
      window.postMessage({
        type: SIMULATE_SEND_MESSAGE,
        from: 'content_script',
        payload: state
      }, '*')
    })

  messageHelper()

  window.addEventListener('message', ({ data: { type, from } }) => {
    if (type === SIMULATE_SEND_MESSAGE && from === 'page_script') messageHelper()
  }, false)
})()

// initial content script
store.dispatch(INITIAL_FROM_BACKGROUND)
.then(success => {
  if (env.development && window.wrappedJSObject.browser) return null

  if (!success) return false

  const { templates, current_template_id } = store.state
  const { template, script } = templates.compiled[current_template_id]

  // float action container
  const el = document.createElement('div')
  document.body.appendChild(el)

  /* eslint-disable no-unused-vars */

  /* eslint-disable no-eval */

  /* eslint-disable no-new */
  new Vue(Object.assign(
    defaultOptions({ el, store, template }),
    (eval(script)({ mapState, mapMutations, mapActions }))
  ))
})
