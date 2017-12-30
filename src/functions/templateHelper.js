import { floatAction } from '@/globals'
import { parserDOMString } from '@/functions/utils'
import parserHelper from '@/functions/parserHelper'

export const compileTemplate = (dom) => {
  const html = dom.querySelector('template')

  if (!html) return null

  return html.outerHTML.replace(/\{\{(.+)\}\}/g, (pattern, key) => {
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

export const compileStyle = (dom) => {
  const style = dom.querySelector('style')

  if (!style) return null

  const rules = Array.from(style.sheet.cssRules).reduce((a, r) => {
    a.push(`[data-${floatAction.workspace.flag}] ${r.cssText}`)
    return a
  }, []).join('\n')

  return rules
}

export const compilePreser = (dom) => {
  const parser = dom.querySelector('script[rel="parser"]')

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

    __[id] = {
      template: compileTemplate(presetDOM),
      style: compileStyle(presetDOM),
      parser: compilePreser(presetDOM)
    }
  }

  return __
}
