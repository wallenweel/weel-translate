<template>
  <div class="view-preference">
    <mdc-layout-grid class="-banner">
      <mdc-text typo='overline' tag="span">{{ $t('__tip.preference_top', [$t('reset')]) }}</mdc-text>
    </mdc-layout-grid>

    <mdc-layout-grid class="-options">
      <mdc-layout-cell class="-row">
        <mdc-headline>{{ $t('interface') }}</mdc-headline>
        <mdc-subheading>{{ `${$t('ui_languages')}${$t('__unready.locales')}` }}</mdc-subheading>
        <mdc-radio :picked="locale" @change="handleLocale"
          v-for="(lang, n) in locales" :key="n"
          :checked="lang.code === locale"
          name="ui-language" :value="lang.code" :label="$t(lang.locale)"
        />
      </mdc-layout-cell>

      <mdc-layout-cell class="-row" v-for="(item, i) in items" :key="`item_${i}`">
        <preference-option class="-option"
          :key="`opt_${i}`"
          :wl-value="item.value" :values="options" :item="item"
          @change="handleChange"
        />

        <template v-if="!!item.appends">
          <preference-option class="-option"
            v-for="(append, n) in item.appends" :key="`opt_append_${n}`"
            :wl-value="append.value" :values="options" :item="append"
            @change="handleChange"
          />
        </template>
      </mdc-layout-cell>

      <mdc-layout-cell class="-row">
        <mdc-headline>{{ $t('recent') }}</mdc-headline>
        <mdc-subheading>{{ $t('set_recent_numbers', [recentNumbers]) }}</mdc-subheading>
        <mdc-slider min=0 max=48 step=2 display-markers
          :value="recentNumbers" @change="handleRecentNumbers" />
      </mdc-layout-cell>

      <mdc-layout-cell class="-row">
        <mdc-headline>{{ $t('network') }}</mdc-headline>
        <mdc-subheading>{{ $t('set_timeout_seconds', [timeout / 1000]) }}</mdc-subheading>
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
import i18n from '@/i18n';

import PreferenceOption from '@/components/PreferenceOption.vue';
import debug from '@/functions/debug';

const _ = namespace('preference');

@Component({
  components: {
    PreferenceOption,
  },
})
export default class PreferenceView extends Vue {
  @_.State private timeout!: number;
  @_.State private locale!: Language['code'];

  @_.Getter private locales!: Language[];
  @_.Getter private options!: any;

  @_.Action('merge') private mergeConfig!: any;

  @_.State private recentNumbers!: number;

  private get items(): any {
    return [
      {
        headline: this.$t('theme_color'),
        subheading: this.$t('__unready.theme'),
        type: 'radio',
        name: 'theme-color',
        values: [[this.$t('light'), 'light'], [this.$t('dark'), 'dark']],
        value: 'theme',
      },
      {
        headline: this.$t('hotkey._'),
        subheading: this.$t('hotkey.input'),
        type: 'radio',
        name: 'query-hotkey',
        values: [['Enter', 'enter'], ['Ctrl+Enter', 'ctrl+enter']],
        value: 'hotkey',
      },
      {
        headline: this.$t('float_action_button'),
        type: 'checkbox',
        label: this.$t('enable_fab'),
        value: 'fabEnable',
        appends: [
          {
            test: ['fabEnable', true],
            subheading: this.$t('appearance_position'),
            type: 'radio',
            name: 'fab-position',
            values: [
              [this.$t('after'), 'after'],
              [this.$t('center'), 'center'],
              [this.$t('follow'), 'follow'],
              [this.$t('auto_center'), 'auto-center'],
            ],
            value: 'fabPosition',
          },
        ],
      },
      {
        headline: this.$t('float_action_panel'),
        type: 'checkbox',
        label: this.$t('enable_fap'),
        value: 'fapEnable',
        appends: [
          {
            test: ['fapEnable', true],
            subheading: this.$t('appearance_position'),
            type: 'radio',
            name: 'fap-position',
            values: [[this.$t('center'), 'center'], [this.$t('follow'), 'follow'], [this.$t('edge'), 'edge']],
            value: 'fapPosition',
          },
          {
            test: ['fapPosition', 'edge'],
            subheading: this.$t('edge_position'),
            type: 'radio',
            name: 'fap-position-edge',
            values: [
              [this.$t('top_left'), 'tl'], [this.$t('top_center'), 'tc'], [this.$t('top_right'), 'tr'],
              [this.$t('bottom_left'), 'bl'], [this.$t('bottom_center'), 'bc'], [this.$t('bottom_right'), 'br'],
            ],
            value: 'fapPositionEdge',
          },
        ],
      },
      {
        headline: this.$t('context_menu_trigger'),
        subheading: this.$t('__unready._'),
        type: 'checkbox',
        label: this.$t('enable_context_menu'),
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

  private handleRecentNumbers(count: number) {
    if (count === this.recentNumbers) { return; }
    this.mergeConfig({ recentNumbers: count });
  }
}
</script>

<style lang="scss">
@import '../assets/styles/global';

.view-preference {
  .-banner {
    @include view-top-tip;
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
