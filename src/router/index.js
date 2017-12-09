import Vue from 'vue'
import Router from 'vue-router'
import PopupEntry from '@/components/PopupEntry'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PopupEntry',
      component: PopupEntry
    }
  ]
})
