<template>
  <div class="view_translation">
    <translation-input></translation-input>

    <div class="translation-tool">
      <mdc-button class="_button">Clear</mdc-button>
      <mdc-fab class="-done" mini icon="done"></mdc-fab>
      <!-- <mdc-button><mdc-icon icon="done"></mdc-icon></mdc-button> -->
      <mdc-button class="_button">Paste</mdc-button>
    </div>

    <div class="translation-languages">
      <mdc-button dense>English</mdc-button>
      <mdc-button dense @click="toggle = !toggle">
        <mdc-icon-toggle :value="toggle"
          toggle-off="keyboard_arrow_right"
          toggle-on="keyboard_arrow_left">
        </mdc-icon-toggle>
        <!-- <mdc-icon icon="arrow_right_alt"></mdc-icon> -->
      </mdc-button>
      <mdc-button dense>Chinese</mdc-button>
    </div>

    <div class="translation-result">
      <mdc-card>
        <mdc-card-header
          title="Title goes here"
          subtitle="subtitle here" >
        </mdc-card-header>
        <mdc-card-text>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure eius necessitatibus, enim natus commodi aut quasi repudiandae eligendi deleniti magnam laborum cupiditate quam, eveniet repellendus architecto. Necessitatibus cumque asperiores consequuntur.</mdc-card-text>
      </mdc-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TranslationInput from '@/components/TranslationInput.vue';

@Component({
  components: {
    TranslationInput,
  },
})
export default class Translation extends Vue {
  private toggle = false;
}
</script>

<style lang="scss">
.translation-tool {
  margin-top: -48px;
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
  background: #fff;
  position: relative;
  padding: 2px 8px;
  align-items: center;

  .-done {
    flex-shrink: 0;
  }
  .mdc-button {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left
  }
}

.translation-languages {
  width: 100%;
  justify-content: center;
  display: flex;

  button {
    color: var(--mdc-theme-text-hint-on-dark, #ffffff);
    .mdc-icon-toggle {
      display: flex;
    }
  }
}


.translation-result {
  padding: 16px;
}
</style>

