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

__['settings'] = {
  use_fab: true,
  use_fap: true
}

__['preferences'] = {
  dark: false
}

__['sources'] = {
  compiled: {},
  preset: {
    'google_cn': `
["google", {
  "id": "google_cn",
  "name": "Google cn",
  "url": "https://translate.google.cn",
  "include": ["auto", "zh-cn", "en"],
  "languages": []
}]
    `,
    'google': `
{
  "id": "google",
  "name": "Google com",
  "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAAHnSURBVEhLtZU9S8NAGMeTilVBBMUWQXCx0DpZ5+qi7gqufgLBXb+IOghOWhVFXC2uLjo4iIWKgzoIHYQivoGk/i73JCVt3mjwB3+eu+ftklxyMf4bU2wozWYzjSYZjiFVU0cPqVTqB9s9lmWVUBm9s4AHfF/oFM1LenwoyqIT6RWJWggzKuXhkJxHT7o0PtTsSQsPnj0gKYO5MU1zQns01H9iLlEVWaiAFskbxKp4hfEyUnnByK26MFdsM+y4ffwjaBedoz5xB0NSSbfVMFesSzgQUntkGA7Nyrq1hvmBhJJDvzQN3VdRXTqo9z4x9ibTbIoNurc9wBq3fEQzMvVAbEOGgZDzTH3rCbDAvLpyB+ZlCXUgKaFQfyfpRkpsO7GOkBD6xboLvIp1yIvtloZYvQDP/5E7+7A9mumgTSZvyEdLEnaoiW1Bw0MSXZjvSygS0o91lYbaNQm1wD9LwNIp7qsa+aGRsyolNsy/MepY74Sg31GxxdDvqBhAm+hXZ2uY70iKTfthl8Vcsyd+h10FVYmZzNX+LDAcVnEH/C+YIt/Am/b4QFKBhbo5ruuYorQJh+QMOtOl0ZB7hXJSHh+K5tARakgvF3zql3mBVpgGfbDxvlga9KIcz3xcNcelfvq1xD/95BjGH64vwr9Y/F6UAAAAAElFTkSuQmCC",

  "url": "https://translate.google.com",

  "query": {
    "text": {
      "url": "{{url}}/translate_a/single",
      "params": [
        ["q", "{{q}}"],
        ["sl", "{{from}}"],
        ["tl", "{{to}}"],
        ["hl", "{{to}}"],
        ["client", "gtx"],
        ["ie", "UTF-8"],
        ["oe", "UTF-8"],
        ["dt", ["at" ,"bd" ,"ex" ,"ld" ,"md" ,"qca" ,"rw" ,"rm" ,"ss" ,"t"]],
        ["dj", "1"],
        ["source", "icon"]
      ]
    },
    "audio": {
      "url": "{{url}}/translate_tts",
      "params": [
        ["q", "{{q}}"],
        ["tl", "{{from}}"],
        ["client", "gtx"],
        ["ie", "UTF-8"]
      ]
    }
  },

  "parser": {
    "phonetic_src": "sentences.$.src_translit",
    "phonetic_dest": "sentences.$.translit",
    "translation": "sentences(trans)",
    "explain": "dict(pos////terms)"
  },

  "template": {
    "popup": "default",
    "content": "default"
  },

  "include": ["auto", "en", "iw"],

  "languages": [{
    "code": "zh-cn",
    "name": "Chinese Simplified",
    "trans": "中文(简体)"
  }, {
    "code": "jp",
    "name": "Japanese",
    "trans": "日文"
  }]
}
    `
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
        <div class="-phonetic">
          <button class="-js">
            <i class="weel-svg-icons -volume-high -icon"></i>
          </button>
          {{getResult.phonetic_src}}      
        </div>
        <div class="-phonetic">
          <button class="-js">
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
        <div class="-explain">
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
