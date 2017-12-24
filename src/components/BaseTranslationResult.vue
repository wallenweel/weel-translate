<template lang="pug">
  v-card(:class="$style.result")
    v-layout(column wrap)
      v-flex
        v-tooltip(top)
          v-btn(
            flat small icon slot="activator"
            @click="voice({ src })"
            )
            v-icon(color="blue-grey") volume_up
          span Source Pron
        span {{ getResult.phonetic_src }}
      v-flex
        v-tooltip(top)
          v-btn(
            flat small icon slot="activator"
            @click="voice({ dest, text: getResult.translation })"
            )
            v-icon(color="blue-grey") volume_up
          span Destination Pron
        span {{ getResult.phonetic_dest }}
      v-flex
        v-btn(flat small icon)
          v-icon(color="blue-grey") content_copy
        span(:class="$style.translation") {{ getResult.translation }}
      v-divider
      v-card-text(class="body-2")
        div(v-for="item in getResult.explain") {{ item }}
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
  computed: {
    getResult () {
      return !Object.keys(this.result).length ? this.default : this.result
    }
  },
  props: {
    result: Object,
    src: String,
    dest: String
  },
  methods: {
    voice (type) {
      this.$emit('speak', type)
    }
  }
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

