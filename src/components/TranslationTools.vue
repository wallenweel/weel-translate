<template>
  <div class="translation-tools">
    <div class="input-actions">
      <mdc-button class="_button" :disabled="disabled"
        @click="$emit('clear')">{{ $t('clear') }}</mdc-button>

      <mdc-fab class="-done"
        icon="done" mini absolute
        @click="handleQuery"></mdc-fab>

      <mdc-button class="_button"
        @click="$emit('paste')">{{ $t('paste') }}</mdc-button>
    </div>

    <div class="query-process">
      <mdc-linear-progress
        :progress="progress"
        :buffer="progress + .05 >= 1 ? 1 : progress + .05">
      </mdc-linear-progress>
    </div>

    <div class="support-languages">
      <mdc-button dense
        @click="selectLanguages('from')"
      >{{ $t(from.locale) }}</mdc-button>

      <mdc-icon-toggle class="-switch" v-model="toggle" dense primary
        toggle-off="keyboard_arrow_right"
        toggle-on="keyboard_arrow_left">
      </mdc-icon-toggle>

      <mdc-button dense
        @click="selectLanguages('to')"
      >{{ $t(to.locale) }}</mdc-button>
    </div>

    <mdc-dialog v-model="open" scrollable
      title="Select Language"
      ref="select"
    >
      <mdc-list interactive dense>
        <mdc-list-item
          v-for="(lang, i) in languages" :key="i"
          :ref="lang.code === selected ? 'selected' : null"
          :selected="lang.code === selected"
          @click="select(lang.code)"
        >
          <span>{{ $t(lang.locale) }}</span><span>({{ lang.code }})</span>
        </mdc-list-item>
      </mdc-list>
    </mdc-dialog>

    <mdc-snackbar v-model="snack" ref="snack" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Model, Vue } from 'vue-property-decorator';
import debug from '@/functions/debug';

@Component
export default class TranslationTools extends Vue {
  @Model('change', { type: Array }) private fromto!: Array<Language['code']>;

  @Prop(Array) private languages!: Language[];
  @Prop(Boolean) private disabled?: boolean;
  @Prop(Boolean) private flag?: boolean = false;

  @Prop(String || null)
  private failed?: null | string = null;

  private snack: any = { message: `` };
  private progress: number = 1;
  private interval: any;
  private toggle: boolean = false;
  private open: boolean = false;
  private selected: Language['code'] = '';
  private type: 'from' | 'to' | null = null;

  private get from() {
    return this.languages.filter(({ code }) => this.fromto[0] === code)[0] || '';
  }
  private get to() {
    return this.languages.filter(({ code }) => this.fromto[1] === code)[0] || '';
  }

  private handleQuery() {
    this.progress = .05;
    this.interval = setInterval(() => {
      if (this.progress >= .8) { clearInterval(this.interval); }
      this.progress += .05;
    }, 1000);
    this.$emit('query');
  }

  private select(code: Language['code']) {
    this.selected = code;
    if (this.type === 'from') { this.$emit('change', [code, this.to.code]); }
    if (this.type === 'to') { this.$emit('change', [this.from.code, code]); }
    this.open = false;
  }

  private selectLanguages(type: 'from' | 'to') {
    if (type === 'from') { this.selected = this.from.code; }
    if (type === 'to') { this.selected = this.to.code; }
    this.$nextTick(() => {
      const wrap = this.$refs.select.$el.children[0].children[1];
      wrap.scrollTop = this.$refs.selected[0].$el.offsetTop - 96;

      this.type = type;
      this.open = true;
    });
  }

  @Watch('flag')
  private onDone(val: boolean) {
    clearInterval(this.interval);
    this.progress = 1;
  }
  @Watch('failed')
  private onFailed(val: boolean) {
    const message = typeof this.failed === 'string' ?
      this.failed : `Request failed.`;
    if (val) { this.$refs.snack.show({ message }); }
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

