import Vue from 'vue'
import Vuex from 'vuex'
import * as mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export const state = {
  test: true,

  tmp: {
    sources: {
      alert: [false, '...'],
      save: false,
      history: {},
      items: [],
      current_id: '',
      current_api: {},
      current_response: 'A translation is waiting for...',
      current_result: {},
      current_input: '',
      src_dest: ['', ''],
      query_detail: '',
      compiled: {},
      preset: {}
    },
    templates: {
      compiled: {},
      preset: {}
    }
  },

  globalTip: [false, '...'],

  storage: {
    local: [
      'sources'
    ]
  },

  sources: {
    preset: {}
  },
  templates: {
    preset: {}
  }
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
