import { sendMessage } from '@/functions/runtime'
import { adaptation, floatAction } from '@/globals'
import {
  INITIAL_FROM_BACKGROUND
} from '@/types'

import store from './store'
// import scriptLoader from './scriptLoader'

import './style.scss'
import Vue from 'vue'

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

  const { template, script, style } = store.state.templates.compiled['default']
  console.log(style)

  // float action container
  const container = document.createElement(floatAction.workspace.tag)

  container.setAttribute(`data-${floatAction.workspace.flag}`, true)
  document.body.appendChild(container)

  /* eslint-disable no-eval */
  const options = (eval(script.replace('export default ', 'const a ='))({ el: '#app', template }))
  // console.log(options())
  // scriptLoader()

  // options.template = `<div>${template}</div>`

  /* eslint-disable no-new */
  new Vue(options).$mount(container)
  // new Vue({
  //   // el: document.querySelector('[data-weel-translate--scoped]'),
  //   el: '#app',
  //   template: `<div>${template}</div>`,
  //   data () {
  //     return {
  //       phonetic_src: 'aaa',
  //       phonetic_dest: 'bbb',
  //       translation: 'ccc',
  //       explain: 'ddd'
  //     }
  //   }
  // })
  // console.log(Vue.compile())
})
