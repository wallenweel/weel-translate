<template lang="pug">
v-layout(column warp)
  v-alert(
    style="margin: 0 0; width: 100%;"
    type="info" :value="true"
    )
    |{{ i('PREFERENCE_INFO') }}
  v-container(:class="$style.container")

    v-subheader
      v-icon(small) color_lens
      span &nbsp;{{ i('CUSTOM_THEME') }}
    v-layout(column wrap :class="$style.section")
      v-card(flat)
        v-card-text
          v-switch(
            :label="i('DARK_THEME')"
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
