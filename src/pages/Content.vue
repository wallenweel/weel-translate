<template>
  <div class="wrap">
    <transition name="fade">
      <mdc-fab class="float-action-button" :style="fabStyle" ref="fab"
        mini absolute
        @click="handleQuery"
        v-if="fabEnable"
        v-show="hasSelection && !hasResult"
      >
        <mdc-icon>
          <icon-translate style="display: block;" />
        </mdc-icon>
      </mdc-fab>
    </transition>

    <section class="float-action-panel" :style="fapStyle" ref="fap" v-if="fapEnable">
      <transition name="fade">
        <div class="-notofy" v-if="notify">
          <mdc-card class="-wrap">
          <span class="-message">{{ notify }}</span>
          </mdc-card>
        </div>
      </transition>
      
      <div class="-actions" v-show="hasResult && hasSelection">
        <mdc-card class="-action">
          <mdc-card-action-icon class="-button" @click="handleSwapFromto">
            <icon-swap-horiz name="swap languages" />
          </mdc-card-action-icon>
        </mdc-card>
        <mdc-card class="-action">
          <mdc-card-action-icon class="-button" @click="handleWebQuery">
            <icon-pageview name="web infomation" />
          </mdc-card-action-icon>
        </mdc-card>
      </div>

      <translation-result class="-result"
        :result="result" :layout="resultLayout"
        :has="hasResult && hasSelection"
      />
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ActionMethod } from 'vuex';
import { Component, Watch } from 'vue-property-decorator';
import { State, Getter, Action, namespace } from 'vuex-class';
import { State as S } from '@/stores/content';
import TranslationResult from '@/components/TranslationResult.vue';
import IconTranslate from '@/components/icons/Translate.vue';
import IconSwapHoriz from '@/components/icons/SwapHoriz.vue';
import IconPageview from '@/components/icons/Pageview.vue';
import debug from '@/functions/debug';

const _ = namespace('preference');
const __ = namespace('translation');

@Component({
  components: {
    IconTranslate,
    IconSwapHoriz,
    IconPageview,
    TranslationResult,
  },
})
export default class Content extends Vue {
  @State private notify!: null | string;
  @State private rect!: S['rect'];
  @Getter private hasSelection!: boolean;
  @Getter private rectOffsetCC!: [number, number];
  @Getter private rectOffsetTC!: [number, number];
  @Getter private rectOffsetBC!: [number, number];
  @Getter private rectOffsetBR!: [number, number];
  @Getter private isRectUp!: boolean;
  @Getter private resultLayout!: LayoutPreset;

  @_.State private fabEnable!: boolean;
  @_.State private fabPosition!: string;
  @_.State private fapEnable!: boolean;
  @_.State private fapPosition!: string;
  @_.State private fapPositionEdge!: string;

  @__.State private result!: translationResult;
  @__.Getter private fromto!: Array<Language['code']>;
  @__.Getter private hasResult!: boolean;
  @__.Action('translate') private doTranslate: any;
  @__.Action('fromto') private updateFromto: any;

  private fabStyle: string | null = null;
  private fapStyle: string | null = null;
  private mouseOffset: [number, number] = [0, 0];

  private get fabOffset(): [number, number] {
    switch (this.fabPosition) {
      case 'auto-center':
        return this.isRectUp ? this.rectOffsetTC : this.rectOffsetBC;
      case 'center':
        return this.rectOffsetCC;
      case 'after':
        return this.rectOffsetBR;
      case 'follow':
        return this.mouseOffset;
      default:
        return [0, 0];
    }
  }
  private get fapOffset(): [number, number] {
    switch (this.fapPosition) {
      case 'center':
        return this.rectOffsetCC;
      case 'follow':
        return this.fabOffset;
      case 'edge':
        const { innerHeight: height, innerWidth: width } = window;
        type p = PreferenceConfig['preference_fap_position_edge'];
        const offset = {
          tl: [0, 0], tc: [width / 2, 0], tr: [width, 0],
          bl: [0, height], bc: [width / 2, height], br: [width, height],
        }[this.fapPositionEdge as p] as [number, number];
        return offset;
      default:
        return [0, 0];
    }
  }

  private mounted() {
    if (this.fabPosition === 'follow') {
      document.addEventListener('mousemove', this.handleMousemove, false);
    }
  }

  private handleMousemove({ x, y }: MouseEvent): void {
    this.mouseOffset = [x, y];
  }

  private fabLocating(): string {
    let [x, y] = this.fabOffset;

    const target = this.$refs.fab as Vue;
    const { offsetHeight: height, offsetWidth: width } = target.$el as HTMLElement;

    [x, y] = overflow([x - width / 2, y + height / 8], { height, width }, { right: 16 });

    return `transform: translate3d(${x}px, ${y}px, 0);`;
  }
  private fapLocating(): string {
    let [x, y] = this.fapOffset;

    const target = this.$refs.fap as HTMLElement;
    const { offsetHeight: height, offsetWidth: width } = target;

    [x, y] = overflow([x - width / 2, y], { height, width }, { right: 48, left: 16 });

    return `transform: translate3d(${x}px, ${y}px, 0);`;
  }

  private handleQuery() { this.doTranslate(); }
  private async handleSwapFromto() {
    const [from, to] = this.fromto;
    await this.updateFromto([to, from]);
    this.doTranslate();
  }
  private handleWebQuery() {
    debug.log('not implement yet');
  }

  @Watch('rect') private onRect(val: S['rect'], old: S['rect']) {
    ((flag) => {
      if (!flag) { return; }
      this.$nextTick(() => {
        this.fabStyle = this.fabLocating();
      });
    })(this.fabEnable);
  }
  @Watch('hasResult') private onHasResult() {
    ((flag) => {
      if (!flag) { return; }
      this.$nextTick(() => {
        this.fapStyle = this.fapLocating();
      });
    })(this.fapEnable);
  }
  @Watch('fabPosition') private onFabPosition(val: string) {
    if (val === 'follow') {
      document.addEventListener('mousemove', this.handleMousemove, false);
    } else {
      document.removeEventListener('mousemove', this.handleMousemove, false);
    }
  }
}

// calculate situations that overflow viewport
function overflow(
  offset: [number, number],
  target: { height: number, width: number },
  patch?: {
    top?: number, right?: number,
    bottom?: number, left?: number,
  }): [number, number] {
  let [x, y] = offset;
  const { height: th, width: tw } = target;
  const { top: t = 0, right: r = 0, bottom: b = 0, left: l = 0 } = patch || {};
  const { innerHeight: wh, innerWidth: ww } = window;

  // overflow bottom
  if ((y + th + b) > wh) { y = wh - th - b; }
  // overflow right
  if ((x + tw + r) > ww) { x = ww - tw - r; }

  // overflow left
  if (x < 0) { x = 0 + l; }

  return [x, y];
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

.wrap {
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
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

  // user-select: none;
  width: 240px;
  // position: relative;

  .-notofy {
    width: 100%;
    z-index: 11;
    top: 0;
    position: absolute;
    .-wrap {
      opacity: .92;
    }
    .-message {
      padding: 16px;
      font-size: 12px;
    }
  }

  .-actions {
    $sz: 24px;

    width: $sz;
    right: -28px;
    top: 16px;
    position: absolute;
    flex-wrap: wrap;
    display: inline-flex;

    .-action {
      border-radius: $sz / 2;
      margin-bottom: 6px;
    }
    .-button {
      height: $sz;
      width: $sz;
      padding: 4px;
      margin: 0;
      color: var(--mdc-theme-primary);
      &::before, &::after {
        background-color: var(--mdc-theme-primary);
      }
    }
  }

  .-result {
    padding: 0;
  }
}
</style>
