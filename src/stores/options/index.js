import Vue from 'vue'
import Vuex from 'vuex'
import * as mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export const state = {
  test: true,

  result: {
    phonetic: {}
  }, // parsed translating result

  drawerNavigationToggle: false,
  currentSource: {},

  storage: {},
  api: {},
  settings: {
    test: false
  },
  preferences: {},

  sources: {}
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
