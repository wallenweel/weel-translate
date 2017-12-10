import Vue from 'vue'
import Router from 'vue-router'
import PopupHome from '@/components/PopupHome'
import PopupHomeTranslation from '@/components/PopupHomeTranslation'
import PopupHomeRecent from '@/components/PopupHomeRecent'
import PopupHomeCollection from '@/components/PopupHomeCollection'

Vue.use(Router)

export const home = {
  path: '/home',
  name: 'PopupHome',
  component: PopupHome,
  children: [
    {
      path: '',
      redirect: 'translation'
    },
    {
      path: 'translation',
      component: PopupHomeTranslation
    },
    {
      path: 'recent',
      component: PopupHomeRecent
    },
    {
      path: 'collection',
      component: PopupHomeCollection
    }
  ]
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
