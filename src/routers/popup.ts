import Vue, { VueConstructor } from 'vue';
import Router, { RouterOptions, RouteConfig } from 'vue-router';

Vue.use(Router);

import TranslationView from '@/views/Translation.vue';

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/translate',
  },
  {
    path: '/translate',
    name: 'translate',
    // component: () => import(/** webpackChunkName "translation-view" */ '@/views/Translation.vue'),
    component: TranslationView as VueConstructor,
    meta: { locale: 'translate' },
  },
  {
    path: '/picked',
    name: 'picked',
    component: () => import(/** webpackChunkName "picked-view" */ '@/views/Picked.vue'),
    meta: { locale: 'picked' },
  },
  {
    path: '/recent',
    name: 'recent',
    component: () => import(/** webpackChunkName "recent-view" */ '@/views/Recent.vue'),
    meta: { locale: 'recent' },
  },
  {
    path: '/preference',
    name: 'preference',
    component: () => import(/** webpackChunkName "preference-view" */ '@/views/Preference.vue'),
    meta: { locale: 'preference' },
  },
  {
    path: '/presets',
    name: 'presets',
    component: () => import(/** webpackChunkName "presets-view" */ '@/views/Presets.vue'),
    meta: { locale: 'presets' },
  },
];

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
} as RouterOptions);
