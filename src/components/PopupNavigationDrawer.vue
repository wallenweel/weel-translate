<template lang="pug">
  v-navigation-drawer(
    app
    temporary
    absolute
    width="220"
    v-model="drawer"
  )
    v-toolbar(flat)
      span {{ i18n.getMessage('EXTENSION_NAME') }}
    v-list
      v-list-tile(
        ripple
        v-for="item in items"
        :key="item.title"
        @click=""
        :to="item.path"
      )
        v-list-tile-action
          v-icon
            |{{ item.icon }}
        v-list-tile-content
          v-list-tile-title
            |{{ item.title }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'popupNavigationDrawer',
  data () {
    return {
      drawer: null,
      items: [
        { title: 'Home', icon: 'home', path: '/home' },
        { title: 'Preferences', icon: 'tune', path: '/preferences' },
        { title: 'Settings', icon: 'settings', path: '/settings' },
        { title: 'Feedback', icon: 'feedback', path: '/feedback' }
      ]
    }
  },
  computed: {
    ...mapState(['drawerOpened'])
  },
  watch: {
    drawerOpened () {
      this.drawer = !this.drawer
    }
  },
  methods: {}
}
</script>
