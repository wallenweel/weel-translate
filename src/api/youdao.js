export default
`{
  "id": "youdao",
  "name": "YouDao",
  "icon": "",

  "host": "http://fanyi.youdao.com",

  "response": {
    "type": "json"
  },

  "query": {
    "text": {
      "method": "POST",
      "url": "{{host}}/translate",
      "params": [
        ["i", "{{q}}"],
        ["from", "{{from}}"],
        ["to", "{{to}}"],
        ["smartresult", ["dict", "rule", "ugc"]],
        ["client", "fanyideskweb"],
        ["doctype", "json"],
        ["version", "2.1"],
        ["keyfrom", "fanyi.web"],
        ["typoResult", "false"]
      ]
    },
    "audio": {
      "method": "GET",      
      "url": "{{host}}/translate_tts",
      "params": [
        ["q", "{{q}}"],
        ["tl", "{{from}}"],
        ["client", "gtx"],
        ["ie", "UTF-8"]
      ]
    }
  },

  "parser": {
    "phonetic_src": "/*no support*/",
    "phonetic_dest": "/*no support*/",
    "translation": "translateResult(0.tgt)"
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
