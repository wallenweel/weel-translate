import Vue from 'vue'
import Router from 'vue-router'
import PopupHome from '@/components/PopupHome'
import PopupHomeTranslation from '@/components/PopupHomeTranslation'
import PopupHomeRecent from '@/components/PopupHomeRecent'
import PopupHomeCollection from '@/components/PopupHomeCollection'
import PopupPreferences from '@/components/PopupPreferences'
import PopupSettings from '@/components/PopupSettings'
import PopupFeedback from '@/components/PopupFeedback'

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

export const preferences = {
  path: '/preferences',
  name: 'PopupPreferences',
  component: PopupPreferences
}

export const settings = {
  path: '/settings',
  name: 'PopupSettings',
  component: PopupSettings
}

export const feedback = {
  path: '/feedback',
  name: 'PopupFeedback',
  component: PopupFeedback
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
