<template lang="pug">
  v-layout(column)
    v-toolbar(dense)
        v-toolbar-title {{ title }}
    v-layout(style="height: calc(100% - 48px);")
      v-layout(column :class="$style.codePart")
        v-toolbar(dense flat dark color="grey darken-3")
          v-tooltip(bottom)
            v-btn(icon slot="activator")
              v-icon code
            span Format
          v-spacer
          v-btn(depressed right)
            span Run
            v-icon keyboard_arrow_right

        v-flex(:class="$style.codeArea")
          textarea(ref="codeMirror")
      //- v-layout(:class="$style.viewPart")
      v-layout(column wrap)
        v-flex(d-flex)
          v-layout(row)
            popup-home-translation
            code {{ preset }}
          v-flex
            code {{ preset }}
</template>

<script>
import PopupHomeTranslation from '@/components/PopupHomeTranslation'

export default {
  name: 'ServiceSourceAPI',
  data () {
    return {
      title: 'Edit/Create Translation API',
      editor: null
    }
  },
  computed: {
    preset () {
      return this.$store.state.sources.preset.google
    }
  },
  mounted () {
    this.editor = window.CodeMirror.fromTextArea(this.$refs.codeMirror, {
      mode: 'application/json',
      theme: 'monokai',

      tabSize: 2,
      matchBrackets: true,
      lineNumbers: true,
      lint: true,
      jsonlint: true,

      lineWrapping: false,
      foldGutter: true,
      gutters: [
        'CodeMirror-linenumbers',
        'CodeMirror-foldgutter',
        'CodeMirror-lint-markers'
      ],
      scrollbarStyle: 'simple',
      styleActiveLine: true,
      showCursorWhenSelecting: true,
      keyMap: 'sublime'
    }).setValue(this.preset)
  },
  methods: {
    test () {
      console.log('editor', this.editor)
    }
  },
  components: {
    PopupHomeTranslation
  }
}
</script>

<style lang="scss" module>
.codePart {
  max-width: 760px;
  width: 100%;
  min-width: 440px;
  :global {
    .CodeMirror {
      width: 100%;
      height: 100%;
    }
  }
}

.codeArea {
  height: calc(100% - 48px);

  :global {
    .CodeMirror-scrollbar-filler {
      opacity: 0;
    }
    .CodeMirror-simplescroll- {
      &vertical, &horizontal {
        background-color: hsla(0, 0%, 60%, 0);
        div {
          background-color: hsla(0, 0%, 40%, 0.95);
          border: none;
          border-radius: 6px;
        }
      }
    }
  }
}

.viewPart {
  height: 100%;
  overflow: auto;

  code {
    box-shadow: unset;
    background: none;
  }
}
</style>
