import Vue from 'vue'
import Router from 'vue-router'
// import PopupHome from '@/components/PopupHome'
Vue.use(Router)

export const home = {
  path: '/home',
  component: () => import(/* webpackChunkName: "PopupHome" */ '@/components/PopupHome'),
  // component: PopupHome,
  children: [
    {
      path: '',
      redirect: 'translation'
    },
    {
      path: 'translation',
      component: () => import(/* webpackChunkName: "PopupHomeTranslation" */ '@/components/PopupHomeTranslation')
    },
    {
      path: 'recent',
      component: () => import(/* webpackChunkName: "PopupHomeRecent" */ '@/components/PopupHomeRecent')
    },
    {
      path: 'collection',
      component: () => import(/* webpackChunkName: "PopupHomeCollection" */ '@/components/PopupHomeCollection')
    }
  ]
}

export const preferences = {
  path: '/preferences',
  name: 'PopupPreferences',
  component: () => import(/* webpackChunkName: "PopupPreferences" */ '@/components/PopupPreferences')
}

export const settings = {
  path: '/settings',
  name: 'PopupSettings',
  component: () => import(/* webpackChunkName: "PopupSettings" */ '@/components/PopupSettings')
}

export const feedback = {
  path: '/feedback',
  name: 'PopupFeedback',
  component: () => import(/* webpackChunkName: "PopupFeedback" */ '@/components/PopupFeedback')
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    home,
    preferences,
    settings,
    feedback
  ]
})
