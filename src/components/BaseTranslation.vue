<template lang="pug">
  v-layout(column wrap)
    v-card
      v-tooltip(v-model="blank" bottom)
        div(slot="activator")
        span {{ tip }}
      v-layout(row wrap :class="$style.languageToolbar")
        v-select(
          min-width=140 label="Select"
          overflow hide-details auto dense
          :class="$style.from"
          :items="languages"
          item-text="locale"
          item-value="code"
          v-model="srcLanguage"
          )

        v-btn(icon style="min-width: 32px;" @click="swapLanguages")
          v-icon(color="primary" small) swap_horiz

        v-select(
          min-width=140 label="Select"
          overflow hide-details auto dense
          :class="$style.to"
          :items="languages"
          item-text="locale"
          item-value="code"
          v-model="destLanguage"
          )

    v-card
      v-text-field(
        textarea rows=3 full-width
        placeholder="something else ..."
        v-model="content"
        ref="content"
        )

      v-layout(row justify-space-around :class="$style.tools")
        v-btn(flat depressed @click="deleteContent")
          v-icon(color="blue-grey") delete

        v-btn(
          fab dark medium color="primary"
          :class="$style.translate"
          @click="startTranslate"
          )
          v-icon(dark) done_all

        v-btn(flat depressed @click="pasteContent")
          v-icon(color="blue-grey") content_paste
      
    v-flex(:class="$style.selection" v-show="languageSwitch")
      v-btn(block medium dark color="accent" @click="nextServiceSource")
        b {{ name }}
        //- img(style="margin-left: 4px;" height=16 width=16 :src="icon")

    v-flex(:class="$style.selection")
      base-translation-result(:result="result")

</template>

<script>
import BaseTranslationResult from '@/components/BaseTranslationResult'
import { REQUEST_TRANSLATION } from '@/types'

export default {
  name: 'BaseTranslation',
  data () {
    return {
      source: {},
      content: this.input,
      blank: false,
      tip: ''
    }
  },
  props: {
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
    languageSwitch: {
      required: false,
      default () { return false }
    }
  },
  computed: {
    languages () { return this.api.languages || [] },
    name () { return this.api.name || '' },
    icon () { return this.api.icon || '' }
  },
  methods: {
    startTranslate (ev) {
      if (!this.content.length) {
        return this.useTip(`Have you typed some words?`)
      }

      this.$store.dispatch(REQUEST_TRANSLATION, {
        q: this.content,
        from: this.srcLanguage,
        to: this.destLanguage
      })
    },
    swapLanguages () {
      [ this.destLanguage, this.srcLanguage ] = [ this.srcLanguage, this.destLanguage ]
    },
    deleteContent () {
      this.content = ''
    },
    pasteContent () {},
    nextServiceSource () {
      this.$store.commit('nextServiceSource')
    },
    useTip (msg = '') {
      this.tip = msg
      setTimeout(() => (this.blank = false), 2500)
      this.blank = true
    }
  },
  watch: {
    srcLanguage (code) {
      console.log(code)
    },
    destLanguage (code) {
      console.log(code)
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
.languageToolbar {
  :global {
    .input-group__input {
      box-shadow: unset !important;
      justify-content: space-around;
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
        background-image: linear-gradient(to left, $color-grey-darken-3, transparent);
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


