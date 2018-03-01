import apiGoogle from '@/api/google'
import apiGoogleCN from '@/api/google_cn'
import apiYoudao from '@/api/youdao'

import tplDefault from '@/templates/vue-like/default'

const __ = {}

__['test'] = {
  compiled: {},
  preset: {
    a: 'a'
  }
}

__['initialized'] = false

__['storage'] = {
  local: [
    'test',
    'keep_all',
    'translation_history',

    // `storage.set` does not support nested object
    // 'sources.preset',
    // 'sources.visible',
    // 'templates.preset',
    'sources',
    'templates',

    'current_service_id',
    'current_template_id',
    'src_dest',
    'input_text',
    'result',

    'settings',
    'preferences',
    'translation_collection'
  ]
  // sometimes has wrong because use sync storageArea
  // sync: [
  //   'settings',
  //   'preferences',
  //   'translation_collection'
  // ]
}

__['keep_all'] = false
__['current_service_id'] = ''
__['current_template_id'] = 'default'
__['src_dest'] = ['', '']
__['input_text'] = ''

__['result'] = {}
__['translation_history'] = []
__['translation_collection'] = []

// NOTICE: here api has all presets compiled result
// do not store it, because it contains Storage rejected
// types e.g. <function>
__['api'] = {}
__['currentSource'] = {}

// mostly UI relatived
__['settings'] = {
  use_fab: true,
  use_fap: true,
  use_context_menu: true,
  // "float" or "popup"
  context_menu_way: 'float',
  browser_action_translate: false,
  selection_translate: false,

  use_phonetic_src: true,
  use_phonetic_dest: true,

  use_content_script: true,
  enable_iframe: false,

  // (s) * 1000
  timeout: 20
}

__['preferences'] = {
  dark: false,
  v1_style: false,
  // 0: selection, 1: follow mouse
  float_button_position: 0,
  // 0: selection, 1: follow fab, 2: right bottom
  float_panel_position: 0
}

__['sources'] = {
  visible: ['google_cn', 'google', 'youdao'],
  compiled: {},
  preset: {
    'google_cn': apiGoogleCN,
    'google': apiGoogle,
    'youdao': apiYoudao
  }
}

__['templates'] = {
  compiled: {
    default: {
      parser: {
        google: () => {},
        google_cn: () => {}
      },
      template: ``,
      style: ``
    }
  },
  preset: {
    'default': tplDefault
  }
}

export default __
