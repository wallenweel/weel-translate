import Vue from 'vue'
import Vuex from 'vuex'

import * as mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export const state = {
  test: false,

  container: null, // container element of float action
  targets: [], // contains all <v> tag's details

  current_template_id: 'default'
}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export default store
