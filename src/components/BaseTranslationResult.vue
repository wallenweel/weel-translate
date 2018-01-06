<template lang="pug">
  v-card(:class="$style.result")
    input(
      type="text"
      :class="$style.copyTmp"
      :value="getResult.translation"
      ref="copyTmp"
      )
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
      v-flex(v-if="useSrc")
        v-btn(
          flat small icon
          @click="voice({ src })"
          )
          v-icon(color="blue-grey") volume_up
        span {{ getResult.phonetic_src }}
      v-flex(v-if="useDest")
        v-btn(
          flat small icon
          @click="voice({ dest, text: getResult.translation })"
          )
          v-icon(color="blue-grey") volume_up
        span {{ getResult.phonetic_dest }}
      v-flex
        v-btn(
          flat small icon
          @click="copy"
          )
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
  props: {
    result: Object,
    src: String,
    dest: String,
    collected: Boolean,
    settings: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    }
  },
  computed: {
    getResult () {
      const { translation, explain } = this.result

      return {
        phonetic_src: this.result['phonetic_src'] || '...',
        phonetic_dest: this.result['phonetic_dest'] || '...',
        translation: istype(translation, 'array') ? translation.join('') : translation,
        explain: istype(explain, 'array')
          ? explain.join('\n').replace(/,/g, `, `)
          : (explain || '').replace(/,/g, `, `)
      }
    },
    useSrc () { return this.settings['use_phonetic_src'] },
    useDest () { return this.settings['use_phonetic_dest'] }
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
    },
    copy () {
      this.$refs.copyTmp.select()
      document.execCommand('Copy')
      this.$store.commit('globalTip', [true, 'Copy Successed.'])
    }
  }
}
</script>

<style lang="scss" module>
.copyTmp {
  height: 0;
  width: 0;
  white-space: nowrap;
  overflow: hidden;
  position: absolute;
}

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

