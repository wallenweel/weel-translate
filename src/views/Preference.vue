<template>
  <div class="view-preference">
    <mdc-layout-grid class="-banner">
      <mdc-text typo='overline' tag="span">{{ $t('preference_top_tip', [$t('reset')]) }}</mdc-text>
    </mdc-layout-grid>

    <mdc-layout-grid class="-options">
      <mdc-layout-cell class="-row">
        <mdc-headline>{{ $t('interface') }}</mdc-headline>
        <mdc-subheading>{{ $t('ui_languages') }}</mdc-subheading>
        <mdc-radio :picked="locale" @change="handleLocale"
          v-for="(lang, n) in locales" :key="n"
          :checked="lang.code === locale"
          name="ui-language" :value="lang.code" :label="$t(lang.locale)"
        />
      </mdc-layout-cell>

      <mdc-layout-cell class="-row" v-for="(item, i) in items" :key="`item_${i}`">
        <preference-option class="-option" :wl-value="item.value"
          :values="options" :item="item" @change="handleChange" :key="`opt_${i}`" />

        <template v-if="!!item.appends" v-for="(append, n) in item.appends">
          <preference-option class="-option" :wl-value="append.value"
            :values="options" :item="append" @change="handleChange" :key="`opt_${n}`" />
        </template>
      </mdc-layout-cell>

      <mdc-layout-cell class="-row">
        <mdc-headline>{{ $t('network') }}</mdc-headline>
        <mdc-subheading>{{ $t('set_timeout_seconds', { time: timeout / 1000 }) }}</mdc-subheading>
        <mdc-slider min=0 max=120 step=10 display-markers
          :value="timeout / 1000" @change="handleTimeout" />
      </mdc-layout-cell>
    </mdc-layout-grid>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import PreferenceOption from '@/components/PreferenceOption.vue';
import debug from '@/functions/debug';

const __ = namespace('preference');

@Component({
  components: {
    PreferenceOption,
  },
})
export default class PreferenceView extends Vue {
  @__.State private timeout!: number;
  @__.State private locale!: Language['code'];
  @__.State private locales!: Language[];

  @__.Getter private options!: any;

  @__.Action('merge') private mergeConfig!: any;

  private get items(): any {
    return [
      {
        headline: 'theme_color',
        type: 'radio',
        name: 'theme-color',
        values: [['light', 'light'], ['dark', 'dark']],
        value: 'theme',
      },
      {
        headline: 'float_action_button',
        type: 'checkbox',
        label: 'enable_fab',
        value: 'fabEnable',
        appends: [
          {
            test: ['fabEnable', true],
            subheading: 'appearance_position',
            type: 'radio',
            name: 'fab-position',
            values: [['after', 'after'], ['center', 'center'], ['follow', 'follow'], ['auto_center', 'auto-center']],
            value: 'fabPosition',
          },
        ],
      },
      {
        headline: 'float_action_panel',
        type: 'checkbox',
        label: 'enable_fap',
        value: 'fapEnable',
        appends: [
          {
            test: ['fapEnable', true],
            subheading: 'appearance_position',
            type: 'radio',
            name: 'fap-position',
            values: [['center', 'center'], ['follow', 'follow'], ['edge', 'edge']],
            value: 'fapPosition',
          },
          {
            test: ['fapPosition', 'edge'],
            subheading: 'edge_position',
            type: 'radio',
            name: 'fap-position-edge',
            values: [
              ['top_left', 'tl'], ['top_center', 'tc'], ['top_right', 'tr'],
              ['bottom_left', 'bl'], ['bottom_center', 'bc'], ['bottom_right', 'br'],
            ],
            value: 'fapPositionEdge',
          },
        ],
      },
      {
        headline: 'context_menu_trigger',
        type: 'checkbox',
        label: 'enable_context_menu',
        value: 'contextMenuEnable',
      },
    ];
  }

  private handleChange(change: { [k: string]: any }) {
    this.mergeConfig(change);
  }

  private handleLocale(locale: Language['code']) {
    this.mergeConfig({ locale });
    this.$i18n.locale = locale;
  }

  private handleTimeout(time: number) {
    if (time === this.timeout / 1000) { return; }
    this.mergeConfig({ timeout: time * 1000 });
  }
}
</script>

<style lang="scss">
.view-preference {
  .-banner {
    background-color: var(--mdc-theme-primary, #6200ee);
    color: var(--mdc-theme-text-primary-on-dark, #ffffff);
    padding: 0 16px 16px;
  }

  .mdc-headline,
  .mdc-subheading {
    width: 100%;
    margin: 8px 0;
    flex-shrink: 0;
  }
  .mdc-headline {
    border-radius: 0 16px 16px 0;
    background-color: var(--mdc-theme-primary, #6200ee);
    color: var(--mdc-theme-text-primary-on-dark, #ffffff);
    font-size: 1rem;
    position: relative;
    &::before {
      content: "";
      background-color: var(--mdc-theme-primary, #6200ee);
      height: 100%;
      width: 16px;
      margin: auto;
      left: -16px;
      top: 0;
      bottom: 0;
      position: absolute;
      display: block;
    }
  }
  .mdc-subheading {
    font-size: .75rem;
  }

  .-options {
    label {
      font-size: .75rem;
    }

    .-row {
      padding: 0 16px 16px;
    }

    .-option {
      flex-wrap: wrap;
      display: flex;

      &[wl-value="fapPositionEdge"] {
        .mdc-form-field {
          width: 33.333333%;
          line-height: 1;
        }
      }
    }
  }
}
</style>
