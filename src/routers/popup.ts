import Vue, { VueConstructor } from 'vue';
import Router, { RouterOptions, RouteConfig } from 'vue-router';
Vue.use(Router);

import TranslationView from '@/views/Translation.vue';
import SettingsView from '@/views/Settings.vue';

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/translation',
  },
  {
    path: '/translation',
    name: 'translation',
    component: TranslationView as VueConstructor,
    meta: { locale: 'translate' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView as VueConstructor,
    meta: { locale: 'settings' },
  },
];

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
} as RouterOptions);
