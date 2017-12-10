/**
 * repack some common APIs of web extension
 */
try {
  const extensionError = window.browser.runtime.lastError
  if (extensionError) console.error(extensionError)
} catch (error) {
  window.browser = {}

  console.info(
    `%c  You Are Running In A Normal Browser Environment.  `,
    'color: #FF9800; font-weight: bold; border: solid 1px #FF9800; border-radius: 2px;'
  )
}

const { i18n } = window.browser

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/i18n/getMessage
export const getMessage = (messageName, substitutionsOptional) => {
  let name = ''

  try {
    name = i18n.getMessage(messageName, substitutionsOptional)
  } catch (error) {
    name = messageName
      .replace(/_+/g, ' ').toLowerCase()
      .replace(/( |^)[a-z]/g, a => a.toUpperCase())
  }

  return name
}

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/i18n/getUILanguage
export const getUILanguage = () => {
  try {
    return i18n.getUILanguage()
  } catch (error) {
    return null
  }
}

class WebExtUtils {
  install (Vue, options) {
    Vue.mixin({
      computed: {
        i18n: () => ({
          getMessage,
          getUILanguage
        })
      }
    })
  }
}

export default new WebExtUtils()
