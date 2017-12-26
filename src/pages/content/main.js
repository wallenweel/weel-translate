import { sendMessage } from '@/functions/runtime'
import { parserDOMString } from '@/functions/utils'
import {
  INITIAL_FROM_BACKGROUND
} from '@/types'

// TODO: remember comment here, due to "web-ext" is
// not working fine for reloading tab page in development
;((w, d, flag) => d.body.getAttribute(flag) === 'running'
  ? setTimeout(() => w.location.reload(), 150)
  : d.body.setAttribute(flag, 'running')
)(window, document, 'weel-translate')

// private state
const defaults = {
  test: false,

  templateID: 'weel-translate--template',

  template: `
  <template>
    <div class="wt-fab--container">
      <button type="button">fab</button>
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
  const { templateID, template } = state

  const templateDOM = parserDOMString(template).querySelector('template')
  templateDOM.classList.add(templateID)

  const templateContent = templateDOM.content
  const btn = templateContent.querySelector('wt-button')
  const rbtn = document.createElement('button')
  rbtn.textContent = 'test'
  btn.parentNode.replaceChild(rbtn, btn)
  // console.log()

  const clone = document.importNode(templateDOM.content, true)
  document.body.appendChild(clone)
})
