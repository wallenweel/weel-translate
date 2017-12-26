import Vue from 'vue'
import Router from 'vue-router'
import PopupHome from '@/components/PopupHome'
import PopupHomeTranslation from '@/components/PopupHomeTranslation'
// import PopupHomeRecent from '@/components/PopupHomeRecent'
// import PopupHomeCollection from '@/components/PopupHomeCollection'
// import PopupPreferences from '@/components/PopupPreferences'
// import PopupSettings from '@/components/PopupSettings'
// import PopupFeedback from '@/components/PopupFeedback'

Vue.use(Router)

export const home = {
  path: '/home',
  // name: 'PopupHome',
  component: PopupHome,
  children: [
    {
      path: '',
      redirect: 'translation'
    },
    {
      path: 'translation',
      component: PopupHomeTranslation
      // component: resolve => require(['@/components/PopupHomeTranslation'], resolve)
    },
    {
      path: 'recent',
      // component: PopupHomeRecent
      component: resolve => require(['@/components/PopupHomeRecent'], resolve)
    },
    {
      path: 'collection',
      // component: PopupHomeCollection
      component: resolve => require(['@/components/PopupHomeCollection'], resolve)
    }
  ]
}

export const preferences = {
  path: '/preferences',
  name: 'PopupPreferences',
  // component: PopupPreferences
  component: resolve => require(['@/components/PopupPreferences'], resolve)
}

export const settings = {
  path: '/settings',
  name: 'PopupSettings',
  // component: PopupSettings
  component: resolve => require(['@/components/PopupSettings'], resolve)
}

export const feedback = {
  path: '/feedback',
  name: 'PopupFeedback',
  // component: PopupFeedback
  component: resolve => require(['@/components/PopupFeedback'], resolve)
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
