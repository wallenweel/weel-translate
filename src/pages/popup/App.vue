<template lang="pug">
  v-app(:dark="dark" :class="$style.app" :style="preStyleApp")
    v-tooltip(v-model="tip" bottom)
      v-flex(slot="activator")
      span {{ tipMsg }}

    popup-toolbar

    popup-navigation-drawer

    v-content(:class="$style.content" :style="preStyleContent")
      router-view
</template>

<script>
import PopupToolbar from '@/components/PopupToolbar'
import PopupNavigationDrawer from '@/components/PopupNavigationDrawer'

export default {
  name: 'app',
  data () {
    return {
      tip: false,
      tipMsg: '...',
      preStyleApp: null,
      preStyleContent: null
    }
  },
  computed: {
    dark () {
      return this.$store.state.preferences.dark
    },
    globalTip () {
      return this.$store.state.globalTip
    },
    isPreStyle () { return this.$store.getters.isPreStyle }
  },
  methods: {
    useTip (value) {
      [this.tip, this.tipMsg] = value
      setTimeout(() => (this.tip = false), 2500)
    }
  },
  watch: {
    globalTip (value) { this.useTip(value) },
    '$route' ({ path }) {
      this.preStyleApp = null
      this.preStyleContent = null

      if (!this.isPreStyle || !/(translation)$/.test(path)) return
      this.preStyleApp = {
        height: 'auto',
        minHeight: 'auto'
      }
      this.preStyleContent = {
        height: '0%',
        minHeight: 'auto'
      }
    }
  },
  components: {
    PopupToolbar,
    PopupNavigationDrawer
  }
}
</script>

<style lang="scss" module>
@include preset;

html,
body {
  background-color: $color-secondary;
  overflow: hidden;
}

:global(.application--wrap) {
  height: inherit;
  max-height: inherit;
  min-height: inherit;
  width: inherit;
  max-width: inherit;
  min-width: inherit;
}

.app {
  height: $app-height;
  max-height: $app-height;
  min-height: $app-height;
  width: $app-width;
  max-width: $app-width;
  min-width: $app-width;
  
  // margin: auto;

  position: relative;
  // overflow: hidden;
}

.content {
  height: $app-height - $head-toolbar-height;
  
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
