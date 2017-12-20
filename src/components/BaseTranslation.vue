<template lang="pug">
  v-layout(column wrap)
    v-card
      v-tooltip(v-model="needContent" bottom)
        div(slot="activator")
        span {{ tip }}
      v-layout(row wrap :class="$style.languageToolbar")
        //- source language selection
        v-select(
          min-width=140
          label="Select"
          overflow hide-details
          auto dense
          :items="languages"
          item-text="locale"
          item-value="code"
          v-model="srcLanguage"
          :class="$style.from"
          )
        //- a mini button to swap two languages
        v-btn(icon style="min-width: 32px;" @click="swapLanguages")
          v-icon(color="primary" small) swap_horiz
        //- aim language selection
        v-select(
          min-width=140
          label="Select"
          overflow hide-details
          auto dense
          :items="languages"
          item-text="locale"
          item-value="code"
          v-model="destLanguage"
          :class="$style.to"
          )

    v-card
      //- input of translating
      v-text-field(
        textarea
        placeholder="something else ..."
        rows=3
        hide-details
        full-width
        v-model="content"
        ref="content"
        )
      v-layout(
        row justify-space-around
        :class="$style.tools"
        )
        //- delete button
        v-btn(flat depressed @click="deleteContent")
          v-icon(color="blue-grey") delete
        //- translation button
        v-btn(
          fab dark medium color="primary"
          :class="$style.translate"
          @click="startTranslate"
          )
          v-icon(dark) done_all
        //- paste content button
        v-btn(flat depressed @click="pasteContent")
          v-icon(color="blue-grey") content_paste
      
    v-flex(:class="$style.selection")
      v-btn(block medium dark color="accent" @click="nextServiceSource")
        //- |source&nbsp;:&nbsp;&nbsp;
        b {{ name }}
        img(style="margin-left: 4px;" height=16 width=16 :src="icon")

    div(ref="test" @click="handleCustomResult")

    v-flex(:class="$style.selection")
      v-card(:class="$style.response")
        v-layout(column wrap)
          v-flex
            v-btn(flat small icon)
              v-icon(color="blue-grey") volume_up
            span {{ response.phonetic.src }}
          v-flex
            v-btn(flat small icon)
              v-icon(color="blue-grey") volume_up
            span {{ response.phonetic.src }}
          v-flex
            v-btn(flat small icon)
              v-icon(color="blue-grey") content_copy
            span(:class="$style.translation") {{ response.translation }}
          v-divider
          v-card-text(class="body-2")
            div(v-for="item in response.explain") {{ item }}
</template>

<script>
// import { injectHTML } from '@/functions/utils'
import { REQUEST_TRANSLATION } from '@/types'

export default {
  name: 'BaseTranslation',
  data () {
    return {
      content: '',
      srcLanguage: 'auto',
      destLanguage: 'auto',
      // languages: [],
      source: {},
      needContent: false,
      tip: ``
    }
  },
  props: {
    api: {
      type: Object,
      required: false,
      default () {
        return {
          name: 'API Name'
        }
      }
    },
    response: {
      type: Object,
      required: false,
      default () {
        return {
          explain: [],
          phonetic: {}
        }
      }
    }
  },
  computed: {
    languages () {
      return this.api.languages || []
    },
    name () {
      return this.api.name || ''
    },
    icon () {
      return this.api.icon || ''
    }
  },
  methods: {
    startTranslate (ev) {
      if (!this.content.length) {
        return this.useTip(`Have you typed some words?`)
      }

      const payload = {
        q: this.content,
        from: this.srcLanguage,
        to: this.destLanguage
      }
      this.$store.dispatch(REQUEST_TRANSLATION, payload)

      // console.log(this.$refs.test.querySelector('button'))
      // let mock = `<div>{{aa}}{{bb}}</div>`
      // mock = mock.replace(/\{\{(aa|bb)\}\}/g, (pattern, key) => {
      //   // console.log(key)
      //   return { aa: '11', bb: '22' }[key]
      // })
      // injectHTML(mock, this.$refs.test)
    },
    swapLanguages () {
      [ this.destLanguage, this.srcLanguage ] = [ this.srcLanguage, this.destLanguage ]
    },
    deleteContent () {
      this.content = ''
    },
    pasteContent () {
      console.log(this.$refs.content.$el.querySelector('textarea'))
      this.$refs.content.$el.querySelector('textarea').focus()
      document.execCommand('paste')
    },
    handleCustomResult (ev) {
      console.log(ev.target)
    },
    nextServiceSource () {
      this.$store.commit('nextServiceSource')
    },
    useTip (msg = '') {
      this.tip = msg
      setTimeout(() => (this.needContent = false), 2500)
      this.needContent = true
    }
  },
  watch: {
    srcLanguage (code) {
      console.log(code)
    },
    destLanguage (code) {
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

.response {
  min-height: 120px;
  padding: 8px 6px;
}

.translation {
  font-weight: bold;
}
</style>


