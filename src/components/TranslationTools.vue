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

    <div class="support-languages">
      <mdc-button dense
        @click="selectLanguages(toggle ? 'to' : 'from')"
      >{{ toggle ? toName : fromName }}</mdc-button>

      <mdc-button class="translation-action-switch"
        :disabled="toggleDisabled"
        @click="toggle = !toggle"
      >
        <icon-keyboard-arrow-right v-if="!toggle" />
        <icon-keyboard-arrow-left v-if="toggle" />
      </mdc-button>

      <mdc-button dense
        @click="selectLanguages(toggle ? 'from' : 'to')"
      >{{ toggle ? fromName : toName }}</mdc-button>
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
          <span>{{ lang.locale ? $t(lang.locale) : lang.name }}</span><span>({{ lang.code }})</span>
        </mdc-list-item>
      </mdc-list>
    </mdc-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Model, Vue } from 'vue-property-decorator';
import IconDone from '@/components/icons/Done.vue';
import IconKeyboardArrowLeft from '@/components/icons/KeyboardArrowLeft.vue';
import IconKeyboardArrowRight from '@/components/icons/KeyboardArrowRight.vue';
import debug from '@/functions/debug';

@Component({
  components: {
    IconDone,
    IconKeyboardArrowLeft,
    IconKeyboardArrowRight,
  },
})
export default class TranslationTools extends Vue {
  @Model('change', { type: Array }) private fromto!: Array<Language['code']>;

  @Prop(Array) private languages!: Language[];
  @Prop(Boolean) private disabled?: boolean;
  @Prop(Boolean) private flag?: boolean;

  private progress: number = 1;
  private interval: any;
  private toggle: boolean = false;
  private open: boolean = false;
  private selected: Language['code'] = '';
  private type: 'from' | 'to' | null = null;

  private get toggleDisabled(): boolean {
    return !(this.languages.length >= 2);
  }

  private get from(): Language {
    return this.languages.filter(({ code }) => this.fromto[0] === code)[0] || {};
  }
  private get to(): Language {
    return this.languages.filter(({ code }) => this.fromto[1] === code)[0] || {};
  }
  private get fromName(): string {
    return this.from.locale ? this.$t(this.from.locale) : this.from.name;
  }
  private get toName(): string {
    return this.to.locale ? this.$t(this.to.locale) : this.to.name;
  }

  private handleQuery() {
    this.progress = .05;
      debug.log(this.progress)
    const interval: any = setInterval(() => {
      debug.log(this.progress)
      if (this.progress >= .8) {
        return clearInterval(interval);
      }
      this.progress += parseFloat('0.0' + new Date().getTime().toString().slice(-1));
    }, 200);
    this.$emit('query');
  }

  private handlePaste(ev: Event) {
    this.$emit('paste');
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

  @Watch('toggle')
  private swichLanguages(val: boolean) {
    this.$emit('change', [this.to.code, this.from.code]);
  }

  @Watch('flag')
  private onDone(val: boolean) {
    clearInterval(this.interval);
    this.progress = 1;
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

    &.translation-action-switch {
      border-radius: 36px;
      width: 36px;
      min-width: 36px;
    }
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

