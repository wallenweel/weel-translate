import * as config from './libs/ui/config'

const localStorage = browser.storage.local.get()

localStorage.then(cfg => {
  if (Object.keys(cfg).length > 0) return void 0

  browser.storage.local.set(config)
})
