<template>
  <div class="view-settings">
    <mdc-layout-grid class="-banner">
      <mdc-text typo='overline' tag="span">{{ $t('__tip.settings_top', [$t('reset')]) }}</mdc-text>
    </mdc-layout-grid>

    <option-list class="-options"
      :options="settings" :items="items"
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
export default class SettingsView extends Vue {
  @_.Getter private settings!: { [k in keyof State]: any } ;

  @_.Action('save') private saveConfig!: ActionMethod;

  private get items() {
    const opt = this.settings;
    return [{
      headline: this.$t('context_menu_trigger'),
      subheading: this.$t('__unready._'),
      type: 'checkbox',
      label: this.$t('enable_context_menu'),
      name: 'contextMenuEnable',
      value: opt.contextMenuEnable,
    }, {
      headline: this.$t('hotkey._'),
      subheading: this.$t('hotkey.input'),
      type: 'radio',
      values: [['Enter', 'enter'], ['Ctrl+Enter', 'ctrl+enter']],
      name: 'hotkey',
      value: opt.hotkey,
    }, {
      headline: this.$t('recent'),
      subheading: this.$t('set_recent_numbers', [`${opt.recentNumbers}`]),
      type: 'slider',
      meta: { min: 0, max: 48, step: 2 },
      name: 'recentNumbers',
      value: opt.recentNumbers,
    }, {
      headline: this.$t('network'),
      subheading: this.$t('set_timeout_seconds', [`${opt.timeout / 1000}`]),
      type: 'slider',
      meta: { min: 5, max: 60, step: 5 },
      name: 'timeout',
      value: opt.timeout / 1000,
    }];
  }

  private handleChange([k, v]: [string, any]) {
    if (v === this.settings[k as keyof State]) { return; }
    this.saveConfig([k, v]);
  }
}
</script>

<style lang="scss">
@import '../assets/styles/global';

.view-settings {
  .-banner {
    @include view-top-tip;
  }
}
</style>
