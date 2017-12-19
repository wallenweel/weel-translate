<template lang="pug">
  v-layout(row)
    v-layout(:class="$style.codeArea")
      textarea(ref="codeMirror")
    v-layout
      v-btn(@click="test") a
</template>

<script>
export default {
  name: 'ServiceSourceAPI',
  data () {
    return {
      editor: null
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

      lineWrapping: true,
      foldGutter: true,
      gutters: [
        'CodeMirror-linenumbers',
        'CodeMirror-foldgutter',
        'CodeMirror-lint-markers'
      ],
      styleActiveLine: true,
      showCursorWhenSelecting: true,
      keyMap: 'sublime'
    })
  },
  methods: {
    test () {
      console.log('editor', this.editor)
    }
  }
}
</script>

<style lang="scss" module>
.codeArea {
  max-width: 50%;
  :global {
    .CodeMirror {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
