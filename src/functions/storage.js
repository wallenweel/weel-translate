import { storage } from '@/globals'
import { aid } from '@/functions/utils'

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/sync
export const sync = {
  set: keys => aid(() => storage.sync.set(keys)),
  get: keys => aid(
    () => storage.sync.get(keys),
    () => new Promise(() => {})
  )
}

// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/local
export const local = {
  set: keys => aid(() => storage.local.set(keys)),
  get: keys => aid(
    () => storage.local.get(keys),
    () => new Promise(() => {})
  )
}
