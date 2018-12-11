import Vue, { VueConstructor } from 'vue';
import VueMDCAdapter from 'vue-mdc-adapter';
import App from './Popup.vue';
import router from '@/routers/popup';
import store from '@/stores/popup';

import 'material-design-icons-iconfont/dist/material-design-icons.css';

// import debug from '@/functions/debug';
// debug.log(TARGET_BROWSER);

Vue.config.productionTip = false;

Vue.use(VueMDCAdapter);

new Vue({
  router,
  store,
  render: (h) => h(App as VueConstructor),
}).$mount('#app');

