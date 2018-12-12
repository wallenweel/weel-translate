<template>
  <div class="translation-result">
    <mdc-card :class="`_section--${layout.id}`">
      <mdc-card-text v-for="(row, n) in this.parsedRows" :key="n"
        :class="`_row--${n}`">
        <span v-for="(value, i) in row" :key="i"
          :class="`_span--${i}`">{{value}}</span>
      </mdc-card-text>
    </mdc-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { templateLayoutParser } from '@/functions';
import { popup as popupLayout } from '@/defaults/layouts/translation';
import debug from '@/functions/debug';
import defaultConfig from '@/defaults/config';

@Component
export default class TranslationResult extends Vue {
  private layout: templatePreset = popupLayout;
  private result: SourcePreset['parser'] = {
    phonetic_src: 'transˈlāSHən',
    phonetic_dest: 'Fan Yi',
    translation: '翻译',
    explain: `Lorem ipsum dolor sit amet consectetur, adipisicing elit.`,
  };

  private created() {
    debug.log(defaultConfig);
  }

  private get parsedRows(): templatePreset['rows'] {
    const [, rows] = templateLayoutParser(this.result, this.layout.rows);
    return rows!;
  }

  private isValue(value: string): boolean {
    return Object.values(this.result).includes(value);
  }
}
</script>

<style lang="scss">
.translation-result {
  padding: 16px;

  .-section {
    margin: 8px 0;
  }
}
</style>
