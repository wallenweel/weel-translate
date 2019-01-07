import Vue, { VueConstructor } from 'vue';
import { isDebug, extensionTagName } from '@/variables';
import debug from '@/functions/debug';

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

  const app = new Vue({
    store,
    i18n,
    render: (h) => h(App as VueConstructor),
  });

  document.addEventListener('selectionchange', ({ currentTarget }) => {
    const selection: Selection | null = (currentTarget as Document).getSelection();

    if (!selection) { return; }

    store.dispatch('selection', selection);
  });

  const container = document.createElement(extensionTagName);
  const exsited: HTMLElement | null = document.querySelector(extensionTagName);

  if (!!exsited) { document.body.removeChild(exsited); }
  document.body.appendChild(container);

  const mount = document.createElement('div');

  ((flag) => {
    if (!flag) { return; }

    container.appendChild(mount);
    app.$mount(mount);

    const p = document.createElement('p');
    // tslint:disable-next-line:max-line-length
    p.textContent = `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut, est cumque saepe sint sed vero ipsa repellat quidem quae eius quod quaerat tenetur asperiores vel autem voluptatibus ullam. Tempore, dolorem.`;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 20; i++) { frag.appendChild(p.cloneNode(true)); }
    document.querySelector('#app')!.appendChild(frag);
  })((RUNTIME_ENV === 'development'));

  ((flag) => {
    if (!flag) { return; }

    /** content shadow dom */
    const shadow = container.attachShadow({ mode: 'open' });
    shadow.appendChild(mount);
    app.$mount(mount);

    if (isDebug) {
      const styles = document.head.querySelectorAll('style');
      for (const style of styles) {
        shadow.appendChild(style);
      }
    } else {
      const urls: string[] = [
        'css/chunk-vendors.css',
        'css/chunk-common.css',
        'css/content/main.css',
      ].map((path) => browser.runtime.getURL(path));

      const link: HTMLLinkElement = document.createElement('link');
      link.rel = 'stylesheet';

      const frag = document.createDocumentFragment();
      for (const url of urls) {
        const l = link.cloneNode(true) as HTMLLinkElement;
        l.href = url;
        frag.appendChild(l);
      }
      shadow.appendChild(frag);
    }
  })((RUNTIME_ENV === 'production'));
});
