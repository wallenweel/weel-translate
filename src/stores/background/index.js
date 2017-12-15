import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import * as mutations from './mutations'
import { storage } from '@/globals'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions: {
    initial ({ state, commit }) {
      storage.sync.get(state.inStorage).then(all => {
        // merge storage to state
        commit('mergeStorageToState', all)

        // set success status
        state.initialized = true
      }, () => {
        // set success status
        state.initialized = false
      })
    }
  }
})
