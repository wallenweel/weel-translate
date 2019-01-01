import Vue, { VueConstructor } from 'vue';
import Router, { RouterOptions, RouteConfig } from 'vue-router';

Vue.use(Router);

import SourcesView from '@/views/Sources.vue';

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/sources',
  },
  {
    path: '/sources',
    name: 'sources',
    // component: () => import(/** webpackChunkName "sources-view" */ '@/views/Sources.vue'),
    component: SourcesView as VueConstructor,
    meta: { locale: 'sources' },
  },
];

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
} as RouterOptions);
