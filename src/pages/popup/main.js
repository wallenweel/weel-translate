// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

import 'material-design-icons/iconfont/material-icons.css'
import 'vuetify/dist/vuetify.min.css'

import router from '@/router'
import store from '@/stores/popup'
import WebExtUtils from '@/plugins/WebExtUtils'
import { generateWatchers } from '@/functions/utils'

import App from './App'
import {
  INITIAL_FROM_BACKGROUND,
  UPDATE_STORAGE_STATE
} from '@/types'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(Vuetify, {
  theme: {
    primary: '#2196F3',
    secondary: '#1976D2',
    accent: '#FF9800',
    error: '#FF5722'
  }
})

Vue.use(WebExtUtils)

;(async () => [await store.dispatch(INITIAL_FROM_BACKGROUND)])()
.then(([success]) => {
  if (!success) return false

  generateWatchers(store, (type, key) =>
    typeof store.dispatch(UPDATE_STORAGE_STATE, { type, key }))

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App),
    components: { App }
  })
})
