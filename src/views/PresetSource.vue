<template>
  <div class="view-source-preset">
    <section class="-editor" ref="editor" style="height: 100vh;">{{ code }}</section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CodeFlask from 'codeflask';
import { Component } from 'vue-property-decorator';
import debug from '@/functions/debug';

@Component
export default class SourcePresetView extends Vue {
  private code: string = '{ "test": "testt" }';

  private mounted() {
    const flask = new CodeFlask('.-editor', { language: 'json' });
    flask.addLanguage('json', {
      property: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/i,
      string: {
        pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
        greedy: true
      },
      number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
      punctuation: /[{}[\]);,]/,
      operator: /:/g,
      boolean: /\b(?:true|false)\b/i,
      null: /\bnull\b/i,
    });
  }
}
</script>

<style lang="scss">
.codeflask__flatten {
  letter-spacing: 0;
}
</style>
