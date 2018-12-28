<template>
  <div class="content">
    <mdc-fab class="float-action-button" :style="fabStyle" ref="fab"
      mini absolute
      @click="handleQuery"
    >
      <mdc-icon>
        <icon-translate />
      </mdc-icon>
    </mdc-fab>
    
    <section class="float-action-panel" :style="fapStyle" ref="fap">
      <translation-result class="-result" :result="result" />
    </section>

    <div class="lorem">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut, est cumque saepe sint sed vero ipsa repellat quidem quae eius quod quaerat tenetur asperiores vel autem voluptatibus ullam. Tempore, dolorem.</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import TranslationResult from '@/components/TranslationResult.vue';
import IconTranslate from '@/components/icons/Translate.vue';
import debug from '@/functions/debug';
import { State as S } from '@/stores/content';

@Component({
  components: {
    IconTranslate,
    TranslationResult,
  },
})
export default class Content extends Vue {
  @State private rect!: S['rect'];

  private result: SourcePreset['parser'] = {
    phonetic_src: 'transˈlāSHən',
    phonetic_dest: 'Fan Yi',
    translation: '翻译',
    explain: `Lorem ipsum dolor sit amet consectetur, adipisicing elit.`,
  };
  private fabStyle: string | null = null;
  private fapStyle: string | null = null;

  private get rectCenter(): [number, number] {
    let [x, y] = [0, 0];

    const { offset, size } = this.rect;

    x = offset.x + size.width / 2;
    y = offset.y + size.height / 2;

    return [x, y];
  }

  private fabPostion(): string {
    let [x, y] = this.rectCenter;

    const target = this.$refs.fab as Vue;
    const { offsetHeight: height, offsetWidth: width } = target.$el as HTMLElement;

    x = x - width / 2;
    y = y + height / 2;

    return `transform: translate3d(${x}px, ${y}px, 0);`;
  }
  private fapPostion(): string {
    let [x, y] = this.rectCenter;

    const target = this.$refs.fap as HTMLElement;
    const { offsetHeight: height, offsetWidth: width } = target;

    x = x - width / 2;
    y = y + 16;

    return `transform: translate3d(${x}px, ${y}px, 0);`;
  }

  private handleQuery() {
    debug.log('query in content');
  }

  @Watch('rect')
  private onOffset() {
    this.fabStyle = this.fabPostion();
    this.fapStyle = this.fapPostion();
  }
}
</script>

<style lang="scss">
// @import '~vue-mdc-adapter/dist/vue-mdc-adapter.min.css';

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

@mixin pos($z: 0) {
  transform: translate3d(0, 0, 0);
  z-index: $z;
  // margin: auto;
  top: 0;
  // right: 0;
  // bottom: 0;
  left: 0;
  position: fixed;
}

.float-action-button {
  @include pos(2020);
  
  $sz: 32px;
  height: $sz;
  width: $sz;
  // border-radius: 8px;
  .mdc-icon svg {
    transform: scale(.8);
  }
}

.float-action-panel {
  @include pos(2019);

  width: 240px;

  .-result {
    padding: 0;
  }
}
</style>
