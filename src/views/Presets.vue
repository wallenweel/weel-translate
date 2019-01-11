<template>
  <div class="view-presets">
    <mdc-layout-grid class="-banner">
      <mdc-text typo='overline' tag="span">{{ $t('__tip.preset_top', [$t('reset')]) }}</mdc-text>
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
// import { State } from '@/stores/popup/modules/preference';
import { Option } from '@/types/interface';
import i18n from '@/i18n';
import OptionList from '@/components/OptionList.vue';
import debug from '@/functions/debug';

// const _ = namespace('preference');

@Component({
  components: {
    OptionList,
  },
})
export default class PresetseView extends Vue {
  private items: any = [];
  private options: any = {};

  private handleChange([k, v]: [string, any]) {
    // if (v === this.options[k as keyof State]) { return; }
    // this.saveConfig([k, v]);
  }
}
</script>

<style lang="scss">
@import '../assets/styles/global';

.view-presets {
  .-banner {
    @include view-top-tip;
  }
}
</style>
