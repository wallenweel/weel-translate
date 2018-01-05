<template lang="pug">
  v-container(:class="$style.container")
    v-subheader
      v-icon(small) color_lens
      span &nbsp;Custom Theme
    v-layout(column wrap :class="$style.section")
      v-card(flat)
        v-card-text
          v-switch(
            label="Dark theme"
            v-model="dark"
            )
</template>

<script>
export default {
  name: 'PopupPreference',
  data () {
    return {
      dark: false
    }
  },
  beforeMount () {
    this.dark = this.$store.state.preferences.dark
  },
  watch: {
    dark (value) {
      this.$store.state.preferences.dark = value
    }
  }
}
</script>

<style lang="scss" module>
.container {
  padding: 16px;
}
.section {
  margin: 0 0;
}
</style>
