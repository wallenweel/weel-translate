import apiGoogle from '@/api/google'
import apiGoogleCN from '@/api/google_cn'
import apiYoudao from '@/api/youdao'

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
    'sources.preset',
    'sources.visible',
    'templates.preset',
    'current_service_id',
    'current_template_id',
    'src_dest',
    'input_text',
    'result'
  ],
  sync: [
    'settings',
    'preferences',
    'translation_collection'
  ]
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
  selection_translate: false
}

__['preferences'] = {
  dark: false
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
    'default': `
<parser>
{
  "google|google_cn": {
    "phonetic_src": "sentences.$.src_translit",
    "phonetic_dest": "sentences.$.translit",
    "translation": "sentences(trans)",
    "explain": "dict(pos////terms)"
  }
}
</parser>
<template>
<div>
  <div class="weel-fab" ref="fab" v-if="useFAB"
    @click.stop.prevent="handleFAB"
    @mouseup.prevent.stop="ev => ev.target.removeAttribute('data-mousedown')"
    @mousedown.prevent.stop="ev => ev.target.setAttribute('data-mousedown', true)"
  >
    <transition name="bounce">
      <button v-show="fabShow">
        <i class="weel-svg-icons -weel-translate -icon"></i>
      </button>
    </transition>
  </div>
  
  <div class="weel-fap" ref="fap" v-if="useFAP"
    @mouseup.prevent.stop="ev => ev.target.removeAttribute('data-mousedown')"
    @mousedown.prevent.stop="ev => ev.target.setAttribute('data-mousedown', true)"
  >
    <transition name="fade">
      <div v-show="fapShow">
        <div class="-phonetic" v-show="getResult.phonetic_src">
          <button class="-js" @click="handleVoice('src')">
            <i class="weel-svg-icons -volume-high -icon"></i>
          </button>
          {{getResult.phonetic_src}}      
        </div>
        <div class="-phonetic" v-show="getResult.phonetic_dest">
          <button class="-js" @click="handleVoice('dest')">
            <i class="weel-svg-icons -volume-high -icon"></i>
          </button>
          {{getResult.phonetic_dest}}
        </div>
        <div class="-translation">
          <button class="-js -copy">
            <i class="weel-svg-icons -content-copy -icon"></i>
          </button>
          {{getResult.translation}}
        </div>
        <div class="-explain" v-show="getResult.explain">
          <pre>{{getResult.explain}}</pre>
        </div>
      </div>
    </transition>
  </div>
</div>
</template>
<script>
({ mapState }) => ({
  
})
</script>
<style scoped="data-weel-translate"></style>
`
  }
}

export default __
