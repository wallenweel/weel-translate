<template lang="pug">
  v-container
    v-layout(column wrap)
      v-card
        v-layout(row wrap :class="$style.languageToolbar")
          //- source language selection
          v-select(
            :items="genLanguages"
            min-width=120
            label="Select"
            overflow hide-details
            auto dense
            v-model="srcLanguage"
            )
          //- a mini button to swap two languages
          v-btn(icon style="min-width: 32px;" @click="swapLanguages")
            v-icon(color="primary" small) swap_horiz
          //- aim language selection
          v-select(
            :items="genLanguages"
            min-width=120
            label="Select"
            overflow hide-details
            auto dense
            v-model="aimLanguage"
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
          )
        v-layout(
          row justify-space-around
          :class="$style.tools"
          )
          v-btn(flat depressed @click="deleteContent")
            //- delete button
            v-icon(color="blue-grey") delete
          //- translation button
          v-btn(fab dark medium color="primary" :class="$style.translate")
            v-icon(dark) done_all
          v-btn(flat depressed)
            //- speak out content button
            v-icon(color="blue-grey") volume_up
        
      v-flex(:class="$style.selection")
        v-btn(block medium dark color="accent" @click="switchSource")
          //- v-icon(small) loop
          |source&nbsp;:&nbsp;&nbsp;
          b(v-model="source") {{ source.text }}

      v-flex(:class="$style.selection")
        v-card(:class="$style.result")
          v-layout(column wrap)
            span result
</template>

<script>
export default {
  name: 'PopupHomeTranslation',
  data () {
    return {
      srcLanguage: 'auto',
      aimLanguage: 'auto',
      languages: [],
      content: '',
      source: { text: 'Google', value: 'google' }
    }
  },
  computed: {
    genLanguages () {
      const languages = [
        { text: 'English', value: 'en' },
        { text: '中文', value: 'zh-CN' },
        { text: 'Japanese', value: 'ja' }
      ]

      languages.unshift({ text: this.i18n.getMessage('AUTO'), value: 'auto' })

      return languages
    }
  },
  methods: {
    swapLanguages () {
      [ this.aimLanguage, this.srcLanguage ] = [ this.srcLanguage, this.aimLanguage ]
    },
    deleteContent () {
      this.content = ''
    },
    switchSource () {
      const sources = [
        { text: 'Google', value: 'google' },
        { text: 'YouDao', value: 'youdao' }
      ]
      const getIndex = ({ value }) => {
        let index = -1

        sources.forEach((item, i) => {
          if (value === item.value) index = i
        })

        return index
      }

      const next = getIndex(this.source) + 1

      this.source = sources[next === sources.length ? 0 : next]
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

.tools {
  margin-top: -6px;
}

.translate {
  margin-top: -4px;
}

.selection {
  padding: 10px 16px 0;
  // padding-bottom: 0;
}

.result {
  min-height: 8px;
  padding: 16px;
}
</style>


