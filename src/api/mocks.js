export const storageSources = [
  // Google
  `{
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
    
    "include": ["zh", "jp"],
    
    "languages": [{
      "code": "zh-cn",
      "name": "Chinese Simplified",
      "locale": "中文(简体)"
    }, {
      "code": "jp",
      "name": "Japanese",
      "locale": "日文"
    }]
  }`
]

export const translatingResult = {
  certain: [{
    trans: ['结果', '答', '答案'],
    balabala: ['...']
  }, {
    phonetic: {
      us: '\'ɑːnsə',
      uk: '\'ɑnsə'
    },
    balabala: ['...']
  }],
  dict: {
    nested: [{
      explains: [
        'n. 工作；[物] 功；产品；操作；职业；行为；事业；工厂；著作；文学、音乐或艺术作品',
        'vt. 使工作；操作；经营；使缓慢前进',
        'vi. 工作；运作；起作用',
        'n. （英、埃塞）沃克（人名）'
      ],
      balabala: ['...']
    }, {}, []]
  }
}
