// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/i18n/getMessage
export const getMessage = (messageName, substitutionsOptional) => {
  let name = ''

  try {
    name = window.browser.i18n.getMessage(messageName, substitutionsOptional)
  } catch (error) {
    name = messageName
      .replace(/_+/g, ' ').toLowerCase()
      .replace(/( |^)[a-z]/g, a => a.toUpperCase())
  }

  return name
}

class WebExtUtils {
  install (Vue, options) {
    Vue.mixin({
      computed: {
        i18n: () => ({
          getMessage
        })
      }
    })
  }
}

export default new WebExtUtils()
