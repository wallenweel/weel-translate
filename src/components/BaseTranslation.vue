<template lang="pug">
  v-layout(column)
    div(
      contenteditable
      :class="$style.pasteTmp"
      ref="pasteTmp"
      @paste.prevent="handlePaste"
      )
    v-card
      v-tooltip(v-model="blank" bottom)
        div(slot="activator")
        span {{ tip }}
      v-layout(row wrap :class="$style.languageToolbar")
        v-select(
          min-width=140 :label="i18n.getMessage('SELECT')"
          overflow hide-details auto dense
          :class="$style.from"
          :items="languages"
          item-text="locale"
          item-value="code"
          v-model="src_dest[0]"
          )

        v-btn(
          icon style="min-width: 32px;"
          :disabled="!src_dest[0] && !src_dest[1]"
          @click="swapLanguages"
          )
          v-icon(color="primary" small) swap_horiz

        v-select(
          min-width=140 :label="i18n.getMessage('SELECT')"
          overflow hide-details auto dense
          :class="$style.to"
          :items="languages"
          item-text="locale"
          item-value="code"
          v-model="src_dest[1]"
          )

    v-card
      v-text-field(
        textarea rows=3 full-width
        :placeholder="i('TRANSLATION_TEXTAREA_TIP')"
        ref="content"
        v-model="content"
        @keydown.native.enter.prevent="handleKeydown"
        )

      v-layout(row justify-space-around :class="$style.tools")
        v-tooltip(top)
          v-btn(flat depressed slot="activator" @click="deleteContent")
            v-icon(color="blue-grey") delete
          span {{ i('CLEAR_CONTENT') }}

        v-btn(
          fab dark medium color="primary"
          :class="$style.translate"
          @click="requestTranslation"
          )
          v-icon(dark) done_all
          v-progress-circular(
            :indeterminate="loading" v-if="loading"
            :width="3" :size="66"
            color="white" style="opacity: .66; top: -5px; left: -5px;"
            )

        v-tooltip(top)
          v-btn(flat depressed slot="activator" @click="pasteContent")
            v-icon(color="blue-grey") content_paste
          span {{ i('PASTE_CONTENT') }}            
      
    v-flex(:class="$style.selection" v-show="languageSwitcher")
      v-btn(block medium dark color="accent" @click="nextServiceSource")
        b {{ name }}
        //- img(style="margin-left: 4px;" height=16 width=16 :src="icon")

    v-flex(
      :class="$style.selection"
      v-if="result.translation && template === 'default'"
      )
      base-translation-result(
        :settings="settings"
        :src="src_dest[0]" :dest="src_dest[1]"
        :result="result"
        :collected="collected"
        @collect="collectIt"
        @uncollect="uncollectIt"
        @speak="requestVoice"
        )

</template>

<script>
import BaseTranslationResult from '@/components/BaseTranslationResult'
import { REQUEST_TRANSLATION, REQUEST_VOICE } from '@/types'

export default {
  name: 'BaseTranslation',
  data () {
    return {
      source: {},
      content: this.input,
      blank: false,
      tip: '',
      loading: false
    }
  },
  props: {
    settings: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    },
    template: String,
    srcDest: {
      type: Array,
      required: false,
      default () {
        return ['', '']
      }
    },
    input: {
      type: String,
      required: false,
      default: ''
    },
    api: {
      type: Object,
      required: false,
      default () {
        return {
          name: 'API Name'
        }
      }
    },
    result: {
      type: Object,
      required: false,
      default () {
        return {}
      }
    },
    languageSwitcher: {
      required: false,
      default () { return false }
    }
  },
  computed: {
    languages () { return this.api.languages || [] },
    src_dest () { return this.srcDest },
    id () { return this.api.id || '' },
    name () { return this.api.name || '' },
    icon () { return this.api.icon || '' },
    collected () { return this.$store.state.currentCollected }
  },
  methods: {
    requestTranslation () {
      if (!this.content.length || !/[^\n]/.test(this.content)) {
        return this.$store.commit('globalTip', [true, this.i('BLANK_TRANSLATING_TIP')])
      }

      this.loading = true

      this.$store.dispatch(REQUEST_TRANSLATION, {
        q: this.content,
        from: this.src_dest[0],
        to: this.src_dest[1]
      }).then(success => {
        if (success) {
          this.loading = false
        }
      })
    },
    handleKeydown ({ ctrlKey, code }) {
      if (code === 'Enter') {
        if (ctrlKey) {
          this.content = `${this.content}\n`
          return true
        }

        this.requestTranslation()
      }

      return true
    },
    requestVoice ({ src, dest, text }) {
      if (typeof src === 'undefined') {
        this.$store.dispatch(REQUEST_VOICE, { from: dest, q: text })
      }
      if (typeof dest === 'undefined') {
        this.$store.dispatch(REQUEST_VOICE, { from: src, q: this.content })
      }
    },
    uncollectIt () {
      this.$store.commit('removeCollection', -1)
    },
    collectIt () {
      const { content, src_dest, id, name, result } = this

      this.$store.commit('addCollection', {
        q: content,
        from: src_dest[0],
        to: src_dest[1],
        id,
        name,
        result
      })
    },
    nextServiceSource () {
      this.loading = false
      this.$store.dispatch('nextServiceSource')
    },
    swapLanguages () {
      this.$store.commit('swapLanguages')
    },
    deleteContent () {
      this.content = ''
    },
    pasteContent () {
      this.$refs.pasteTmp.focus()
      document.execCommand('paste')
    },
    handlePaste (ev) {
      const text = ev.clipboardData.getData('text/plain')
      // console.log(JSON.stringify(text))
      // this.content = text.replace(/\n/g, ' ')
      this.content = text
    }
  },
  watch: {
    src_dest (codes) {
      this.$emit('changes', codes)
    },
    content (text) {
      this.$emit('input', text)
    },
    input (v) {
      this.content = v
    }
  },
  components: {
    BaseTranslationResult
  }
}
</script>

<style lang="scss" module>
.pasteTmp {
  * { all: unset; }

  height: 0;
  width: 0;
  white-space: nowrap;
  overflow: hidden;
}

.languageToolbar {
  :global {
    .input-group--text-field:last-child {
      > label {
        text-align: right;
        left: 0 !important;
        margin-left: -6px;
      }
    }
    .input-group__input {
      box-shadow: unset !important;
      justify-content: space-around;

      .input-group__append-icon {
        width: auto;
      }
    }
    .input-group__selections {
      user-select: none;
      width: 100% !important;
      // justify-content: end;
      &__comma {
        width: 0;
        white-space: nowrap;
        display: inline-table;

        &::after {
          content: "";
          background-image: linear-gradient(to left, white, transparent);
          height: 100%;
          width: 1em;
          right: 0;
          position: absolute;
          display: inline-block;
        }
      }
    }
    .input-group__details {
      display: none;
    }
  }
}

:global {
  .theme--dark {
    .input-group__selections__comma {
      &::after {
        background-image: linear-gradient(to left, $grey-darken3, transparent);
      }
    }
  }
}

.from {
  :global {
    .input-group__selections__comma {
      margin-right: auto;
    }
  }
}

.to {
  :global {
    .input-group__selections__comma {
      margin-left: auto;
    }
  }
}

.tools {
  margin-top: -6px;
}

.translate {
  margin-top: -4px;
}

.selection {
  padding: 10px 16px 0;

  &:last-child {
    padding-bottom: 24px;
  }
}
</style>


