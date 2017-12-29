import { floatAction } from '@/globals'
import { parserDOMString } from '@/functions/utils'
// import store from '@/stores/content'

export const loadTemplate = (template) => {
  const parserd = parserDOMString(template)
  const templateDOM = parserd.querySelector('template')
  // const templateContent = templateDOM.content

  const container = document.createElement(floatAction.workspace.tag)

  container.setAttribute(`data-${floatAction.workspace.flag}`, true)

  container.addEventListener('click', ev => {
    ev.preventDefault()

    const hasClick = ev.target.getAttribute('data-on-click')

    if (!hasClick) return true

    console.log(hasClick)
  }, false)

  const clone = document.importNode(templateDOM.content, true)
  container.appendChild(clone)

  document.body.appendChild(container)

  return container
}

export const loadStyle = (style) => {
  if (!style) return null

  const headStyle = document.createElement('style')

  headStyle.type = 'text/css'
  headStyle.textContent = style

  document.head.appendChild(headStyle)
}

export default ({ state }) => {
  const { style, template } = state.templates.compiled[state.current_template_id]

  state.container = loadTemplate(template)

  loadStyle(style)

  document.querySelector('p').textContent = state.current_template_id

  document.addEventListener('mouseup', ev => {
    const selectedText = window.getSelection().toString().trim()

    if (selectedText.length && ev.button === 0) {
      console.log(selectedText, state.container.querySelectorAll('[weel-on-selectionchange]'))
    }
  })
}
