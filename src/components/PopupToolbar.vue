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
    v-switch(
      color="secondary"
      style="margin-right: 17px;"
      class="keep-up"
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
      this.$store.commit('drawerToggle')
    }
  }
}
</script>

<style lang="scss">
.keep-up {
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

      top: 32%;
      left: 42%;
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
</style>

