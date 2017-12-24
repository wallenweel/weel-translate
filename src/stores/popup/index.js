import Vue from 'vue'
import Vuex from 'vuex'
import * as mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export const state = {
  test: true,

  globalTip: [false, '...'],
  drawerNavigationToggle: false,
  currentSource: {},

  current_service_id: '',
  src_dest: ['', ''],
  input_text: '',
  result: {},
  translation_history: [],
  translation_collection: [],

  storage: {},
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
