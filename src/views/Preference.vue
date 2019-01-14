<template>
  <div class="view-preference">
    <mdc-layout-grid class="-banner">
      <mdc-text typo='overline' tag="span">{{ $t('__tip.preference_top', [$t('reset')]) }}</mdc-text>
    </mdc-layout-grid>

    <option-list class="-options"
      :options="preference" :items="items"
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
import OptionList from '@/components/OptionList.vue';
import debug from '@/functions/debug';

const _ = namespace('preference');

@Component({
  components: {
    OptionList,
  },
})
export default class PreferenceView extends Vue {
  @_.Getter private preference!: { [k in keyof State]: any } ;
  @_.Getter private locales!: Language[];

  @_.Action('save') private saveConfig!: ActionMethod;

  private get items(): Array<Option<State>> {
    const opt = this.preference;

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
      appends: [{
        subheading: this.$t('modify_primary_color'),
        type: 'color',
        name: 'primaryColor',
        value: opt.primaryColor,
      }, {
        subheading: this.$t('modify_seconary_color'),
        type: 'color',
        name: 'secondaryColor',
        value: opt.secondaryColor,
      }],
    }, {
      headline: this.$t('float_action_button'),
      type: 'checkbox',
      label: this.$t('enable_fab'),
      name: 'fabEnable',
      value: opt.fabEnable,
      appends: [{
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
      }, {
        test: ['fabEnable', false],
        type: 'checkbox',
        label: this.$t('immediate_fap'),
        name: 'immediateFap',
        value: opt.immediateFap,
      }],
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
    }];
  }

  private handleChange([k, v]: [string, any]) {
    if (v === this.preference[k as keyof State]) { return; }
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
