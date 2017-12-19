import Vue from 'vue'
import Router from 'vue-router'
import OptionsHome from '@/components/OptionsHome'

Vue.use(Router)

export const home = {
  path: '/home',
  name: 'OptionsHome',
  component: OptionsHome
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    home
  ]
})
