import Vue from 'vue'
import Router from 'vue-router'
import PopupEntry from '@/components/PopupEntry'
import PopupEntryTranslation from '@/components/PopupEntryTranslation'
import PopupEntryRecent from '@/components/PopupEntryRecent'
import PopupEntryCollection from '@/components/PopupEntryCollection'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/entry'
    },
    {
      path: '/entry',
      name: 'PopupEntry',
      component: PopupEntry,
      children: [
        {
          path: '',
          redirect: 'translation'
        },
        {
          path: 'translation',
          component: PopupEntryTranslation
        },
        {
          path: 'recent',
          component: PopupEntryRecent
        },
        {
          path: 'collection',
          component: PopupEntryCollection
        }
      ]
    }
  ]
})
