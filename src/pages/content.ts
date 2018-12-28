import Vue, { VueConstructor } from 'vue';

Vue.config.productionTip = false;

import VueMDCAdapter from 'vue-mdc-adapter';
Vue.use(VueMDCAdapter);

import GlobalComponents from '@/plugins/global-components';
Vue.use(GlobalComponents);

import store from '@/stores/content';
import i18n from '@/i18n';

import App from './Content.vue';

import browser from '@/apis/browser';
const port: RuntimePort = browser.runtime.connect({
  name: 'port-from-content',
});

store.dispatch('init', { port }).then(() => {
  i18n.locale = store.getters.locale;
  store.watch(() => store.getters.locale, () => {
    i18n.locale = store.getters.locale;
  });
});

const app = new Vue({
  store,
  i18n,
  render: (h) => h(App as VueConstructor),
});

import debug from '@/functions/debug';

document.addEventListener('selectionchange', ({ currentTarget }) => {
  const selection: Selection | null = (currentTarget as Document).getSelection();

  if (!selection) { return; }

  store.dispatch('selection', selection.toString().trim());
});

((isDevelopment) => {
  if (isDevelopment) { app.$mount('#app'); return; }

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
