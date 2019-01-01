import Vue, { VueConstructor } from 'vue';

Vue.config.productionTip = false;

import VueMDCAdapter from 'vue-mdc-adapter';
Vue.use(VueMDCAdapter);

import MdcAdapterPatch from '@/plugins/mdc-adapter-patch';
Vue.use(MdcAdapterPatch);

import GlobalComponents from '@/plugins/global-components';
Vue.use(GlobalComponents);

import Scrollbar from '@/plugins/scrollbar';
Vue.use(Scrollbar);

import router from '@/routers/options';
// import store from '@/stores/options';
import i18n from '@/i18n';

import App from './Options.vue';

import browser from '@/apis/browser';
const port: RuntimePort = browser.runtime.connect({
  name: 'port-from-options',
});

// store.dispatch('init', { port }).then(() => {
//   i18n.locale = store.getters.locale;
//   store.watch(() => store.getters.locale, () => {
//     i18n.locale = store.getters.locale;
//   });
// });

new Vue({
  router,
  // store,
  i18n,
  render: (h) => h(App as VueConstructor),
}).$mount('#app');

// import debug from '@/functions/debug';
// debug.log(TARGET_BROWSER);
