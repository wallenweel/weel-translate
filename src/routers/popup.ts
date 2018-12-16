import Vue, { VueConstructor } from 'vue';
import Router, { RouterOptions, RouteConfig } from 'vue-router';
Vue.use(Router);

import TranslationView from '@/views/Translation.vue';
import SettingsView from '@/views/Settings.vue';
import PickedView from '@/views/Picked.vue';

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
    path: '/picked',
    name: 'picked',
    component: PickedView as VueConstructor,
    meta: { locale: 'picked' },
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
