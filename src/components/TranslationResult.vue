<template>
  <div class="translation-result">
    <mdc-card>
      <mdc-card-header
        title="Title goes here"
        subtitle="subtitle here" >
      </mdc-card-header>
      <mdc-card-text>{{ result.translation }}</mdc-card-text>
    </mdc-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { templateResultParser } from '@/functions';

@Component
export default class TranslationResult extends Vue {
  private template: parserItem[] = [
    ['translation'],
  ];
  private result: TextParser = {
    translation: `Lorem ipsum dolor sit amet consectetur, adipisicing elit.`,
  };

  private get parsedResult() {
    return templateResultParser(this.template, this.result);
  }
}
</script>

<style lang="scss">
.translation-result {
  padding: 16px;
}
</style>
