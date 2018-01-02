import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import * as mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters: {
    currentSource: (state) => {
      return state.sources.compiled[state['current_service_id']]
    }
  }
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
