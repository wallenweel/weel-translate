<template>
  <div class="translation-languages">
    <mdc-button dense
      @click="selectLanguage(toggle ? 'to' : 'from')"
    >{{ toggle ? toName : fromName }}</mdc-button>

    <mdc-button class="translation-action-switch"
      :disabled="toggleDisabled"
      @click="toggle = !toggle"
    >
      <icon-keyboard-arrow-right v-if="!toggle" />
      <icon-keyboard-arrow-left v-if="toggle" />
    </mdc-button>

    <mdc-button dense
      @click="selectLanguage(toggle ? 'from' : 'to')"
    >{{ toggle ? fromName : toName }}</mdc-button>

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
import IconKeyboardArrowLeft from '@/components/icons/KeyboardArrowLeft.vue';
import IconKeyboardArrowRight from '@/components/icons/KeyboardArrowRight.vue';

@Component({
  components: {
    IconKeyboardArrowLeft,
    IconKeyboardArrowRight,
  },
})
export default class TranslationToolLanguages extends Vue {
  @Model('change', { type: Array }) private fromto!: Array<Language['code']>;

  @Prop(Array) private languages!: Language[];

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

  private select(code: Language['code']) {
    this.selected = code;
    if (this.type === 'from') { this.$emit('change', [code, this.to.code]); }
    if (this.type === 'to') { this.$emit('change', [this.from.code, code]); }
    this.open = false;
  }

  private selectLanguage(type: 'from' | 'to') {
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
}
</script>

<style lang="scss">
.translation-languages {
  width: 100%;
  margin: 8px 0;
  justify-content: space-evenly;
  align-items: center;
  display: flex;
  button {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

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
