import Vue from 'vue'
import Vuex from 'vuex'
import * as mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export const state = {
  test: true,
  tmp: {
    history: [],
    collection: []
  },

  globalTip: [false, '...'],
  maxHistory: 20,
  drawerNavigationToggle: false,
  currentCollected: false,
  currentSource: {},

  keep_all: false,
  current_service_id: '',
  src_dest: ['', ''],
  input_text: '',
  result: {},
  translation_history: [],
  translation_collection: [],

  storageKeep: {
    local: ['result', 'input_text']
  },
  storage: {
    local: [
      'test',
      'keep_all',
      'translation_history',
      'current_service_id',
      'src_dest'
      // 'input_text',
      // 'result'
    ],
    sync: [
      'settings',
      'preferences',
      'translation_collection'
    ]
  },

  api: {},
  settings: {
    test: false
  },
  preferences: {}
}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

if (module.hot) {
  module.hot.accept([
    './mutations',
    './actions'
  ], () => {
    store.hotUpdate({
      mutations: require('./mutations'),
      actions: require('./actions')
    })
  })
}

export default store
