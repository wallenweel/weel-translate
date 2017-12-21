const __ = {}

__['test'] = true

__['initialized'] = false
// __['initialized'] = {
//   storageSync: false,
//   storageLocal: false
// }

__['storage'] = {
  local: [
    'test',
    'translation_history',
    'sources',
    'current_service_id'
  ],
  sync: [
    'settings',
    'preferences',
    'translation_collection'
  ]
}

__['current_service_id'] = ''

__['translation_history'] = []

__['translation_collection'] = []

// contains Storage rejected
// types e.g. <function>
__['api'] = {}

__['settings'] = {
  foo: false,
  test: false
}

__['preferences'] = {
  test: false,
  dark: false
}

__['sources'] = {
  preset: {
    'google_cn': `["google", {
      "id": "google_cn",
      "name": "Google cn",
      "url": "https://translate.google.cn",
      "include": ["auto", "zh-cn", "en"],
      "languages": []
    }]`,
    'google': `{
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
        "phonetic": {
          "src": "$0.src_translit",
          "des": "$0.translit"
        },
        "translation": "$.sentences[0].trans",
        "explain": ["$1.pos", "$1.terms"],
        "variable": ["$.sentences[1]", "$.dict[0]"]
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
    }`
  }
}

__['templates'] = {
  'float-result-panel': `
  <!--Parser
  {
    "phonetic_dest": "$0.translit",
    "translation": "$.sentences[0].trans",
    "explain": ["$1.pos", "$1.terms"],
    "variable": ["$.sentences[1]", "$.dict[0]"]
  }
  -->

  <!-- wtt: weel translate's template START-->
  <wtt-container>
    <style>
      #weel-translate-frp {
        background: #666666;
        // height: 100px;
        // width: 100px;
      }
    </style>
    <div id="weel-translate-frp">
      <div>P: {{phonetic_dest}}</div>
      <div>T: {{translation}}</div>
      <div>E: {{explain}}</div>
    </div>
  </wtt-container>
  <!-- wtt: weel translate's template END-->
  `
}

export default __
