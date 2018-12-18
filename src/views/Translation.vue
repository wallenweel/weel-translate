<template>
  <div class="view-translation">
    <translation-input class="-input"
      :value="value" @change="handleText"
      :hotkey="hotkey"
      @enter="handleEnter"
    >
    </translation-input>

    <translation-tools class="-tools"
      :fromto="fromto"
      @change="handleFromto"
      :languages="languages"
      :disabled="!value || !value.length"
      @clear="handleClear"
      @query="handleQuery" :flag="flag" :failed="failed"
      @paste="handlePaste"
    ></translation-tools>

    <translation-result class="-result"
      :result="result"
    ></translation-result>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import TranslationInput from '@/components/TranslationInput.vue';
import TranslationTools from '@/components/TranslationTools.vue';
import TranslationResult from '@/components/TranslationResult.vue';
import debug from '@/functions/debug';

const __ = namespace('translation');

@Component({
  components: {
    TranslationInput,
    TranslationResult,
    TranslationTools,
  },
})
export default class TranslationView extends Vue {
  private value?: string = '';
  private flag?: boolean = false;

  @__.State private text!: string;
  @__.State private languages!: Language[];
  @__.State private result!: translationResult;
  @__.State private failed!: null | string;
  @__.State private hotkey!: string;
  @__.State private source!: SourcePresetItem;

  @__.Getter private fromto!: Array<Language['code']>;

  @__.Action('text') private updateText: any;
  @__.Action('fromto') private updateFromto: any;
  @__.Action('translate') private doTranslate: any;

  private created() {
    this.value = this.text;
  }

  private handleFromto(fromto: Array<Language['code']>) {
    this.updateFromto(fromto);
  }

  private handleText(text: string) {
    this.value = text;
    this.updateText(text);
  }

  private handleEnter(ev: any) {
    const { ctrlKey }: { ctrlKey: boolean } = ev;

    if (this.hotkey === 'enter' && !ctrlKey) {
      ev.preventDefault();
      return this.doTranslate();
    }
    if (this.hotkey === 'enter' && ctrlKey) {
      this.value = `${this.text}\n`;
    }
    if (this.hotkey === 'ctrl+enter' && ctrlKey) {
      ev.preventDefault();
      return this.doTranslate();
    }
  }

  private handleClear() { this.value = ''; }
  private handleQuery() {
    this.doTranslate().then(() => {
      this.$i18n.locale = 'zh-cn';
      this.flag = !this.flag;
    });
  }
  private handlePaste() {/** */}
}
</script>

<style lang="scss">
</style>

