import { i18n } from './functions'

const defaultConfig = {
  version: '0.0.0',
  api_src: 'baidu',
  custom_api: '[{ "src": "youdao", "keyfrom": "", "key": "" }]',
  use_fab: true,
  check_aim_lang: false,
  auto_popup: false,
  use_fap: false,
  fab_hide_timeout: 1500,
  auto_translate_selection: false,
  context_menu_translate: true,
  lang_from: {
    text: i18n.get('LANG_TRANS_EN'),
    value: 'en',
  },
  lang_to: {
    text: i18n.get('LANG_TRANS_ZH'),
    value: 'zh',
  },
  fab_pos: 'text_bc',
  tts_volume: .65,
  tts_pitch: 1,
  tts_rate: 1,
  api_speaking: true,
  tmp: {},
  select_to_translate: false,
  // context_menu_translate_popup: false,
  api_google_src: 'cn',
}

export const settings = params => {
  const { storage, runtime } = browser
  const localStorage = storage.local

  return ({
    set: cfg => localStorage.set(cfg),
    get: callback => localStorage.get(params).then(callback),

    remove: name => localStorage.remove(name),
    clear: () => localStorage.clear(),

    init() {
      this.get(cfg => {
        const manifest = runtime.getManifest()
        const calc = (ver = '0.0.0') => ver.split(/\./).reduce((p, n) => (+p) + (+n), 0)

        if (calc(cfg.version) < calc(manifest.version)) {
          this.set({ version: manifest.version })

          Object.keys(defaultConfig).forEach(k => !Object.keys(cfg).includes(k) && this.set({ [k]: defaultConfig[k] }))
        }

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
