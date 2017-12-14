import Vue from 'vue'
import Vuex from 'vuex'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

export const config = {
  local: {
    sources: [
      // Google
      `{
        "id": "google"
      }`
    ]
  },
  sync: {}
}

export const state = {
  count: 100,
  drawerOpened: null,
  ...config
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
