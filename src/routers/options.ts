import Vue from 'vue';
import Router, { RouterOptions, RouteConfig } from 'vue-router';

Vue.use(Router);

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/translation',
  },
  {
    path: '/translation',
    name: 'translation',
    component: () => import(/** webpackChunkName "translation-preset-view" */ '@/views/PresetTranslation.vue'),
    meta: { locale: 'translation_preset' },
  },
  {
    path: '/web',
    name: 'web',
    component: () => import(/** webpackChunkName "web-preset-view" */ '@/views/PresetWeb.vue'),
    meta: { locale: 'web_preset' },
  },
  {
    path: '/style',
    name: 'style',
    component: () => import(/** webpackChunkName "style-preset-view" */ '@/views/PresetStyle.vue'),
    meta: { locale: 'style_preset' },
  },
  {
    path: '/template',
    name: 'template',
    component: () => import(/** webpackChunkName "template-preset-view" */ '@/views/PresetTemplate.vue'),
    meta: { locale: 'template_preset' },
  },
];

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
} as RouterOptions);
