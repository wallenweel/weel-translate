import Vue from 'vue';
import Router, { RouterOptions, RouteConfig } from 'vue-router';

Vue.use(Router);

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/source-preset',
  },
  {
    path: '/source-preset',
    name: 'source-preset',
    component: () => import(/** webpackChunkName "source-preset-view" */ '@/views/PresetSource.vue'),
    meta: { locale: 'source_preset' },
  },
  {
    path: '/crawler-preset',
    name: 'crawler-preset',
    component: () => import(/** webpackChunkName "crawler-preset-view" */ '@/views/PresetCrawler.vue'),
    meta: { locale: 'crawler_preset' },
  },
  {
    path: '/style-preset',
    name: 'style-preset',
    component: () => import(/** webpackChunkName "style-preset-view" */ '@/views/PresetStyle.vue'),
    meta: { locale: 'style_preset' },
  },
  {
    path: '/template-preset',
    name: 'template-preset',
    component: () => import(/** webpackChunkName "template-preset-view" */ '@/views/PresetTemplate.vue'),
    meta: { locale: 'template_preset' },
  },
];

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
} as RouterOptions);
