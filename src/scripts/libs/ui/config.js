import { i18n } from '../functions'

const defaultConfig = {
  api_src: 'google',
  custom_api: '',
  use_fab: true,
  auto_popup: false,
  use_fap: false,
  auto_translate_selection: false,
  lang_from: {
    text: i18n.get('LANG_TRANS_EN'),
    value: 'en',
  },
  lang_to: {
    text: i18n.get('LANG_TRANS_ZH'),
    value: 'zh',
  },
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
      this.clear()
      this.init()
    },

    log() { this.get(cfg => console.table(cfg) ) },
  })
}

export default defaultConfig
