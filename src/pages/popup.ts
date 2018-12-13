import Vue, { VueConstructor } from 'vue';
import App from './Popup.vue';
import router from '@/routers/popup';
import store from '@/stores/popup';

import 'material-design-icons-iconfont/dist/material-design-icons.css';

import MdcAdapterPatch from '@/plugins/mdc-adapter-patch';
Vue.use(MdcAdapterPatch);
import VueMDCDrawer from 'vue-mdc-adapter/dist/drawer';
Vue.use(VueMDCDrawer);

import VueMDCAdapter from 'vue-mdc-adapter';
Vue.use(VueMDCAdapter);

import debug from '@/functions/debug';
// debug.log(TARGET_BROWSER);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App as VueConstructor),
}).$mount('#app');
