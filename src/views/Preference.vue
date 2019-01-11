<template>
  <div class="view-preference">
    <mdc-layout-grid class="-banner">
      <mdc-text typo='overline' tag="span">{{ $t('__tip.preference_top', [$t('reset')]) }}</mdc-text>
    </mdc-layout-grid>

    <option-list class="-options"
      :options="options" :items="items"
      @change="handleChange"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { ActionMethod } from 'vuex';
import { namespace } from 'vuex-class';
import { State } from '@/stores/popup/modules/preference';
import { Option } from '@/types/interface';
import i18n from '@/i18n';
import OptionList from '@/components/OptionList.vue';
import debug from '@/functions/debug';

const _ = namespace('preference');

@Component({
  components: {
    OptionList,
  },
})
export default class PreferenceView extends Vue {
  @_.Getter private locales!: Language[];
  @_.Getter private options!: { [k in keyof State]: any } ;

  @_.Action('save') private saveConfig!: ActionMethod;

  private get items(): Array<Option<State>> {
    const opt = this.options;

    return [{
      headline: this.$t('ui_languages'),
      subheading: `${this.$t('ui_languages')}${this.$t('__unready.locales')}`,
      type: 'radio',
      values: this.locales.reduce((p, c) => [...p!, [this.$t(c.locale as string), c.code]], [] as any),
      name: 'locale',
      value: opt.locale,
    }, {
      headline: this.$t('theme_color'),
      subheading: this.$t('__unready.theme'),
      type: 'radio',
      values: [[this.$t('light'), 'light'], [this.$t('dark'), 'dark']],
      name: 'theme',
      value: opt.theme,
    }, {
      headline: this.$t('hotkey._'),
      subheading: this.$t('hotkey.input'),
      type: 'radio',
      values: [['Enter', 'enter'], ['Ctrl+Enter', 'ctrl+enter']],
      name: 'hotkey',
      value: opt.hotkey,
    }, {
      headline: this.$t('float_action_button'),
      type: 'checkbox',
      label: this.$t('enable_fab'),
      name: 'fabEnable',
      value: opt.fabEnable,
      appends: [
        {
          test: ['fabEnable', true],
          subheading: this.$t('appearance_position'),
          type: 'radio',
          values: [
            [this.$t('after'), 'after'],
            [this.$t('center'), 'center'],
            [this.$t('follow'), 'follow'],
            [this.$t('auto_center'), 'auto-center'],
          ],
          name: 'fabPosition',
          value: opt.fabPosition,
        },
      ],
    }, {
      headline: this.$t('float_action_panel'),
      type: 'checkbox',
      label: this.$t('enable_fap'),
      name: 'fapEnable',
      value: opt.fapEnable,
      appends: [
        {
          test: ['fapEnable', true],
          subheading: this.$t('appearance_position'),
          type: 'radio',
          values: [[this.$t('center'), 'center'], [this.$t('follow'), 'follow'], [this.$t('edge'), 'edge']],
          name: 'fapPosition',
          value: opt.fapPosition,
        }, {
          test: ['fapPosition', 'edge'],
          subheading: this.$t('edge_position'),
          type: 'radio',
          values: [
            [this.$t('top_left'), 'tl'], [this.$t('top_center'), 'tc'], [this.$t('top_right'), 'tr'],
            [this.$t('bottom_left'), 'bl'], [this.$t('bottom_center'), 'bc'], [this.$t('bottom_right'), 'br'],
          ],
          name: 'fapPositionEdge',
          value: opt.fapPositionEdge,
        },
      ],
    }, {
      headline: this.$t('context_menu_trigger'),
      subheading: this.$t('__unready._'),
      type: 'checkbox',
      label: this.$t('enable_context_menu'),
      name: 'contextMenuEnable',
      value: opt.contextMenuEnable,
    }, {
      headline: this.$t('network'),
      subheading: this.$t('set_timeout_seconds', [`${this.options.timeout / 1000}`]),
      type: 'slider',
      meta: { min: 5, max: 60, step: 5 },
      name: 'timeout',
      value: opt.timeout / 1000,
    }, {
      headline: this.$t('recent'),
      subheading: this.$t('set_recent_numbers', [`${this.options.recentNumbers}`]),
      type: 'slider',
      meta: { min: 0, max: 48, step: 2 },
      name: 'recentNumbers',
      value: opt.recentNumbers,
    }];
  }

  private handleChange([k, v]: [string, any]) {
    if (v === this.options[k as keyof State]) { return; }
    this.saveConfig([k, v]);
  }
}
</script>

<style lang="scss">
@import '../assets/styles/global';

.view-preference {
  .-banner {
    @include view-top-tip;
  }

  .-options .-option {
    &[data-name="fapPositionEdge"] {
      .mdc-form-field {
        width: 33.333333%;
        line-height: 1;
      }
    }
  }
}
</style>
