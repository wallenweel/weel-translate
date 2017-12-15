<template lang="pug">
  v-toolbar(
    app
    dark
    color="primary"
    style="z-index: 4;"
    )
    v-toolbar-side-icon(@click.stop="handleDrawer")
    v-toolbar-title {{ title }}
    v-spacer
    v-spacer
    v-spacer
    v-switch(
      color="secondary"
      style="margin-right: 17px;"
      :class="$style.keepUp"
      hide-details
      v-model="keepUp"
    )
</template>

<script>
import { DRAWER_NAGIVATION_TOGGLE } from '@/types'

export default {
  name: 'popupToolbar',
  data () {
    return {
      title: 'Translation',
      keepUp: false
    }
  },
  methods: {
    handleDrawer () {
      this.$store.commit(DRAWER_NAGIVATION_TOGGLE)
    }
  }
}
</script>

<style lang="scss" module>
.keepUp {
  :global {
    .input-group--selection-controls__ripple {
      &::before {
        content: "lock_open";
  
        opacity: 1;
        background: none;
        
        width: 20px;
        height: 20px;
        
        color: $color-secondary;
        font-size: 48px;
        font-family: 'Material Icons';
  
        top: 31%;
        left: 41%;
        z-index: 10;
      }
  
      &--active {
        &::before {
          content: "lock_outline";
  
          color: $color-primary;
        }
      }
    }
  }
}
</style>

