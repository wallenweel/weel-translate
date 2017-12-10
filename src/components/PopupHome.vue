<template lang="pug">
  v-layout
    transition(:name="transitionName")
      router-view(class="child-view")
    v-bottom-nav(
      absolute
      :value="true"
      :active.sync="navActive"
      color="transparent"
      style="left: 0;"
    )
      v-btn(flat color="primary" value="translation")
        span Translation
        v-icon translate
      v-btn(flat color="primary" value="recent")
        span Recent
        v-icon history
      v-btn(flat color="primary" value="collection")
        span Collection
        v-icon style
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PopupHome',
  data () {
    return {
      navActive: 'translation',
      transitionName: 'slide-left'
    }
  },
  created () {
    this.keepNavBtn()
  },
  beforeRouteUpdate (to, from, next) {
    const arrQueue = ['translation', 'recent', 'collection']
    const toTarget = to.path.split('/')[to.path.split('/').length - 1]
    const fromTarget = from.path.split('/')[from.path.split('/').length - 1]
    const [ toIndex, fromIndex ] = [ arrQueue.indexOf(toTarget), arrQueue.indexOf(fromTarget) ]

    this.transitionName = toIndex < fromIndex ? 'slide-right' : 'slide-left'

    next()
  },
  computed: {
    ...mapState([
      'count'
    ])
  },
  methods: {
    keepNavBtn () {
      const currentPath = this.$router.history.current.path
      const currentView = currentPath.split('/').pop()

      this.navActive = currentView
    }
  },
  watch: {
    navActive (v) {
      this.$router.push(v)
    }
  }
}
</script>

<style lang="scss">
.child-view {
  position: absolute;
  transition: all 1.5s cubic-bezier(.55,0,.1,1);
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

