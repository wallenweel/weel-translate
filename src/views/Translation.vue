<template>
  <div class="view-translation">
    <translation-input class="-input"
      :value="value" @change="mutateText"
      @enter="handleEnter"
    >
    </translation-input>
    <!-- <translation-input class="-input" v-model="text"></translation-input> -->
    <translation-tools class="-tools"></translation-tools>
    <translation-result class="-result"></translation-result>
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

  @__.State private text!: string;
  @__.State private hotkey!: string;

  @__.Mutation('text')
  private mutateText: any;

  @__.Action('query')
  private translate: any;

  private created() {
    this.value = this.text;
  }

  private handleEnter(ev: any) {
    const { ctrlKey }: { ctrlKey: boolean } = ev;

    if (this.hotkey === 'enter' && !ctrlKey) {
      ev.preventDefault();
      // return this.translate();
    }
    if (this.hotkey === 'enter' && ctrlKey) {
      this.value = `${this.text}\n`;
    }
    if (this.hotkey === 'ctrl+enter' && ctrlKey) {
      ev.preventDefault();
      // return this.translate();
    }
  }
}
</script>

<style lang="scss">
@import 'vue-mdc-adapter/dist/fab/styles';
@import 'vue-mdc-adapter/dist/card/styles';
@import 'vue-mdc-adapter/dist/linear-progress/styles';
</style>

