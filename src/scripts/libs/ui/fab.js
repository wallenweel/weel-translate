export default (runtime, src) => {
  const FAB_DOM_URL = runtime.getURL('fab.html')
  const FAB_CSS_URL = runtime.getURL('css/content-fab.css')

  const FONT_URL_TTF = runtime.getURL('fonts/weel-translate.ttf')
  const FONT_URL_WOFF = runtime.getURL('fonts/weel-translate.woff')

  const WEEL_APP = 'weel#weel__float-action-button'

  const { head, body } = document

  const selectedText = () => window.getSelection().toString().trim()

  body.addEventListener('mouseup', ev => {
    if (!selectedText()) return void 0

    console.log(selectedText())
  }, false)


  fetch(FAB_DOM_URL)
  .then(res => res.text())
  .then(content => {
    const parser = new DOMParser()
    const html = parser.parseFromString(content, 'text/html')
    const app = html.querySelector(WEEL_APP)

    body.appendChild(app)
  })

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

    head.appendChild(style)
  })
}
