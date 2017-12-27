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

// private state
const defaultState = {
  test: false,

  registerEvents: {
    copy (ev) {
      console.log('copy')
    }
  },

  template: `
  <parser>
  {
    "google|google_cn": {
      "phonetic_src": "sentences.$.src_translit",
      "phonetic_dest": "sentences.$.translit",
      "translation": "sentences(trans)",
      "explain": "dict(pos////terms)"
    }
  }
  </parser>
  <template>
    <div class="wt-fab--container">
      <button type="button">fab</button>
      <i class="material-icons">error_outline</i>
    </div>
    <div class="wt-fap--container">
      <wt-button data-type="voice"/>
    </div>
  </template>
  <style>
    button {
      background: red;
    }
    div {
      display: block;
    }
  </style>
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
})))().then((state) => {
  const { workspace } = floatAction

  const parserd = parserDOMString(state.template)
  const templateParser = parserd.querySelector('parser')
  const templateDOM = parserd.querySelector('template')
  const templateStyle = parserd.querySelector('style')

  console.log(JSON.parse(templateParser.textContent))

  const templateContent = templateDOM.content
  const container = document.createElement(workspace.tag)
  container.setAttribute(`data-${workspace.flag}`, true)
  container.addEventListener('click', ev => {
    console.log(ev.currentTarget)
  }, false)

  const btn = templateContent.querySelector('wt-button')
  const rbtn = document.createElement('button')
  rbtn.textContent = 'test'
  btn.parentNode.replaceChild(rbtn, btn)

  container.appendChild(document.importNode(templateDOM.content, true))
  document.body.appendChild(container)

  const style = document.createElement('style')
  const rules = Array.from(templateStyle.sheet.cssRules).reduce((a, r) => {
    a.push(`[data-${workspace.flag}] ${r.cssText}`)
    return a
  }, []).join('\n')

  style.type = 'text/css'
  style.textContent = rules

  document.head.appendChild(style)
})
