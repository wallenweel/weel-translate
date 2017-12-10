<template lang="pug">
  v-container
    v-layout(column wrap)
      v-card
        v-layout(row wrap :class="$style.languageToolbar")
          v-select(
            :items="languages"
            min-width=120
            label="Select"
            overflow hide-details
            auto dense
            v-model="srcLanguage"
            )
          v-btn(flat style="min-width: 32px;" @click="swapLanguage")
            v-icon(color="primary" medium) swap_horiz
          v-select(
            :items="languages"
            min-width=120
            label="Select"
            overflow hide-details
            auto dense
            v-model="aimLanguage"
            )

      //- v-divider

      v-card
        v-text-field(
          textarea
          placeholder="something else ..."
          rows=6
          hide-details
          full-width
          )
</template>

<script>
export default {
  name: 'PopupHomeTranslation',
  data () {
    return {
      srcLanguage: 'auto',
      aimLanguage: 'auto',
      languages: [
        { text: 'Auto', value: 'auto' },
        { text: 'English', value: 'en' },
        { text: '中文', value: 'zh-CN' },
        { text: 'Japanese', value: 'ja' }
      ]
    }
  },
  methods: {
    swapLanguage () {
      [ this.aimLanguage, this.srcLanguage ] = [ this.srcLanguage, this.aimLanguage ]
    }
  },
  watch: {
    srcLanguage (code) {
      console.log(code)
    },
    aimLanguage (code) {
      console.log(code)
    }
  }
}
</script>

<style lang="scss" module>
.languageToolbar {
  :global {
    .input-group__input {
      box-shadow: unset !important;
      justify-content: space-around;
    }
    .input-group__selections {
      user-select: none;
      width: 100% !important;
      justify-content: center;
    }
    .input-group__details {
      display: none;
    }
  }
}
</style>


