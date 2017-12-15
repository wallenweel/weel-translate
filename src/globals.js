/**
 * some global variables
 */

// "chrome" to Chrome
export const env = 'browser'

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
export const {
  i18n,
  runtime,
  storage,
  tabs,
  notifications
} = window[env]

export default window[env]
