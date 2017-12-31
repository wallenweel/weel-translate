import { parserDOMString, istype, timehash } from '@/functions/utils'
import parserHelper from '@/functions/parserHelper'

export const compileTemplate = (dom, { scoped }) => {
  const template = dom.querySelector('template')

  if (!template) return null

  if (scoped) {
    template.content.querySelector('*').setAttribute(`${scoped}`, '')
  }

  const type = template.getAttribute('type')

  if (istype(type, 'null') || type === 'vue') {
    return template.innerHTML
  }

  return template.outerHTML.replace(/\{\{(.+)\}\}/g, (pattern, key) => {
    switch (true) {
      case /\?:/.test(key): // if falsy else another
        const [k1, ...spares] = key.split('?:')
        return `<v weel-key="${k1}" weel-spares="${spares.join(',')}"></v>`

      default:
        const [k0] = key.split('\\')
        return `<v weel-key="${k0}"></v>`
    }
  })
}

export const compileScript = (dom) => {
  const script = dom.querySelector('script')

  if (!script) return null

  return script.textContent
}

export const compileStyle = (dom) => {
  const style = dom.querySelector('style')

  if (!style) return { rules: '', scoped: '' }

  let scoped = style.getAttribute('scoped')
  if (!istype(scoped, 'null')) {
    scoped = scoped || `data-${timehash()}`
  }

  const rules = Array.from(style.sheet.cssRules).reduce((a, r) => {
    let cssText = r.cssText

    if (scoped && /^\[scoped\]\s*/.test(cssText)) {
      cssText = `[${scoped}]${cssText.replace(/^\[scoped\]/, '')}`
    }

    return a.push(cssText) && a
  }, []).join('\n')

  return { rules, scoped }
}

export const compilePreser = (dom) => {
  const parser = dom.querySelector('parser')

  if (!parser) return null

  const parserContent = parser.textContent

  if (!parserContent || !parserContent.length) return null

  const parserJSON = JSON.parse(parserContent)

  return Object.entries(parserJSON).reduce((o, [id, preset]) => {
    const idArray = id.split(/\s*\|\s*/)
    for (const _id of idArray) {
      o[_id] = parserHelper({ parser: preset })
    }
    return o
  }, {})
}

export default (presets, __ = {}) => {
  for (const [id, preset] of Object.entries(presets)) {
    const presetDOM = parserDOMString(preset)
    const parser = compilePreser(presetDOM)
    const { rules, scoped } = compileStyle(presetDOM)
    const script = compileScript(presetDOM)
    const template = compileTemplate(presetDOM, { scoped })

    __[id] = {
      scoped,
      parser,
      template,
      script,
      style: rules
    }
  }

  return __
}
