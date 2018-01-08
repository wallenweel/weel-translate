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

    v-subheader
      v-icon(small) color_lens
      span &nbsp;{{ i('FLOAT_ACTIONS_RELATED') }}
    v-layout(column wrap :class="$style.section")
      v-card(flat)
        v-card-text
          v-radio-group(
            :label="i('FLOAT_BUTTON_POSITION')"
            style="padding: 0;"
            :input-value="float_button_position" :mandatory="false"
            @change="v => update(['float_button_position', v])"
            ref="ddd"
            )
            v-radio(
              hide-details color="primary"
              v-for="item in fabPositions"
              :label="i(item[1])"
              :value="item[0]")
              
          v-radio-group(
            :label="i('FLOAT_PANEL_POSITION')"
            style="padding: 0;"
            :input-value="float_panel_position" :mandatory="false"
            @change="v => update(['float_panel_position', v])"
            )
            v-radio(
              hide-details color="primary"
              v-for="item in fapPositions"
              :label="i(item[1])"
              :value="item[0]")
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'PopupPreference',
  data () {
    return {
      fabPositions: [
        [0, 'CENTER_OF_SELECTION_RECT'],
        [1, 'FOLLOW_MOUSE']
      ],
      fapPositions: [
        [0, 'CENTER_OF_SELECTION_RECT'],
        [1, 'FOLLOW_FLOAT_BUTTON'],
        [2, 'RIGHT_BOTTOM_OF_PAGE']
      ]
    }
  },
  computed: {
    ...mapState(['preferences']),
    dark () { return this.preferences['dark'] },
    v1_style () { return this.preferences['v1_style'] },
    float_button_position () { return this.preferences['float_button_position'] || 0 },
    float_panel_position () { return this.preferences['float_panel_position'] || 0 }
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
