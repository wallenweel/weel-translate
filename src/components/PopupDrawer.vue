<template>
  <mdc-drawer class="popup-drawer" slot="drawer" toggle-on="toggle-drawer">
    <mdc-card-media :src="logo"></mdc-card-media>
    <mdc-drawer-list class="-list">
      <mdc-drawer-item start-icon="translate">Translate</mdc-drawer-item>
      <mdc-drawer-item start-icon="favorite">Picked</mdc-drawer-item>
      <mdc-drawer-item start-icon="history">History</mdc-drawer-item>
      <mdc-drawer-item start-icon="style">Template Presets</mdc-drawer-item>
      <mdc-drawer-item start-icon="settings">Settings</mdc-drawer-item>
      <mdc-drawer-item start-icon="extension">Advance Options</mdc-drawer-item>
    </mdc-drawer-list>
  </mdc-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import logo from '@/assets/logo.png';

@Component
export default class PopupDrawer extends Vue {
  private logo = logo;
}
</script>

<style lang="scss">
// @import 'vue-mdc-adapter/dist/drawer/styles';

// .popup-drawer {
//   .mdc-drawer-list {
//     .mdc-drawer-item:last-child {
//       margin-bottom: 56px;
//     }
//   }
// }
</style>

