<template lang="pug">
v-layout(column style="width: 100%; height: 100%;")
  v-toolbar(dense flat dark color="grey darken-3")
      v-tooltip(bottom)
        v-btn(icon slot="activator" @click="restore")
          v-icon settings_backup_restore
        span Restore
      v-tooltip(bottom)
        v-btn(icon slot="activator" @click="format")
          v-icon code
        span Format
      v-spacer
      v-tooltip(bottom)
        v-btn(depressed slot="activator" @click="compile")
          span Run
          v-icon keyboard_arrow_right
        span Compile Codes
        
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
  props: ['editorStyle', 'content', 'compileCb', 'restoreCb', 'mode'],
  mounted () {
    this.editor = window.CodeMirror.fromTextArea(this.$refs.codeMirror, {
      mode: this.mode,
      theme: 'monokai',

      tabSize: 2,
      matchBrackets: true,
      lineNumbers: true,
      lint: true,
      jsonlint: true,
      autoCloseTags: true,

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
    this.editor.on('changes', cm => {
      const content = cm.getValue()
      this.$emit('content-change', content)
    })
  },
  methods: {
    compile () {
      this.compileCb(this.editor)
    },
    format () {
      this.editor.autoFormatRange(
        { line: 0, ch: 0 },
        { line: this.editor.lineCount() }
      )
    },
    restore () {
      this.restoreCb()
      this.editor.setValue(this.content)
    }
  },
  watch: {
    content (v) {
      this.editor.setValue(v)
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
