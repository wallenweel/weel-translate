import Vue from 'vue'
import WebExtUtils from '@/plugins/WebExtUtils'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { sendMessage } from '@/functions/runtime'
import { runtime, env } from '@/globals'
import {
  INITIAL_FROM_BACKGROUND,
  SIMULATE_SEND_MESSAGE,
  CONTEXT_MENU_ACTION_TRANSLATE,
  GET_PAGE_SELECTED_TEXT
} from '@/types'

import store from '@/stores/content'
import defaultOptions from './defaultOptions'

import './style.scss'

Vue.use(WebExtUtils)

// TODO: remember comment here, due to "web-ext" is
// not working fine for reloading tab page in development
if (env.development && !/(popup|options)/.test(location.href)) {
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
  if (env.development && (window.wrappedJSObject.browser || {}).message) return null

  if (!success) return false

  runtime.onMessage.addListener((action = {}, sender, emit) => {
    const { type } = action

    if (type === CONTEXT_MENU_ACTION_TRANSLATE) {
      store.dispatch(CONTEXT_MENU_ACTION_TRANSLATE)
      emit(true)
    }

    if (type === GET_PAGE_SELECTED_TEXT) {
      store.commit('getSelection')

      if (!store.state.selectionText) return emit && emit(false)

      emit(store.state.selectionText)
    }
  })

  const { templates, current_template_id } = store.state
  const { template, script, style } = templates.compiled[current_template_id]
  console.log(style)

  // float action container
  const el = document.createElement('div')
  document.body.appendChild(el)

  /* eslint-disable no-unused-vars */

  /* eslint-disable no-eval */

  /* eslint-disable no-new */
  new Vue(Object.assign(
    defaultOptions({ el, store, template }),
    (eval(script)({ mapState, mapGetters, mapMutations, mapActions }))
  ))
})
