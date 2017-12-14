import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations: {
    storageGet (state, payload = {}) {
      state.storage = payload
    }
  }
})
