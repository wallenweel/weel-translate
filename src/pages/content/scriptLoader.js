import { floatAction } from '@/globals'
import { parserDOMString } from '@/functions/utils'
import store from './store'

const { state } = store

export const loadTemplate = (template) => {
  const parserd = parserDOMString(template)
  const templateDOM = parserd.querySelector('template')
  const templateCont = document.importNode(templateDOM.content, true)

  // result targets
  const vDoms = templateCont.querySelectorAll('v')
  const targets = Array.from(vDoms).reduce((a, v) => {
    const [key, spares, parent] = [
      v.getAttribute('weel-key'),
      v.getAttribute('weel-spares'),
      v.parentNode
    ]
    a.push({
      el: v,
      key,
      spares: spares ? spares.split(',') : undefined,
      parent
    })
    return a
  }, [])

  // TODO: test code
  // targets[0].el.textContent = 'Cèshì'
  // targets[1].el.textContent = 'test'
  // targets[2].el.textContent = '测试测试测试'
  // targets[3].el.textContent = '名词\n["测试", "试验", "试", "实验", "考试", "考验", "测验"]'

  const rippleDoms = templateCont.querySelectorAll('[weel-ripple]')
  const rippleHolder = document.createElement('span')
  rippleHolder.className = '-ripple-js'
  Array.from(rippleDoms).forEach(el => {
    el.appendChild(rippleHolder.cloneNode(true))

    el.addEventListener('click', function () {
      this.setAttribute('weel-ripple', 'active')

      const timeout = setTimeout(() => {
        this.setAttribute('weel-ripple', '')
        clearTimeout(timeout)
      }, 1000)
    }, false)
  })

  // float action container
  const container = document.createElement(floatAction.workspace.tag)

  container.setAttribute(`data-${floatAction.workspace.flag}`, true)

  container.addEventListener('click', ev => {
    ev.preventDefault()

    const hasClick = ev.target.getAttribute('data-on-click')

    if (!hasClick) return true

    console.log(hasClick)
  }, false)

  container.appendChild(templateCont)

  // inject page
  document.body.appendChild(container)

  // apply mutation of template when loaded
  store.commit('templateLoaded', { container, targets })
}

export const loadStyle = (style) => {
  if (!style) return null

  const headStyle = document.createElement('style')

  headStyle.type = 'text/css'
  headStyle.textContent = style

  document.head.appendChild(headStyle)
}

export default () => {
  const { style, template } = state.templates.compiled[state.current_template_id]

  loadTemplate(template)

  loadStyle(style)

  document.addEventListener('mouseup', ev => {
    const selectedText = window.getSelection().toString().trim()

    if (selectedText.length && ev.button === 0) {
      // console.log(selectedText, state.container.querySelectorAll('[weel-on-selectionchange]'))

      store.commit('getSelection', document.getSelection())

      // const {}
      // const { height, width, x, y } = store.state.selectionRect
    }
  })
}
