<template>
  <div class="content">
    <translation-result :result="result" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import TranslationResult from '@/components/TranslationResult.vue';

@Component({
  components: {
    TranslationResult,
  },
})
export default class Content extends Vue {
  private result: SourcePreset['parser'] = {
    phonetic_src: 'transˈlāSHən',
    phonetic_dest: 'Fan Yi',
    translation: '翻译',
    explain: `Lorem ipsum dolor sit amet consectetur, adipisicing elit.`,
  };
}
</script>

<style lang="scss">
// @import '~vue-mdc-adapter/dist/vue-mdc-adapter.min.css';

$mdc-theme-primary: #6200ee;
$mdc-theme-secondary: #6200ee;
$mdc-typography-font-family: "Roboto Mono", "Microsoft Yahei", "sans-serif", monospace;

@import 'vue-mdc-adapter/dist/theme/styles';
@import 'vue-mdc-adapter/dist/typography/styles';
@import 'vue-mdc-adapter/dist/ripple/styles';
@import 'vue-mdc-adapter/dist/icon/styles';

@import '~vue-mdc-adapter/dist/layout-app/layout-app.min.css';
@import '~vue-mdc-adapter/dist/icon-toggle/icon-toggle.min.css';
@import '~vue-mdc-adapter/dist/button/button.min.css';
@import '~vue-mdc-adapter/dist/fab/fab.min.css';
@import '~vue-mdc-adapter/dist/card/card.min.css';
@import '~vue-mdc-adapter/dist/linear-progress/linear-progress.min.css';
</style>
