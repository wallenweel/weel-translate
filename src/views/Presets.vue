<template>
  <div class="view-presets">
    <mdc-layout-grid class="-banner">
      <mdc-text typo='overline' tag="span">{{ $t('__tip.preset_top', [$t('reset')]) }}</mdc-text>
    </mdc-layout-grid>

    
    <mdc-layout-grid class="-options">
      <mdc-layout-cell class="-row">
        <mdc-headline>{{ $t('interface') }}</mdc-headline>
        <mdc-subheading>{{ `${$t('ui_languages')}${$t('__unready.locales')}` }}</mdc-subheading>
        <mdc-radio :picked="locale" @change="(val) => handleLocale({ local: val })"
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
        <mdc-slider min=5 max=60 step=5 display-markers
          :value="timeout / 1000" @change="handleTimeout" />
      </mdc-layout-cell>
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
@import '../assets/styles/global';

.view-presets {
  .-banner {
    @include view-top-tip;
  }
}
</style>
