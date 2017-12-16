const __ = {}

__['initialized'] = false

__['inStorage'] = [
  'settings',
  'preferences',
  'translation',
  'sources'
]

__['api'] = {}

__['settings'] = {
  foo: false
}

__['preferences'] = {}

__['translation'] = {
  history: [],
  collection: []
}

__['sources'] = {
  preset: {
    'google.cn': `["google", {
      "url": "https://translate.google.cn"
    }]`,
    'google': `{
      "id": "google",
      "name": "Google",
      "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAAHnSURBVEhLtZU9S8NAGMeTilVBBMUWQXCx0DpZ5+qi7gqufgLBXb+IOghOWhVFXC2uLjo4iIWKgzoIHYQivoGk/i73JCVt3mjwB3+eu+ftklxyMf4bU2wozWYzjSYZjiFVU0cPqVTqB9s9lmWVUBm9s4AHfF/oFM1LenwoyqIT6RWJWggzKuXhkJxHT7o0PtTsSQsPnj0gKYO5MU1zQns01H9iLlEVWaiAFskbxKp4hfEyUnnByK26MFdsM+y4ffwjaBedoz5xB0NSSbfVMFesSzgQUntkGA7Nyrq1hvmBhJJDvzQN3VdRXTqo9z4x9ibTbIoNurc9wBq3fEQzMvVAbEOGgZDzTH3rCbDAvLpyB+ZlCXUgKaFQfyfpRkpsO7GOkBD6xboLvIp1yIvtloZYvQDP/5E7+7A9mumgTSZvyEdLEnaoiW1Bw0MSXZjvSygS0o91lYbaNQm1wD9LwNIp7qsa+aGRsyolNsy/MepY74Sg31GxxdDvqBhAm+hXZ2uY70iKTfthl8Vcsyd+h10FVYmZzNX+LDAcVnEH/C+YIt/Am/b4QFKBhbo5ruuYorQJh+QMOtOl0ZB7hXJSHh+K5tARakgvF3zql3mBVpgGfbDxvlga9KIcz3xcNcelfvq1xD/95BjGH64vwr9Y/F6UAAAAAElFTkSuQmCC",

      "url": "https://translate.google.com",

      "query": {
        "text": {
          "url": "{{url}}",
          "params": [
            ["q", "{{q}}"],
            ["sl", "{{from}}"],
            ["tl", "{{to}}"],
            ["hl", "{{to}}"],
            ["client", "gtx"],
            ["ie", "UTF-8"],
            ["oe", "UTF-8"],
            ["dt", "at"],
            ["dt", "bd"],
            ["dt", "ex"],
            ["dt", "ld"],
            ["dt", "md"],
            ["dt", "qca"],
            ["dt", "rw"],
            ["dt", "rm"],
            ["dt", "ss"],
            ["dt", "t"],
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
          "us": "$1.phonetic.us",
          "uk": "$1.phonetic.uk"
        },
        "translation": ["$0.trans[0]", "$0.trans[2]"],
        "explain": "$.dict.nested[0].explains",
        "variable": ["$.certain[0]", "$.certain[1]"]
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

export default __
