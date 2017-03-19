const defaultConfig = {
  api_src: 'google',
  custom_api: '',
  use_fab: true,
  auto_popup: false,
  use_fap: false,
}

export const settings = params => {
  const localStorage = browser.storage.local

  return ({
    set: cfg => localStorage.set(cfg),
    get: callback => localStorage.get(params).then(callback),

    remove: name => localStorage.remove(name),
    clear: () => localStorage.clear(),

    init() {
      this.get(cfg => {
        if (Object.keys(cfg).length > 0) return void 0
        this.set(defaultConfig)
      })
    },
    reset() {
      if (Object.keys(cfg).length <= 0) return void 0

      this.clear()
      this.init()
    },

    log() { this.get(cfg => console.table(cfg) ) },
  })
}

export default defaultConfig
