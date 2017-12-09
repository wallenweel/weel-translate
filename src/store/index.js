import Vue from 'vue'
import Vuex from 'vuex'
import * as mutations from './mutations'

Vue.use(Vuex)

export const state = {
  count: 100
}

const store = new Vuex.Store({
  state,
  mutations
})

if (module.hot) {
  module.hot.accept([
    './mutations'
  ], () => {
    store.hotUpdate({
      mutations: require('./mutations')
    })
  })
}

export default store
