<template lang="pug">
  v-app(dark=false :class="$style.app")
    popup-toolbar
    popup-navigation-drawer
    v-content(:class="$style.content")
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
