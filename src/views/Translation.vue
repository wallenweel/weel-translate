<template>
  <div class="view-translation">
    <translation-input></translation-input>

    <div class="translation-tool">
      <mdc-button class="_button">Clear</mdc-button>
      <mdc-fab class="-done" icon="done" mini absolute></mdc-fab>
      <mdc-button class="_button">Paste</mdc-button>
    </div>

    <div class="translation-process">
      <mdc-linear-progress :progress="progress" :buffer="progress + .05"></mdc-linear-progress>
    </div>

    <div class="translation-languages">
      <mdc-button dense>English</mdc-button>
      <mdc-icon-toggle class="-switch" v-model="toggle" dense primary
        toggle-off="keyboard_arrow_right"
        toggle-on="keyboard_arrow_left">
      </mdc-icon-toggle>
      <mdc-button dense>中文（简体）</mdc-button>
    </div>

    <translation-result class="-result"></translation-result>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TranslationInput from '@/components/TranslationInput.vue';
import TranslationResult from '@/components/TranslationResult.vue';
import debug from '@/functions/debug';

@Component({
  components: {
    TranslationInput,
    TranslationResult,
  },
})
export default class TranslationView extends Vue {
  private toggle: boolean = false;
  private progress: number = .5;
}
</script>

<style lang="scss">
@import 'vue-mdc-adapter/dist/fab/styles';
@import 'vue-mdc-adapter/dist/card/styles';
@import 'vue-mdc-adapter/dist/linear-progress/styles';

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

.translation-tool {
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

.translation-languages {
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

