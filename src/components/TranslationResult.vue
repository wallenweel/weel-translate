<template>
  <div class="translation-result">
    <mdc-card class="-section" v-for="(section, i) in parsedResult" :key="i">
      <div class="__row" v-for="(value, key) in section" :key="key">
        <span :v="value" v-if="!isValue(value)">{{ value }}</span>
        <mdc-card-text class="-text" v-if="isValue(value)">{{ value }}</mdc-card-text>
      </div>
    </mdc-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { templatePresetParser } from '@/functions';
import { popup as popupTemplate } from '@/defaults/templates';

@Component
export default class TranslationResult extends Vue {
  private template: templatePreset = popupTemplate;
  private result: TextParser = {
    phonetic: 'fəˈnetik',
    translation: `Lorem ipsum dolor sit amet consectetur, adipisicing elit.`,
  };

  private created() {
    // tslint:disable-next-line:no-console
    console.log(this.parsedResult);
  }

  private get parsedResult(): string[][] {
    const out: any[] = [];
    // const origin = templatePresetParser(this.template, this.result);

    // let n: number = 0;
    // for (const item of origin) {
    //   if (!item.length) { n++; continue; }

    //   if (typeof out[n] === 'undefined') { out[n] = []; }

    //   out[n].push(...item);
    // }

    return out;
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
