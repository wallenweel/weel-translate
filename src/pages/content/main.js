import { adaptation } from '@/globals'
import { sendMessage } from '@/functions/runtime'
import { parserDOMString } from '@/functions/utils'
import {
  INITIAL_FROM_BACKGROUND
} from '@/types'

import './style.scss'

// TODO: remember comment here, due to "web-ext" is
// not working fine for reloading tab page in development
;((w, d, flag) => d.body.getAttribute(flag) === 'running'
  ? setTimeout(() => w.location.reload(), 150)
  : d.body.setAttribute(flag, 'running')
)(window, document, 'weel-translate')

// for the development, implement extension run in normal
// page script but can get data from background script.
// @see popup: http://localhost:3030/dist/popup/#/home/translation
;(() => {
  if (!document.body.getAttribute(adaptation.flag)) return null

  const [input, output] = [
    document.querySelector(`${adaptation.i.tag}.${adaptation.i.flag}`),
    document.querySelector(`${adaptation.o.tag}.${adaptation.o.flag}`)
  ]

  const handleInput = () => {
    sendMessage(JSON.parse(input.value))
    .then(state => {
      output.value = JSON.stringify(state)
      output[adaptation.o.event]()
    })
  }

  // immediately sendMessage for the first communication
  handleInput()

  // add message coming listener
  input.addEventListener(adaptation.i.event, handleInput, false)
})()

// private state
const defaults = {
  test: false,

  templateID: 'weel-translate--template',
  registerEvents: {
    copy (ev) {
      console.log('copy')
    }
  },

  template: `
  <template>
    <div class="wt-fab--container">
      <button type="button">fab</button>
      <i class="material-icons">error_outline</i>
    </div>
    <div class="wt-fap--container">
      <wt-button data-type="voice"/>
    </div>
  </template>
  `
}

// initial state from background script
;((state) => sendMessage(INITIAL_FROM_BACKGROUND)
// merge default state of content script with
// these selected of background script
.then(({
  templates
}) => Object.assign(state, {
  templates
})))(defaults)
// all is ready
.then((state) => {
  if (document.body.getAttribute(adaptation.flag)) return null

  const { templateID, template } = state

  // document.addEventListener('click', ev => {
  //   console.log(ev.target)
  // }, false)
  const container = document.createElement('div')
  container.setAttribute('data-weel-translate-scoped', true)
  // container.addEventListener('click', ev => {
  //   console.log(ev.target)
  // }, false)

  const templateDOM = parserDOMString(template).querySelector('template')
  templateDOM.classList.add(templateID)

  const templateContent = templateDOM.content
  const btn = templateContent.querySelector('wt-button')
  const rbtn = document.createElement('button')
  rbtn.textContent = 'test'
  btn.parentNode.replaceChild(rbtn, btn)
  // console.log()

  const clone = document.importNode(templateDOM.content, true)
  // container.appendChild(clone)
  document.body.appendChild(container).appendChild(clone)
  container.querySelector('div').addEventListener('click', ev => {
    console.log(ev)
  }, false)
})
