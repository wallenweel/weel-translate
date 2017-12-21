<template lang="pug">
  v-card(:class="$style.result")
    v-layout(column wrap)
      v-flex
        v-btn(flat small icon)
          v-icon(color="blue-grey") volume_up
        span {{ result.phonetic.src }}
      v-flex
        v-btn(flat small icon)
          v-icon(color="blue-grey") volume_up
        span {{ result.phonetic.src }}
      v-flex
        v-btn(flat small icon)
          v-icon(color="blue-grey") content_copy
        span(:class="$style.translation") {{ result.translation }}
      v-divider
      v-card-text(class="body-2")
        div(v-for="item in result.explain") {{ item }}
</template>

<script>
export default {
  name: 'BaseTranslationResult',
  data () {
    return {
      default: {
        phonetic: {},
        translation: '',
        explain: []
      }
    }
  },
  props: ['result']
}
</script>

<style lang="scss" module>
.result {
  min-height: 120px;
  padding: 8px 6px;
}

.translation {
  font-weight: bold;
}
</style>

