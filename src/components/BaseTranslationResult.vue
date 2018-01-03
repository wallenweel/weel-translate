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
        v-btn(
          flat small icon
          @click="voice({ src })"
          )
          v-icon(color="blue-grey") volume_up
        span {{ getResult.phonetic_src }}
      v-flex
        v-btn(
          flat small icon
          @click="voice({ dest, text: getResult.translation })"
          )
          v-icon(color="blue-grey") volume_up
        span {{ getResult.phonetic_dest }}
      v-flex
        v-btn(flat small icon)
          v-icon(color="blue-grey") content_copy
        span(:class="$style.translation") {{ getResult.translation }}
      v-divider
      v-card-text(class="body-2" :class="$style.explain")
        pre {{ getResult.explain }}
</template>

<script>
import { istype } from '@/functions/utils'

export default {
  name: 'BaseTranslationResult',
  data () {
    return {
      picked: this.collected
    }
  },
  computed: {
    getResult () {
      const { phonetic_src, phonetic_dest, translation, explain } = this.result

      return {
        phonetic_src,
        phonetic_dest,
        translation: istype(translation, 'array') ? translation.join('') : translation,
        explain: istype(explain, 'array') ? explain.join('\n').replace(/,/g, `, `) : explain.replace(/,/g, `, `)
      }
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

.explain {
  display: flex;

  :global(pre) {
    width: 0;
    white-space: pre-wrap;
    font-family: inherit;
    flex: 1 1 auto;
    overflow: hidden;
  }
}
</style>

