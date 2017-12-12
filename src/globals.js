/**
 * some global variables/functions
 */
export const env = 'browser' // "chrome" to Chrome

try {
  const extensionError = window[env].runtime.lastError
  if (extensionError) console.error(extensionError)
} catch (error) {
  window[env] = {}

  console.info(
    `%c  You Are Running In A Normal Browser Environment.  `,
    'color: #FF9800; font-weight: bold; border: solid 1px #FF9800; border-radius: 2px;'
  )
}

// if app is not running in the extension,
// these below variables will be undefined
export const { i18n, runtime, storage } = window[env]

export default window[env]

/**
 * Two envrionments helper
 * @param {callback} right       run in right environment
 * @param {callback} substitute  other stutas
 * @returns
 */
export const aid = (right, substitute = () => null) => {
  try {
    return right()
  } catch (error) {
    return substitute()
  }
}

/**
 * What is its type
 * @param {any} thing something is need to get type
 * @return {string} type name in lower case, e.g. object ...
 */
export const whattype = thing =>
  Object.prototype.toString.call(thing)
  .match(/\w+/g)[1].toLowerCase()

export const injectHTML = (content, obj) => {
  if (!content) return void 0

  const target = obj
  let doms = [content]

  if (whattype(content) === 'string') {
    const parser = new DOMParser()

    doms = [...parser.parseFromString(content, 'text/html').body.childNodes]
  }

  while (target.firstChild) target.removeChild(target.firstChild)

  doms.forEach(dom => target.appendChild(dom))
}
