export const settings = {}

export const preferences = {}

export const translation = {
  history: [],
  collection: []
}

export const sources = {
  api: {},
  preset: {}
}

sources.preset.google = `{
  "id": "google",
  "name": "Google",
  "icon": "base64:",

  "url": "https://translate.google.com",

  "trans": {
    "url": "{{url}}",
    "params": [
      ["q", "{{q}}", "default"],
      ["from", "{{from}}", "en"],
      ["to", "{{to}}", "zh"],

      ["key", "d5sa4ea9jr"],
      ["else", "something"]
    ]
  },

  "voice": [],
  
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

export default {
  began: false,

  settings,
  preferences,
  translation,
  sources
}
