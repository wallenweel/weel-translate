<template>
  <div class="code-editor">
    <header class="-head" ref="tools">
      <mdc-button>Reset</mdc-button>
      <mdc-button @click="emitSave">Save</mdc-button>
    </header>

    <article class="-body" ref="editor">{{ code }}</article>

    <footer class="-foot" ref="status">
      info:
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
import CodeFlask from 'codeflask';

@Component
export default class CodeEditor extends Vue {
  @Prop(Object || String) private code!: string | object;
  @Prop({ type: String, default: 'json' }) private lang?: string;
  @Prop({ type: Boolean, default: true }) private lineNumbers?: boolean;
  @Prop({ type: Boolean, default: false }) private readonly?: boolean;

  private editor: any = null;

  private mounted() {
    this.editor = new CodeFlask(this.$refs.editor, {
      language: this.lang,
      lineNumbers: this.lineNumbers,
      readonly: this.readonly,
    });

    this.editor.onUpdate(this.emitChange);

    if (this.lang === 'json') {
      this.editor.addLanguage('json', {
        property: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/i,
        string: {
          pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
          greedy: true,
        },
        number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
        punctuation: /[{}[\]);,]/,
        operator: /:/g,
        boolean: /\b(?:true|false)\b/i,
        null: /\bnull\b/i,
      });
    }
  }

  @Emit('change')
  private emitChange(code: string) { return code; }

  @Emit('save')
  private emitSave(code: string) { return this.editor.getCode(); }

  @Watch('code')
  private onCode(code: string) {
    let content: string = code;
    if (typeof code !== 'string') {
      content = JSON.stringify(code, null, 2);
    }
    this.editor.updateCode(content);
  }
}
</script>

<style lang="scss">
.code-editor {
  height: 100%;
  display: flex;
  flex-direction: column;

  .-head {
    position: relative;
  }
  .-body {
    height: 100%;
    position: relative;
  }
  .-foot {
    position: relative;
  }
  
  .codeflask__flatten {
    letter-spacing: 0;
  }
}
</style>
