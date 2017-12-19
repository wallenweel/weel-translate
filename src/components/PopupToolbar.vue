<template lang="pug">
  v-toolbar(
    dark
    dense
    color="primary"
    style="z-index: 4;"
    )
    v-toolbar-side-icon(@click.stop="handleDrawer")
    v-toolbar-title {{ title }}
    v-switch(
      color="secondary"
      style="margin-left: auto; max-width: 36px;"
      :class="$style.keepUp"
      hide-details
      v-model="keepUp"
    )
</template>

<script>
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
      this.$store.commit('drawerNavigationToggle')
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

