<template>
  <mdc-drawer class="popup-drawer" slot="drawer" toggle-on="toggle-drawer">
    <mdc-card-media></mdc-card-media>
    <mdc-drawer-list>
      <mdc-drawer-item start-icon="translate">Translate</mdc-drawer-item>
      <mdc-drawer-item start-icon="settings">Setting</mdc-drawer-item>
      <mdc-drawer-item start-icon="extension">Advance</mdc-drawer-item>
    </mdc-drawer-list>
  </mdc-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class PopupDrawer extends Vue {}
</script>

<style lang="scss">
@import 'vue-mdc-adapter/dist/drawer/styles';
</style>

