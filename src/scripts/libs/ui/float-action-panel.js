import { do_action, add_action, injectHTML } from '../functions'
import { selectedText } from "../ui/selection"
import {
  RENDER_FLOAT_ACTION_PANEL,
} from "../actions/types"

import synth from "../services/synth"

const { runtime } = browser

export const WEEL_FAP = 'weel#weel__float-action-panel'
export const getFAP = context => (context || document).querySelector(WEEL_FAP)

export default (cfg, port) => {
  loadFAPElement(cfg, port)
  loadFAPStyles(cfg)
}

function loadFAPElement(cfg, port) {
  const { content_url, fab_hide_timeout } = cfg

  fetch(content_url)
  .then(res => res.text())
  .then(content => {
    const parser = new DOMParser()
    const html = parser.parseFromString(content, 'text/html')
    const fap = html.querySelector(WEEL_FAP)

    document.body.appendChild(fap)

    listener(port, cfg)

    let selection = ''

    fap.addEventListener('mousedown', ev => {
      const txt = selectedText()

      if (!txt) return true

      selection = txt
    })

    fap.addEventListener('mouseup', ev => {
      ev.preventDefault()
      ev.stopPropagation()
    }, false)

    fap.querySelector(`${WEEL_FAP}--i-voice`).addEventListener('mouseup', ev => {
      synth(selection, cfg)
    }, false)

    fap.querySelector(`${WEEL_FAP}--i-copy`).addEventListener('click', ev => {
      ev.preventDefault()
      ev.stopPropagation()

      const target = ev.currentTarget.nextElementSibling
      const textarea = target.nextElementSibling

      textarea.value = target.innerText
      textarea.select()

      document.execCommand('copy')
    }, false)
  })

}

function loadFAPStyles(cfg) {
  const FAB_CSS_URL = runtime.getURL('css/content-fap.css')

  const FONT_URL_TTF = runtime.getURL('fonts/weel-translate.ttf')
  const FONT_URL_WOFF = runtime.getURL('fonts/weel-translate.woff')

  fetch(FAB_CSS_URL)
  .then(res => res.text())
  .then(styles => {
    const style = document.createElement('style')
    const font = [
      `@font-face {`,
      `font-family: 'weel-translate';`,
      `src: url("${FONT_URL_TTF}") format("truetype"), url("${FONT_URL_WOFF}") format("woff");`,
      `font-weight: normal;`,
      `font-style: normal;`,
      `}`,
    ]
    const css = document.createTextNode(font.join('') + styles)

    style.setAttribute('id', 'weel__float-action-panel--css')
    style.appendChild(css)

    document.head.appendChild(style)
  })
}

function listener(port, cfg) {
  port.onMessage.addListener(action => do_action(RENDER_FLOAT_ACTION_PANEL, action, cfg))
}
