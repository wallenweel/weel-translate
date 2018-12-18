import Vue, { VueConstructor } from 'vue';
import Router, { RouterOptions, RouteConfig } from 'vue-router';

Vue.use(Router);

import TranslationView from '@/views/Translation.vue';
import PreferenceView from '@/views/Preference.vue';
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
    path: '/preference',
    name: 'preference',
    component: PreferenceView as VueConstructor,
    meta: { locale: 'preference' },
  },
];

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
} as RouterOptions);
