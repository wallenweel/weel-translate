<template lang="pug">
  v-layout(wrap)

    v-toolbar(dense)
      //- v-toolbar-title {{ title }}
      v-chip(small outline disabled close)
        span Google
      v-chip(small)
        span Google CN
      v-chip(small)
        span Youdao

      v-spacer
      v-tooltip(bottom)
        v-btn(slot="activator") Add
        span Create New One
      v-tooltip(bottom)
        v-btn(color="primary" slot="activator") Save
        span Save Current

    v-layout(wrap :class="$style.content")
      v-flex(d-flex sm6 lg5 :class="$style.editorPart")
        v-layout(column :class="$style.editorLayout")
          v-toolbar(dense flat dark color="grey darken-3" :class="$style.editorTools")
              v-tooltip(bottom)
                v-btn(icon slot="activator" @click="formatCodes")
                  v-icon code
                span Format
              v-spacer
              v-btn(depressed right)
                span Run
                v-icon keyboard_arrow_right
          v-card(:class="$style.editorArea")
            textarea(ref="codeMirror")

      v-flex(d-flex sm6 lg4 :class="$style.respondPart")
        code {{ preset }}

      v-flex(d-flex sm12 lg3 :class="$style.viewPart")
        v-layout(column)
          v-container
            base-translation(:api="currentSource")
</template>

<script>
import BaseTranslation from '@/components/BaseTranslation'
import '@/functions/codeMirror.libs'

export default {
  name: 'ServiceSourceAPI',
  data () {
    return {
      title: 'Edit/Create Translation API',
      editor: null
    }
  },
  computed: {
    currentSource () {
      return this.$store.state.currentSource
    },
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
    })
    this.editor.setValue(this.preset)
  },
  methods: {
    formatCodes () {
      this.editor.autoFormatRange(
        { line: 0, ch: 0 },
        { line: this.editor.lineCount() }
      )
    }
  },
  components: {
    BaseTranslation
  }
}
</script>

<style lang="scss" module>
.content {
  width: 100%;
  height: calc(100% - 48px);
  overflow-x: hidden;
  overflow-y: auto;
}

.editorPart {
  height: 100%;
}

.editorLayout {
  width: 100%;
  height: 100%;  
}

.editorArea {
  min-height: calc(100vh - 96px);  
  :global {
    .CodeMirror {
      height: 100%;
    }
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

.respondPart {
  height: 100%;
  code {
    background: none;
    width: 100%;
    height: 100%;
    padding: 24px;
    box-shadow: unset;
    overflow: auto;
  }
}

.viewPart {
  background-color: $color-secondary;
  height: 100%;
  overflow: auto;  
}
</style>
