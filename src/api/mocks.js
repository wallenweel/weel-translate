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
  ]
}
