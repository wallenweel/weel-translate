import Vue from 'vue'
import Router from 'vue-router'
import OptionsHome from '@/components/OptionsHome'
import OptionsServiceSourceAPI from '@/components/OptionsServiceSourceAPI'
import OptionsTemplates from '@/components/OptionsTemplates'

Vue.use(Router)

export const home = {
  path: '/home',
  name: 'OptionsHome',
  component: OptionsHome
}

export const serviceSourceAPI = {
  path: '/service-source-api',
  name: 'OptionsServiceSourceAPI',
  component: OptionsServiceSourceAPI
}

export const templates = {
  path: '/templates',
  name: 'OptionsTemplates',
  component: OptionsTemplates
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    home,
    serviceSourceAPI,
    templates
  ]
})
