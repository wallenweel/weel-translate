import Vue from 'vue'
import Vuex from 'vuex'
import * as mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export const state = {
  test: true,

  tmp: {
    sources: {
      history: [],
      items: [],
      editor_content: '',
      current_id: '',
      current_api: {},
      current_response: 'A translation is waiting for...',
      current_result: {},
      current_input: '',
      query_detail: '',
      compiled: {},
      preset: {}
    },
    templates: {
      compiled: {},
      preset: {}
    }
  },

  storage: {},
  sources: {},
  templates: {},

  editorContent: {
    api: '{}',

    template: `<!--parser {
  "phonetic_dest": "$0.translit",
  "translation": "$.sentences[0].trans",
  "explain": ["$1.pos", "$1.terms"],
  "variable": ["$.sentences[1]", "$.dict[0]"]
} -->

<!-- wtt: weel translate's template START-->
<wtt-container>
  <style>
    #demo-template-wrap {
      background: #f5f5f5;
    }
  </style>
  <div id="demo-template-wrap"></div>
</wtt-container>
<!-- wtt: weel translate's template END-->`
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
