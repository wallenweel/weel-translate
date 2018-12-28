import Vue, { VueConstructor } from 'vue';

Vue.config.productionTip = false;

import VueMDCAdapter from 'vue-mdc-adapter';
Vue.use(VueMDCAdapter);

import GlobalComponents from '@/plugins/global-components';
Vue.use(GlobalComponents);

import i18n from '@/i18n';

import App from './Content.vue';

import browser from '@/apis/browser';
const port: RuntimePort = browser.runtime.connect({
  name: 'port-from-popup',
});

const app = new Vue({
  i18n,
  render: (h) => h(App as VueConstructor),
});

((isDevelopment) => {
  if (!isDevelopment) { app.$mount('#app'); return; }

  /** content shadow dom */
  const wrap = document.createElement('weel-translate-x');
  document.body.appendChild(wrap);

  const shadow = wrap.attachShadow({ mode: 'open' });
  shadow.appendChild(document.createElement('div'));

  ((flag: boolean) => {
    if (!flag && isDevelopment) { return; }
    for (const style of document.head.querySelectorAll('style')) {
      shadow.appendChild(style);
    }
  })(true);

  app.$mount(shadow.firstElementChild!);
})(RUNTIME_ENV === 'development');
