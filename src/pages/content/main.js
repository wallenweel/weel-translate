import { adaptation, floatAction } from '@/globals'
import { sendMessage } from '@/functions/runtime'
import { parserDOMString } from '@/functions/utils'
import {
  INITIAL_FROM_BACKGROUND
} from '@/types'

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

const { workspace } = floatAction

// private state
const defaultState = {
  test: false,

  current_template_id: 'default',
  registerEvents: {
    copy (ev) {
      console.log('copy')
    }
  },

  template: `
  <template>
    <div class="wt-fab--container">
      <button type="button">fab</button>
      <i class="icon-voice" size="small" color="red"></i>
    </div>
    <div class="wt-fap--container">
      <wt-button data-type="voice"/>
    </div>
  </template>
  `
}

// initial state from background script
// just select these that will be used
;(() => sendMessage(INITIAL_FROM_BACKGROUND).then(({
  templates,
  preferences
}) => Object.assign(defaultState, {
  templates,
  preferences
})))().then(({
  template,
  templates,
  current_template_id
}) => {
  const { style } = templates.compiled[current_template_id]

  loadTemplate(template)

  loadStyle(style)
})

function loadTemplate (template) {
  const parserd = parserDOMString(template)
  const templateDOM = parserd.querySelector('template')
  const templateContent = templateDOM.content

  const btn = templateContent.querySelector('wt-button')
  const rbtn = document.createElement('button')
  rbtn.textContent = 'test'
  btn.parentNode.replaceChild(rbtn, btn)

  const container = document.createElement(workspace.tag)

  container.setAttribute(`data-${workspace.flag}`, true)
  container.addEventListener('click', ev => {
    console.log(ev.currentTarget)
  }, false)
  container.appendChild(document.importNode(templateDOM.content, true))
  document.body.appendChild(container)
}

function loadStyle (style) {
  const headStyle = document.createElement('style')

  headStyle.type = 'text/css'
  headStyle.textContent = style

  document.head.appendChild(headStyle)
}
