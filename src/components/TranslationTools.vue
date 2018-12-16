<template>
  <div class="translation-tools">
    <div class="input-actions">
      <mdc-button class="_button">Clear</mdc-button>
      <mdc-fab class="-done"
        icon="done" mini absolute
        @click="handleTranslate">
      </mdc-fab>
      <mdc-button class="_button">Paste</mdc-button>
    </div>

    <div class="query-process">
      <mdc-linear-progress
        :progress="progress"
        :buffer="progress + .05 >= 1 ? 1 : progress + .05">
      </mdc-linear-progress>
    </div>

    <div class="support-languages">
      <mdc-button dense>English</mdc-button>
      <mdc-icon-toggle class="-switch" v-model="toggle" dense primary
        toggle-off="keyboard_arrow_right"
        toggle-on="keyboard_arrow_left">
      </mdc-icon-toggle>
      <mdc-button dense>中文（简体）</mdc-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import debug from '@/functions/debug';

@Component
export default class TranslationTools extends Vue {
  private toggle: boolean = false;
  private progress: number = .76;
  private handleTranslate(ev: any) {
    debug.log();
    // this.$store.dispatch('translation/queryText', { test: true })
  }
}
</script>

<style lang="scss">

@mixin _specbtn {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
};

.view-translation {
  padding-bottom: 48px;
  .-result {
    ._section {
      border-radius: 8px 24px;
    }
  }
}

.input-actions {
  background: #fff;
  margin: 8px 0;
  padding: 2px 8px;
  justify-content: space-evenly;
  align-items: center;
  display: flex;
  position: relative;
  .-done {
    margin: auto;
    flex-shrink: 0;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
    z-index: 1;
  }
  .mdc-button {
    @include _specbtn;
  }
}

.support-languages {
  width: 100%;
  margin: 8px 0;
  justify-content: space-evenly;
  align-items: center;
  display: flex;
  button {
    @include _specbtn;

    font-size: .625em;
    color: var(--mdc-theme-text-hint-on-dark, #ffffff);
  }
  .-switch {
    height: 32px;
    width: 32px;
    margin: 0 4px;
    flex-shrink: 0;
    display: flex;
  }
}
</style>

