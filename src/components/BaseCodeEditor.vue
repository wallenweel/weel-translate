<template lang="pug">
v-layout(column style="width: 100%; height: 100%;")
  v-toolbar(dense flat dark color="grey darken-3")
      v-tooltip(bottom)
        v-btn(icon slot="activator" @click="formatCodes")
          v-icon refresh
        span Reload
      v-tooltip(bottom)
        v-btn(icon slot="activator" @click="formatCodes")
          v-icon code
        span Format
      v-spacer
      v-btn(depressed right @click="handle")
        span Run
        v-icon keyboard_arrow_right
        
  v-card(:class="$style.editorArea" :style="$props.editorStyle")
    textarea(ref="codeMirror")
</template>

<script>
import '@/functions/codeMirror.libs'

export default {
  name: 'BaseCodeEditor',
  data () {
    return {
      editor: null
    }
  },
  props: ['editorStyle', 'content', 'method'],
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
    this.editor.setValue(this.content)
  },
  methods: {
    handle () {
      this.method(this.editor)
    },
    formatCodes () {
      this.editor.autoFormatRange(
        { line: 0, ch: 0 },
        { line: this.editor.lineCount() }
      )
    }
  }
}
</script>

<style lang="scss" module>
.editorArea {
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
</style>
