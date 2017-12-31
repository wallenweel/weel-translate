import Vue from 'vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import { sendMessage } from '@/functions/runtime'
import { env } from '@/globals'
import {
  INITIAL_FROM_BACKGROUND,
  SIMULATE_SEND_MESSAGE
} from '@/types'

import store from '@/stores/content'

import './style.scss'

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

  // /* eslint-disable no-unused-vars */
  const defaultOptions = {
    el,
    template,
    store,
    data () {
      return {
        result: {
          phonetic_src: '',
          phonetic_dest: '',
          translation: '',
          explain: 'ddd'
        },
        selectedText: null,
        mouse: {
          down: [null, null],
          up: [null, null]
        },
        fabShow: false,
        fapShow: false
      }
    },
    mounted () {
      document.addEventListener('mousedown', ev => {
        this.$nextTick(() => {
          this.fabShow = false
          this.fapShow = false
        })

        // this.mouse.down = [ev.clientX, ev.clientY]
      }, false)

      document.addEventListener('mouseup', ev => {
        this.selectedText = window.getSelection().toString().trim()

        if (!this.selectedText.length || ev.button !== 0) return true

        this.$store.commit('getSelection')
        // this.mouse.up = [ev.clientX, ev.clientY]

        this.fabShow = true
        this.$nextTick(() => this.fabPosition())
      }, false)
    },
    computed: {
      ...mapState(['test', 'selectionRect'])
    },
    methods: {
      handleFAB (ev) {
        this.fapShow = true
        this.$nextTick(() => this.fapPosition())
        this.fabShow = false
      },
      fabPosition () {
        const { innerWidth, innerHeight } = window
        const { offsetWidth, offsetHeight } = this.$refs.fab
        const { height, width, x, y } = this.selectionRect

        let [offsetX, offsetY] = [
          x + width / 2 - offsetWidth / 2,
          y + height + offsetHeight * 0.125
        ]

        offsetX = offsetX > 0 ? offsetX : 16
        offsetY = offsetY > 0 ? offsetY : 16

        offsetX = innerWidth - offsetWidth - offsetX > 0 ? offsetX : innerWidth - offsetWidth
        offsetY = innerHeight - offsetY - offsetHeight > 0 ? offsetY : y - offsetHeight / 0.875

        this.$refs.fab.style.WebkitTransform = `translate3d(${offsetX}px, ${offsetY}px, 0)`
      },
      fapPosition () {
        const { innerWidth, innerHeight } = window
        const { offsetWidth, offsetHeight } = this.$refs.fap
        const { height, width, x, y } = this.selectionRect

        let [offsetX, offsetY] = [
          x + width / 2 - offsetWidth / 2,
          y + height + 16
        ]

        offsetX = offsetX > 0 ? offsetX : 16
        offsetY = offsetY > 0 ? offsetY : 16

        offsetX = innerWidth - offsetWidth - offsetX > 0 ? offsetX : innerWidth - offsetWidth - 16
        offsetY = innerHeight - offsetY - offsetHeight > 0 ? offsetY : y - offsetHeight - 16

        this.$refs.fap.style.WebkitTransform = `translate3d(${offsetX}px, ${offsetY}px, 0)`
      }
    }
  }

  /* eslint-disable no-eval */
  const options = Object.assign(
    defaultOptions,
    (eval(script)({ mapState, mapMutations, mapActions }))
  )

  /* eslint-disable no-new */
  new Vue(options)
})
