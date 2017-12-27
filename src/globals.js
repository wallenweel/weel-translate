/* global browser */

/**
 * some global variables
 */
try {
  const extensionError = browser.runtime.lastError
  if (extensionError) console.error(extensionError)
} catch (error) {
  window.browser = {}

  console.info(
    `%c  You Are Running In A Normal Browser Environment.  `,
    'color: #FF9800; font-weight: bold; border: solid 1px #FF9800; border-radius: 2px;'
  )
}

// if app is not running in the extension,
// these below variables will be undefined
export const {
  i18n,
  runtime,
  storage,
  tabs,
  notifications
} = browser

export default browser

export const vuetify = {
  theme: {
    primary: '#2196F3',
    secondary: '#1976D2',
    accent: '#FF9800',
    error: '#FF5722'
  }
}

export const adaptation = {
  flag: 'content-page--message',
  i: {
    flag: 'content-page--message__input',
    tag: 'button',
    event: 'click'
  },
  o: {
    flag: 'content-page--message__output',
    tag: 'button',
    event: 'click'
  }
}
