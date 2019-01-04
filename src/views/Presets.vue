<template>
  <div class="view-presets">
    <mdc-layout-grid class="-banner">
      <mdc-text typo='overline' tag="span">{{ $t('__tip.preset_top', [$t('reset')]) }}</mdc-text>
    </mdc-layout-grid>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class PresetsView extends Vue {}
</script>

<style lang="scss">
@import "../assets/styles";

.view-presets {
  .-banner {
    @include view-top-tip;
  }
}
</style>
