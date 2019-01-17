<template>
  <div class="translation-input" :data-has="has">
    <mdc-textfield class="-textfield" v-model="input" ref="field"
      multiline
      :label="hintText" rows="0" cols="0"
      @keypress.enter="handleEnter"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Model, Watch, Emit } from 'vue-property-decorator';

@Component
export default class TranslationInput extends Vue {
  @Model('change', String) private value?: string;

  @Prop(String) private hotkey?: string;
  @Prop(Boolean) private has?: boolean = false;

  private input: string = this.value || '';
  private get hintText() {
    const hotkey: string = ({
      'enter': 'Enter',
      'ctrl+enter': 'Ctrl + Enter',
    } as { [k: string]: string })[this.hotkey as string];

    return this.$t('input_hint_text', { hotkey });
  }

  @Emit()
  private handleEnter(ev: Event) { this.$emit('enter', ev, this.input); }

  @Watch('input')
  private onChange(text: string) { this.$emit('change', text); }

  @Watch('value')
  private onUpdate(text: string) {
    if (this.input === text) { return; }
    this.input = this.value!;
  }
}
</script>

<style lang="scss">
.translation-input {
  max-width: 100vw;
  // overflow: hidden;
  position: relative;

  &[data-has="true"] {
    .-textfield {
      & > .mdc-text-field {
        .mdc-text-field__input {
          height: 0;
        }
      }
    }
  }

  .-textfield {
    background-color: var(--mdc-theme-primary, #6200ee);
    width: 100%;
    // padding-bottom: 42px;
    & > .mdc-text-field {
      width: inherit;
      margin-top: 0 !important;
      border: none;

      &--disabled {
        opacity: .5;
        &, .mdc-floating-label {
          background-color: transparent;
        }
      }

      .mdc-text-field__input {
        height: var(--app-height);
        max-height: calc(var(--app-height) - var(--app-toolbar-height) - 124px);
        min-height: 3em;
        width: 100%;
        max-width: 100%;
        min-width: calc(100% - 32px);
        padding-top: 0;
        padding-bottom: 0;
        color: var(--mdc-theme-text-primary-on-dark, #ffffff);
        caret-color: currentColor;
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
