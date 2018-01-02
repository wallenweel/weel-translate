// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.min.css'

import router from '@/routers/popup'
import store from '@/stores/popup'
import WebExtUtils from '@/plugins/WebExtUtils'
import { vuetify } from '@/globals'
import { generateStorageWatchers } from '@/functions/utils'

import App from './App'
import {
  INITIAL_FROM_BACKGROUND,
  UPDATE_STORAGE_STATE
} from '@/types'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(Vuetify, vuetify)

Vue.use(WebExtUtils)

;(async () => [await store.dispatch(INITIAL_FROM_BACKGROUND)])()
.then(([success]) => {
  if (!success) return false

  generateStorageWatchers(store, (type, key, value) =>
  typeof store.dispatch(UPDATE_STORAGE_STATE, { type, key, value }))
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
  components: { App }
})
