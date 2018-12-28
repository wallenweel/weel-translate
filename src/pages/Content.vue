<template>
  <div class="content">
    <mdc-fab class="float-action-button"
      mini absolute
      @click="handleQuery"
    >
      <mdc-icon>
        <icon-translate />
      </mdc-icon>
    </mdc-fab>
    
    <translation-result class="float-action-panel -result" :result="result" />

    <div class="lorem">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut, est cumque saepe sint sed vero ipsa repellat quidem quae eius quod quaerat tenetur asperiores vel autem voluptatibus ullam. Tempore, dolorem.</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import TranslationResult from '@/components/TranslationResult.vue';
import IconTranslate from '@/components/icons/Translate.vue';
import debug from '@/functions/debug';

@Component({
  components: {
    IconTranslate,
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

  private handleQuery() {
    debug.log('query in content');
  }
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

.content {
  --mdc-typography-font-family: "Roboto Mono", "Microsoft Yahei", "sans-serif", monospace;
  --mdc-theme-primary: #6200ee;
  --mdc-theme-secondary: #6200ee;
  --mdc-theme-background: #fff;
  --mdc-theme-surface: #fff;
  --mdc-theme-on-primary: #fff;
  --mdc-theme-on-secondary: #fff;
  --mdc-theme-on-surface: #000;
  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);
  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);
  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);
  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);
  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);
  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);
  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);
  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);
  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);
  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);
  --mdc-theme-text-primary-on-dark: white;
  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);
  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);
  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);
  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5);
}

.float-action-button {
  $sz: 32px;
  height: $sz;
  width: $sz;
  // border-radius: 8px;
  .mdc-icon svg {
    transform: scale(.8);
  }
}

.float-action-panel {
  width: 240px;

  &.-result {
    position: absolute;
  }
}
</style>
