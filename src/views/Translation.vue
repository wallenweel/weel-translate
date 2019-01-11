<template>
  <div class="view-translation">
    <div contenteditable ref="pasting" @paste.prevent="onPaste"></div>
    <translation-input class="-input"
      v-model="value"
      :hotkey="hotkey" @enter="handleEnter"
      :has="hasResult" :pasted="hasPasted"
    />

    <translation-tools class="-tools"
      :value="value"
      @query="handleQuery" :flag="translating"
      @clear="handleClear" @paste="handlePaste"
      :fromto="fromto" @change="handleFromto"
      :languages="languages"
      :disabled="!value || !value.length"
    />

    <translation-result class="-result"
      :result="result" :layout="sourceLayout" :has="hasResult"
    />

    <mdc-dialog v-model="open" scrollable
      title="Select Source"
      ref="select"
    >
    </mdc-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { namespace, Getter } from 'vuex-class';
import { MutationMethod, ActionMethod } from 'vuex';
import store from '@/stores/popup';

import TranslationInput from '@/components/TranslationInput.vue';
import TranslationTools from '@/components/TranslationTools.vue';
import TranslationResult from '@/components/TranslationResult.vue';
import debug from '@/functions/debug';

const __ = namespace('translation');
const ___ = namespace('template');

Component.registerHooks(['beforeRouteEnter']);

@Component({
  components: {
    TranslationInput,
    TranslationResult,
    TranslationTools,
  },
})
export default class TranslationView extends Vue {
  private value?: string = '';
  private open?: boolean = false;
  private hasPasted?: boolean = false;

  @___.Getter private sourceLayout!: LayoutPreset;

  @__.State private translating!: boolean;
  @__.State private voicing!: boolean;

  @__.State private text!: string;
  @__.State private result!: translationResult;
  @__.State private hotkey!: string;
  @__.State private source!: SourcePresetItem;

  @__.Getter private fromto!: Array<Language['code']>;
  @__.Getter private hasResult!: boolean;
  @__.Getter private languages!: Language[];

  @__.Mutation('text') private updateText!: MutationMethod;
  @__.Action('fromto') private updateFromto!: ActionMethod;
  @__.Action('translate') private doTranslate!: ActionMethod;

  private handleFromto(fromto: Array<Language['code']>) {
    this.updateFromto(fromto);
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
  private handleQuery() { this.doTranslate(); }
  private onPaste(ev: any) {
    const text = ev.clipboardData.getData('text/plain');
    this.updateText(text);
  }
  private handlePaste() {
    (this.$refs.pasting as HTMLInputElement).focus();
    document.execCommand('paste');
  }

  @Watch('value') private onValue(val: string) {
    this.updateText(val);
  }
  @Watch('text') private onText(val: string) {
    if (val === this.value) { return; }
    this.value = val;
  }

  private beforeRouteEnter(to: any, from: any, next: () => {}) {
    next();
    Vue.nextTick(() => {
      const { params: { text, source } } = to;
      if (!text) { return; }
      store.commit('translation/text', text);
      store.dispatch('translation/translate', { text, source });
    });
  }
}
</script>

<style lang="scss">
.view-translation {
  // padding-bottom: 48px;
  .-result {
    ._section {
      border-radius: 8px 24px;
    }
  }
}
</style>
