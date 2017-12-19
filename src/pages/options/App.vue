<template lang="pug">
  v-app(:dark="dark")
    options-navigation-drawer
    v-content(style="height: 100vh; overflow: hidden;")
      router-view(style="height: 100%;")
</template>

<script>
import OptionsNavigationDrawer from '@/components/OptionsNavigationDrawer'

export default {
  name: 'app',
  computed: {
    dark () {
      return this.$store.state.preferences.dark
    }
  },
  components: {
    OptionsNavigationDrawer
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
</style>
