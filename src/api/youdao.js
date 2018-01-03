export default
`{
  "id": "youdao",
  "name": "网易·有道",
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
      "url": "https://dict.youdao.com/dictvoice",
      "params": [
        ["audio", "{{q}}"],
        ["type", "1"]
      ]
    }
  },

  "parser": {
    "phonetic_src": "/*only voice*/",
    "phonetic_dest": "/*unsupport*/",
    "translation": "translateResult(0.tgt)"
  },

  "fromto": ["AUTO", "AUTO"],

  "include": ["auto:>AUTO", "zh-cn:>zh-CHS", "en", "ja"]
}`
