import { do_action, add_action } from "../functions"
import { selectedText, handleMousedown, handleMouseup } from "../ui/selection"
import {
  SELECTED_TEXT_IN_CONTENT,
  FAB_TRIGGERED,
  REMOVE_FAB_IN_CURRENT,
} from "../actions/types"

const { runtime } = browser

export const WEEL_FAB = 'weel#weel__float-action-button'
export const getFAB = context => (context || document).querySelector(WEEL_FAB)

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

    fab.setAttribute('data-check-aim', cfg.check_aim_lang || false)
    fab.setAttribute('data-api-src', cfg.api_src)
    fab.setAttribute('data-lang-from', cfg.lang_from.value)
    fab.setAttribute('data-lang-to', cfg.lang_to.value)

    document.body.appendChild(fab)

    let intervalID = 0

    const countdown = callback => {
      let time = 0
      intervalID = 0

      const timeout = setInterval(() => {
        time++

        if (callback) {
          if ((time * 1000) > (fab_hide_timeout || 2000)) {
            clearInterval(timeout)

            return callback()
          }
        }
      }, 1000)

      return timeout
    }

    fab.addEventListener('mousedown', ev => {
      ev.preventDefault()
      ev.stopPropagation()

      if (intervalID) clearInterval(intervalID)
      intervalID = countdown(() => do_action(REMOVE_FAB_IN_CURRENT))
    }, false)

    fab.addEventListener('mouseup', ev => {
      ev.preventDefault()
      ev.stopPropagation()

      if (intervalID) clearInterval(intervalID)

      do_action(FAB_TRIGGERED, port, selectedText(), ev)
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
