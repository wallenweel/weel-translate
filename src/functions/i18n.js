import { i18n } from '@/globals'
import { aid } from '@/functions/utils'

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/i18n/getMessage
export const getMessage = (messageName, substitutionsOptional) => aid(
  () => i18n.getMessage(messageName, substitutionsOptional),
  () => messageName
    .replace(/_+/g, ' ').toLowerCase()
    .replace(/( |^)[a-z]/g, a => a.toUpperCase())
)

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/i18n/getUILanguage
export const getUILanguage = () => aid(() => i18n.getUILanguage())
