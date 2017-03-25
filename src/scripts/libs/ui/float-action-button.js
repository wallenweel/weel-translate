import { do_action, add_action } from "../functions"
import { selectedText, handleMousedown, handleMouseup } from "../ui/selection"
import {
  SELECTED_TEXT_IN_CONTENT,
  REMOVED_SELECTION_IN_CONTENT,
  FAB_TRIGGERED,
} from "../actions/types"

const { runtime } = browser

export const WEEL_FAB = 'weel#weel__float-action-button'

export default (cfg, port) => {
  loadFABElement(cfg, port)
  loadFABStyles()
}

function loadFABElement(cfg, port) {
  const { content_url, fab_hide_timeout } = cfg

  fetch(content_url)
  .then(res => res.text())
  .then(content => {
    const parser = new DOMParser()
    const html = parser.parseFromString(content, 'text/html')
    const fab = html.querySelector(WEEL_FAB)

    document.body.appendChild(fab)

    let down_time = 0
    let up_time = 0

    fab.addEventListener('mousedown', ev => {
      ev.preventDefault()
      ev.stopPropagation()

      down_time = ev.timeStamp
    }, false)

    fab.addEventListener('mouseup', ev => {
      ev.preventDefault()
      ev.stopPropagation()

      up_time = ev.timeStamp

      const interval = up_time - down_time

      if (interval > (fab_hide_timeout || 1500)) {
        document.body.removeChild(fab)
        document.body.removeEventListener('mousedown', handleMousedown, false)
        document.body.removeEventListener('mouseup', handleMouseup, false)

        return void 0
      }

      do_action(FAB_TRIGGERED, port, selectedText(), fab)
    })
  })
}

function loadFABStyles(cfg) {
  const FAB_CSS_URL = runtime.getURL('css/content-fab.css')

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

    style.setAttribute('id', 'weel__float-action-button--css')
    style.appendChild(css)

    document.head.appendChild(style)
  })

}
