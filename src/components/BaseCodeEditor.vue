<template lang="pug">
v-layout(column style="width: 100%; height: 100%;")
  v-toolbar(dense flat dark color="grey darken-3")
      v-tooltip(bottom)
        v-btn(icon slot="activator" @click="format")
          v-icon code
        span Format
      v-tooltip(bottom)
        v-btn(icon slot="activator" @click="() => editor.undo()")
          v-icon undo
        span Undo
      v-tooltip(bottom)
        v-btn(icon slot="activator" @click="() => editor.redo()")
          v-icon redo
        span Redo

      v-spacer

      //- v-tooltip(bottom)
      //-   v-btn(icon slot="activator" @click="() => $emit('restore')")
      //-     v-icon restore
      //-   span Restore Previous Compilation
      v-tooltip(bottom)
        v-btn(depressed slot="activator" @click="compile")
          span Compile
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
  props: ['editorStyle', 'content', 'mode', 'changes'],
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
    this.editor.on('blur', cm => {
      this.$emit('changes', cm.getValue())
    })
    this.editor.doc.clearHistory()
  },
  methods: {
    format () {
      this.editor.autoFormatRange(
        { line: 0, ch: 0 },
        { line: this.editor.lineCount() }
      )
    },
    compile () {
      this.$emit('compile', this.editor.getValue())
    }
  },
  watch: {
    content (v) {
      if (typeof v !== 'string') return
      this.editor.setValue(v)
    },
    changes () {
      this.editor.doc.clearHistory()
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
