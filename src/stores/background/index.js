import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

if (module.hot) {
  module.hot.accept([
    './state',
    './mutations',
    './actions'
  ], () => {
    store.hotUpdate({
      state: require('./state'),
      mutations: require('./mutations'),
      actions: require('./actions')
    })
  })
}

export default store
