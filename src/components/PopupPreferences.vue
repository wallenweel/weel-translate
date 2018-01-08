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
            hide-details color="primary"
            :label="i('DARK_THEME')"
            :input-value="dark"
            @change="update(['dark', !dark])"
            )
          v-switch(
            hide-details color="primary"
            :label="i('PREVIOUS_UI_STYLE')"
            :input-value="v1_style"
            @change="update(['v1_style', !v1_style])"
            )
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'PopupPreference',
  computed: {
    ...mapState(['preferences']),
    dark () { return this.preferences['dark'] },
    v1_style () { return this.preferences['v1_style'] }
  },
  methods: {
    ...mapMutations({
      update: 'preferenceChanges'
    })
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
