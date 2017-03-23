import Weel, { weel as $ } from "../Weel"

export default (runtime, src) => {
  const FAB_DOM_URL = runtime.getURL('fab.html')
  const FAB_CSS_URL = runtime.getURL('css/fab.css')

  const { head, body } = document

  const selectedText = () => window.getSelection().toString().trim()

  $(body).register('mouseup', ev => {
    if (!selectedText()) return void 0

    console.log(selectedText())
  })


  fetch(FAB_DOM_URL)
  .then(res => res.text())
  .then(content => {
    const parser = new DOMParser()

    const html = parser.parseFromString(content, 'text/html')
    const app = html.querySelector('#weel__float-action-button--container')

    body.insertBefore(app, body.firstChild)

  })

  fetch(FAB_CSS_URL)
  .then(res => res.text())
  .then(styles => {
    const style = document.createElement('style')
    const css = document.createTextNode(styles)
    // style.innerText = styles
    style.appendChild(css)

    head.appendChild(style)
  })
}
