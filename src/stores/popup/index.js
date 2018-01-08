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

  keep_all: false,
  current_service_id: '',
  src_dest: ['', ''],
  input_text: '',
  result: {},
  translation_history: [],
  translation_collection: [],

  sources: {
    compiled: {},
    preset: {}
  },

  storageKeep: {
    local: ['result', 'input_text']
  },
  storage: {
    local: [
      'test',

      'keep_all',
      'translation_history',
      'current_service_id',
      'src_dest',

      'sources',
      // 'input_text',
      // 'result'

      'settings',
      'preferences',
      'translation_collection'
    ]
    // sync: [
    //   'settings',
    //   'preferences',
    //   'translation_collection'
    // ]
  },

  settings: {
    test: false
  },
  preferences: {}
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters: {
    visibleSourceIds: (state) => {
      return state.sources.visible
    },
    allSourceIds: (state) => {
      return Object.keys(state.sources.compiled)
    },
    currentSource: (state) => {
      return state.sources.compiled[state.current_service_id]
    },
    isPreStyle: (state) => {
      return state.preferences['v1_style'] || false
    }
  }
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
