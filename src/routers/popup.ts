import Vue, { VueConstructor } from 'vue';
import Router, { RouterOptions, RouteConfig } from 'vue-router';
import Translation from '@/views/Translation.vue';

Vue.use(Router);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'translation',
    component: Translation as VueConstructor,
  },
];

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
} as RouterOptions);
