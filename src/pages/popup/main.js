// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import router from '@/router'
import store from '@/stores/popup'
import WebExtUtils from '@/plugins/WebExtUtils'
import 'material-design-icons/iconfont/material-icons.css'
import 'vuetify/dist/vuetify.min.css'
import App from './App'
import {
  POPUP_PAGE_INITIAL
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

;(async () => [await store.dispatch(POPUP_PAGE_INITIAL)])()
.then(([success]) => {
  if (!success) return false

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App),
    components: { App }
  })
})
