<template lang="pug">
  v-layout
    transition(:name="transitionName")
      router-view(class="child-view")
    v-bottom-nav(
      style="left: 0;"
      color
      absolute
      :value="true"
      :active.sync="navActive"
      )
      v-btn(
        flat color="primary"
        v-for="(v, k) in navItems"
        :value="k"
        :to="k"
        :key="k"
        )
        span {{ i18n.getMessage(v[0].toUpperCase()) }}
        v-icon {{ v[1] }}
</template>

<script>
export default {
  name: 'PopupHome',
  data () {
    return {
      navItems: {
        translation: ['Translation', 'translate'],
        recent: ['Recent', 'history'],
        collection: ['Collection', 'style']
      },
      navActive: 'translation',
      transitionName: 'slide-left'
    }
  },
  created () {
    // restore bottom navition's actived button
    // after page reload
    this.restoreNavBtn()
  },
  beforeRouteUpdate (to, from, next) {
    const arrQueue = ['translation', 'recent', 'collection']
    const toTarget = to.path.split('/').pop()
    const fromTarget = from.path.split('/').pop()

    this.transitionName = arrQueue.indexOf(toTarget) < arrQueue.indexOf(fromTarget)
      ? 'slide-right'
      : 'slide-left'

    next()
  },
  methods: {
    restoreNavBtn () {
      const currentPath = this.$router.history.current.path
      const currentView = currentPath.split('/').pop()

      this.navActive = currentView
    }
  }
}
</script>

<style lang="scss">
.child-view {
  transition: all 1.25s cubic-bezier(.55, 0, .1, 1);

  // background-color: $color-background;

  padding: 0;

  left: 0;
  bottom: 56px;
  right: 0;
  top: 0;
  position: absolute;

  overflow-x: hidden;
  overflow-y: auto;
}

.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);
}

.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0);
}
</style>

