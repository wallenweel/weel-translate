<template lang="pug">
  v-app(light)
    popup-toolbar
    popup-navigation-drawer
    v-content
      router-view
</template>

<script>
import PopupToolbar from '@/components/PopupToolbar'
import PopupNavigationDrawer from '@/components/PopupNavigationDrawer'

export default {
  name: 'app',
  components: {
    PopupToolbar,
    PopupNavigationDrawer
  }
}
</script>

<style lang="scss">
@include preset;

html,
body {
  background-color: $color-secondary;
  overflow: hidden;
}

#app {
  background-color: hsl(0, 100%, 100%);

  height: $app-height;
  max-height: $app-height;
  min-height: $app-height;
  width: $app-width;
  max-width: $app-width;
  min-width: $app-width;
  
  margin: auto;

  position: relative;
  // overflow: hidden;

  .application--wrap {
    height: inherit;
    max-height: inherit;
    min-height: inherit;
    width: inherit;
    max-width: inherit;
    min-width: inherit;
  }
}
</style>
