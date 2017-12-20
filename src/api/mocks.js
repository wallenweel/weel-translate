export const google = {
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

export const actions = {}
actions['INITIAL_FROM_BACKGROUND'] = {
  storage: {
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
  },
  current_service_id: 'google_cn',
  api: {
    'google_cn': {
      languages: [
        { 'code': 'auto', 'name': 'Automatic', 'locale': '自动' },
        { 'code': 'zh-cn', 'name': 'Chinese Simplified', 'locale': '中文 简体' },
        { 'code': 'en', 'name': 'English', 'locale': '英语' }
      ],
      'id': 'google',
      'name': 'Google com',
      'icon': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAAHnSURBVEhLtZU9S8NAGMeTilVBBMUWQXCx0DpZ5+qi7gqufgLBXb+IOghOWhVFXC2uLjo4iIWKgzoIHYQivoGk/i73JCVt3mjwB3+eu+ftklxyMf4bU2wozWYzjSYZjiFVU0cPqVTqB9s9lmWVUBm9s4AHfF/oFM1LenwoyqIT6RWJWggzKuXhkJxHT7o0PtTsSQsPnj0gKYO5MU1zQns01H9iLlEVWaiAFskbxKp4hfEyUnnByK26MFdsM+y4ffwjaBedoz5xB0NSSbfVMFesSzgQUntkGA7Nyrq1hvmBhJJDvzQN3VdRXTqo9z4x9ibTbIoNurc9wBq3fEQzMvVAbEOGgZDzTH3rCbDAvLpyB+ZlCXUgKaFQfyfpRkpsO7GOkBD6xboLvIp1yIvtloZYvQDP/5E7+7A9mumgTSZvyEdLEnaoiW1Bw0MSXZjvSygS0o91lYbaNQm1wD9LwNIp7qsa+aGRsyolNsy/MepY74Sg31GxxdDvqBhAm+hXZ2uY70iKTfthl8Vcsyd+h10FVYmZzNX+LDAcVnEH/C+YIt/Am/b4QFKBhbo5ruuYorQJh+QMOtOl0ZB7hXJSHh+K5tARakgvF3zql3mBVpgGfbDxvlga9KIcz3xcNcelfvq1xD/95BjGH64vwr9Y/F6UAAAAAElFTkSuQmCC'
    }
  },
  settings: {
    test: false
  },
  preferences: {
    dark: false
  },
  sources: {
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
  
        "url": "https://translate.google.cn",
  
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
}

actions['REQUEST_TRANSLATION'] = {
  phonetic: {
    src: '\'ɑːnsə'
  },
  translation: '结果',
  explain: [
    'n. 工作；[物] 功；产品；操作；职业；行为；事业；工厂；著作；文学、音乐或艺术作品',
    'vt. 使工作；操作；经营；使缓慢前进',
    'vi. 工作；运作；起作用'
  ],
  foo () {}
}

export const response = `{"sentences":[{"trans":"你好","orig":"hello","backend":1},{"translit":"Nǐ hǎo","src_translit":"heˈlō,həˈlō"}],"dict":[{"pos":"感叹词","terms":["你好!","喂!"],"entry":[{"word":"你好!","reverse_translation":["Hello!","Hi!","Hallo!"],"score":0.13323711},{"word":"喂!","reverse_translation":["Hey!","Hello!"],"score":0.020115795}],"base_form":"Hello!","pos_enum":9}],"src":"en","alternative_translations":[{"src_phrase":"hello","alternative":[{"word_postproc":"你好","score":1000,"has_preceeding_space":true,"attach_to_next_token":false},{"word_postproc":"您好","score":1000,"has_preceeding_space":true,"attach_to_next_token":false}],"srcunicodeoffsets":[{"begin":0,"end":5}],"raw_src_segment":"hello","start_pos":0,"end_pos":0}],"confidence":1,"ld_result":{"srclangs":["en"],"srclangs_confidences":[1],"extended_srclangs":["en"]},"synsets":[{"pos":"名词","entry":[{"synonym":["howdy","hullo","hi","how-do-you-do"],"definition_id":""}],"base_form":"hello"},{"pos":"惊叹词","entry":[{"synonym":["hi","howdy","hey","hiya","ciao","aloha"],"definition_id":"m_en_us1254307.001"}],"base_form":"hello"}],"definitions":[{"pos":"名词","entry":[{"gloss":"an utterance of “hello”; a greeting.","definition_id":"m_en_us1254307.006","example":"she was getting polite nods and hellos from people"}],"base_form":"hello"},{"pos":"惊叹词","entry":[{"gloss":"used as a greeting or to begin a telephone conversation.","definition_id":"m_en_us1254307.001","example":"hello there, Katie!"}],"base_form":"hello"},{"pos":"动词","entry":[{"gloss":"say or shout “hello”; greet someone.","definition_id":"m_en_us1254307.007","example":"‘Hi Kirsten,’ he helloed , obviously calling me Kirsten on purpose."}],"base_form":"hello"}],"examples":{"example":[{"text":"I thought it summed up what I wanted to say and it also is a way to say \u003cb\u003ehello\u003c/b\u003e !","source_type":3,"definition_id":"m_en_us1254307.001"},{"text":"I have wanted to re-watch it like a DVD or something, but I couldn't because, \u003cb\u003ehello\u003c/b\u003e !","source_type":3,"definition_id":"m_en_us1254307.005"},{"text":"\u003cb\u003ehello\u003c/b\u003e, is anybody in?","source_type":3,"definition_id":"neid_9508"},{"text":"We didn't get the chance to get together this visit, but we had nice phone conversation and a waved \u003cb\u003ehello\u003c/b\u003e .","source_type":3,"definition_id":"m_en_us1254307.006"},{"text":"\u003cb\u003ehello\u003c/b\u003e, what's all this then?","source_type":3,"definition_id":"m_en_gb0372340.002"},{"text":"Like we have time for a life - \u003cb\u003ehello\u003c/b\u003e !","source_type":3,"definition_id":"m_en_us1254307.005"},{"text":"\u003cb\u003ehello\u003c/b\u003e there, Katie!","source_type":3,"definition_id":"m_en_us1254307.001"},{"text":"But instead of a normal greeting like saying \u003cb\u003ehello\u003c/b\u003e or something, they hugged.","source_type":3,"definition_id":"m_en_us1254307.001"},{"text":"They sit in classrooms and cannot hear the teachers so, \u003cb\u003ehello\u003c/b\u003e , it is no surprise that we are unable to get good outcomes from our education system.","source_type":3,"definition_id":"m_en_us1254307.005"},{"text":"I mean, it's nice in the way he wants to serve my sexual needs, but \u003cb\u003ehello\u003c/b\u003e !","source_type":3,"definition_id":"m_en_us1254307.005"},{"text":"\u003cb\u003ehello\u003c/b\u003e, what's all this then?","source_type":3,"definition_id":"m_en_us1254307.003"},{"text":"I said \u003cb\u003ehello\u003c/b\u003e to him","source_type":3,"definition_id":"neid_9507"},{"text":"She is living a more fortunate life than (most of) you, \u003cb\u003ehello\u003c/b\u003e ?","source_type":3,"definition_id":"m_en_us1254307.005"},{"text":"So Bob, if you are out there, drop in and say \u003cb\u003ehello\u003c/b\u003e !","source_type":3,"definition_id":"m_en_us1254307.001"},{"text":"With little more than a \u003cb\u003ehello\u003c/b\u003e , I began to reread the letter that was in my hand.","source_type":3,"definition_id":"m_en_us1254307.006"},{"text":"She whispered \u003cb\u003ehello\u003c/b\u003e , then began to make her way to her room, where she hoped to take a nap.","source_type":3,"definition_id":"m_en_us1254307.001"},{"text":"Umm… \u003cb\u003ehello\u003c/b\u003e , the world just ended, everyone seems bizarrely unaffected, like the predicted deep freeze has already reached their brains.","source_type":3,"definition_id":"m_en_us1254307.005"},{"text":"Ships' horns toot, children wave and call \u003cb\u003ehello\u003c/b\u003e , and every morning you're awakened by the haunting call of the muezzin from some distant village mosque.","source_type":3,"definition_id":"m_en_us1254307.001"},{"text":"It was a pleasant surprise when Sheila Sheridan came over to say \u003cb\u003ehello\u003c/b\u003e .","source_type":3,"definition_id":"m_en_us1254307.001"},{"text":"If you haven't met Joy yet, pop over to her site and say \u003cb\u003ehello\u003c/b\u003e !","source_type":3,"definition_id":"m_en_us1254307.001"},{"text":"She must have been really stupid to have mimicked me… I mean, \u003cb\u003ehello\u003c/b\u003e !","source_type":3,"definition_id":"m_en_us1254307.005"},{"text":"Excuse him for picking that awful blue hue - I had always told him to let me pick the color to match with his chestnut-blondish hair, but \u003cb\u003ehello\u003c/b\u003e !","source_type":3,"definition_id":"m_en_us1254307.005"},{"text":"\u003cb\u003ehello\u003c/b\u003e! did you even get what the play was about?","source_type":3,"definition_id":"m_en_us1254307.005"},{"text":"A man standing in line at the check-out counter of a grocery store was surprised when an attractive woman behind him said \u003cb\u003ehello\u003c/b\u003e .","source_type":3,"definition_id":"m_en_us1254307.001"},{"text":"He was a little surprised since he had already said \u003cb\u003ehello\u003c/b\u003e to her that morning.","source_type":3,"definition_id":"m_en_us1254307.001"},{"text":"I was stunned and I said I'm surprised anyone says \u003cb\u003ehello\u003c/b\u003e to me ever in the mall or in the store after reading that.","source_type":3,"definition_id":"m_en_us1254307.001"},{"text":"It is extraordinary how much can be achieved when you put enthusiasm into a routine task, a special project or a simple \u003cb\u003ehello\u003c/b\u003e or conversation.","source_type":3,"definition_id":"m_en_us1254307.006"},{"text":"Over the last two days I have been flooded with porn site IMs… \u003cb\u003ehello\u003c/b\u003e !","source_type":3,"definition_id":"m_en_us1254307.005"},{"text":"Okay, so maybe costs rose by more than 1% in that period, and maybe sales dropped earlier in the year, but \u003cb\u003ehello\u003c/b\u003e !","source_type":3,"definition_id":"m_en_us1254307.005"},{"text":"Logan didn't say \u003cb\u003ehello\u003c/b\u003e , but I hadn't expected a greeting.","source_type":3,"definition_id":"m_en_us1254307.001"}]},"related_words":{"word":["Hello!","say hello"]}}`
