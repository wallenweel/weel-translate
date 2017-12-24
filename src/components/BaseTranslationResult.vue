<template lang="pug">
  v-card(:class="$style.result")
    v-layout(column wrap)
      v-flex(style="position: absolute; top: 0; right: 0;")
        v-tooltip(top)
          v-btn(
            flat small icon slot="activator"
            @click="pickIt(picked)"
            )
            v-icon(color="blue-grey" v-if="!picked") star_border
            v-icon(color="accent" v-else) star
          span Collect This
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
      picked: this.collected,
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
    dest: String,
    collected: Boolean
  },
  methods: {
    pickIt (v) {
      if (v === true) {
        this.$emit('uncollect')
        this.picked = false
      } else {
        this.$emit('collect')
        this.picked = true
      }
    },
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

