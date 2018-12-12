import Vue, { VueConstructor } from 'vue';
import Router, { RouterOptions, RouteConfig } from 'vue-router';
import TranslationView from '@/views/Translation.vue';
import SettingsView from '@/views/Settings.vue';

Vue.use(Router);

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/translation',
  },
  {
    path: '/translation',
    name: 'translation',
    component: TranslationView as VueConstructor,
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView as VueConstructor,
  },
];

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
} as RouterOptions);
