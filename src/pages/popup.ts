import Vue, { VueConstructor } from 'vue';

import VueMDCAdapter from 'vue-mdc-adapter';
Vue.use(VueMDCAdapter);

import MdcAdapterPatch from '@/plugins/mdc-adapter-patch';
Vue.use(MdcAdapterPatch);

import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false;

import router from '@/routers/popup';
import store from '@/stores/popup';

import App from './Popup.vue';

new Vue({
  router,
  store,
  render: (h) => h(App as VueConstructor),
}).$mount('#app');

// import debug from '@/functions/debug';
// debug.log(TARGET_BROWSER);
