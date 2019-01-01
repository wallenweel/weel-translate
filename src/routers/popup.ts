import Vue, { VueConstructor } from 'vue';
import Router, { RouterOptions, RouteConfig } from 'vue-router';

Vue.use(Router);

import TranslationView from '@/views/Translation.vue';

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/translation',
  },
  {
    path: '/translation',
    name: 'translation',
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
    path: '/history',
    name: 'history',
    component: () => import(/** webpackChunkName "history-view" */ '@/views/History.vue'),
    meta: { locale: 'history' },
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
