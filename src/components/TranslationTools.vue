<template>
  <div class="translation-tools">
    <div class="input-actions">
      <mdc-button class="_button" :disabled="disabled"
        @click="$emit('clear')">{{ $t('clear') }}</mdc-button>

      <mdc-fab class="-done"
        icon="done" mini absolute
        @click="handleQuery"
      >
        <mdc-icon>
          <icon-done />
        </mdc-icon>
      </mdc-fab>

      <mdc-button class="_button"
        @click="handlePaste">{{ $t('paste') }}</mdc-button>
    </div>

    <div class="query-process">
      <mdc-linear-progress
        :progress="progress >= 1 ? 1 : progress"
        :buffer="progress + .05 >= 1 ? 1 : progress + .05">
      </mdc-linear-progress>
    </div>

    <translation-tool-languages
      :languages="languages"
      :fromto="fromto" @change="value => $emit('change', value)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Model, Vue } from 'vue-property-decorator';
import TranslationToolLanguages from '@/components/TranslationToolLanguages.vue';
import IconDone from '@/components/icons/Done.vue';
import debug from '@/functions/debug';

@Component({
  components: {
    TranslationToolLanguages,
    IconDone,
  },
})
export default class TranslationTools extends Vue {
  @Model('change', { type: Array }) private fromto!: Array<Language['code']>;

  @Prop(Array) private languages!: Language[];
  @Prop(Boolean) private disabled?: boolean;
  @Prop(String) private value!: string;
  @Prop(Boolean) private flag!: boolean;

  private progress: number = 1;
  private interval: any;

  private handleQuery() {
    this.$emit('query');

    if (!this.value.trim()) { return; }

    this.progress = .05;
    this.interval = setInterval(() => {
      if (this.progress >= .8) { return clearInterval(this.interval); }
      this.progress += parseFloat('0.0' + new Date().getTime().toString().slice(-1));
    }, 300);
  }

  private handlePaste(ev: Event) {
    this.$emit('paste');
  }

  @Watch('flag')
  private onDone(val: boolean) {
    clearInterval(this.interval);
    this.progress = 1;
  }
}
</script>

<style lang="scss">
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
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
