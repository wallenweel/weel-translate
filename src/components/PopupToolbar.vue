<template lang="pug">
  v-toolbar(
    dark
    dense
    color="primary"
    style="z-index: 4;"
    )
    v-toolbar-side-icon(@click.stop="handleDrawer")
    v-toolbar-title {{ title }}

    v-tooltip(bottom style="margin-left: auto;")
      v-switch(
        color="secondary" hide-details
        :class="$style.keepAll"
        slot="activator"
        v-model="keepAll"
      )
      span Keep All
</template>

<script>
export default {
  name: 'PopupToolbar',
  data () {
    return {
      title: '',
      keepAll: false
    }
  },
  created () {
    this.keepAll = this.keep_all
    this.$watch('keepAll', open => {
      if (
        !this.$store.state.input_text.length &&
        !Object.keys(this.$store.state.result).length
      ) {
        this.keepAll = false
        return this.$store.commit('globalTip', [true, 'Need a translating at least.'])
      }
      this.$store.dispatch('keepAllTranslation', { status: !!open })
    })
  },
  computed: {
    keep_all () {
      return this.$store.state.keep_all
    }
  },
  methods: {
    handleDrawer () {
      this.$store.commit('drawerNavigationToggle')
    }
  },
  watch: {
    '$route' ({ path }) {
      const keys = path.split('/')

      let value = ''

      if (keys[1] === 'home') value = keys[2]
      else if (keys[1] === 'about') value = 'donate'
      else value = keys[1]

      this.title =
        this.i18n.getMessage(value.toUpperCase()) ||
        value.replace(/^\w/, v => v.toUpperCase())
    }
  }
}
</script>

<style lang="scss" module>
.keepAll {
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

