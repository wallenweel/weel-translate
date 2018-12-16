<template>
  <div class="translation-input">
    <mdc-textfield class="-textfield"
      v-model="input" @keypress.enter="handleEnter"
      multiline
      label="Hint text" rows="0" cols="0">
    </mdc-textfield>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Model, Watch, Emit } from 'vue-property-decorator';

@Component
export default class TranslationInput extends Vue {
  @Model('change', String) private value?: string;

  private input: string = this.value || '';

  @Watch('input')
  private onChange(text: string) { this.$emit('change', text); }
  @Watch('value')
  private onUpdate(text: string) {
    if (this.input === text) { return; }
    this.input = this.value!;
  }

  @Emit()
  private handleEnter(ev: Event) { this.$emit('enter', ev, this.input); }
}
</script>

<style lang="scss">
@import '~vue-mdc-adapter/dist/textfield/textfield.min.css';

.translation-input {
  max-width: 100vw;
  // overflow: hidden;
  position: relative;

  .-textfield {
    background-color: var(--mdc-theme-primary, #6200ee);
    width: 100%;
    // padding-bottom: 42px;
    & > .mdc-text-field {
      width: inherit;
      margin-top: 0;
      border: none;

      &--disabled {
        opacity: .5;
        &, .mdc-floating-label {
          background-color: transparent;
        }
      }

      .mdc-text-field__input {
        height: 4em;
        max-height: 16em;
        min-height: 2em;
        width: 100%;
        max-width: 100%;
        min-width: calc(100% - 32px);
        padding-top: 0;
        color: var(--mdc-theme-text-primary-on-dark, #ffffff);
      }
      .mdc-text-field:not(.mdc-text-field--disabled),
      .mdc-floating-label {
        color: var(--mdc-theme-text-hint-on-dark, #ffffff);
      }
      .mdc-floating-label {
        top: 0;
        &--float-above {
          color: transparent;
        }
      }
    }
  }
}
</style>
