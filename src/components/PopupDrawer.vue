<template>
  <mdc-drawer class="popup-drawer"
    temporary
    toggle-on="toggle-drawer"
    slot="drawer">
    <mdc-card-media :src="logo"></mdc-card-media>
    <mdc-drawer-list class="-list">
      <mdc-drawer-item v-for="(item, i) in items" :key="i"
        :start-icon="item.icon" :to="item.to" :href="item.href"
      >{{ $t(item.locale) }}
      </mdc-drawer-item>
    </mdc-drawer-list>
  </mdc-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import logo from '@/assets/logo.png';
import debug from '@/functions/debug';

interface ListItems {
  [index: number]: {
    icon: string,
    title?: string,
    locale: string,
    to?: string,
    href?: string,
    activated?: boolean;
  };
}

@Component
export default class PopupDrawer extends Vue {
  private logo = logo;
  private items: ListItems = [
    { icon: 'translate', locale: 'translate', to: '/translation' },
    { icon: 'favorite', locale: 'picked', to: '/picked' },
    { icon: 'history', locale: 'history', to: '/history' },
    { icon: 'settings', locale: 'preference', to: '/preference' },
    { icon: 'style', locale: 'presets', to: '/presets' },
  ];
}
</script>

<style lang="scss">
@import '~vue-mdc-adapter/dist/drawer/drawer.min.css';

// .popup-drawer {
//   .mdc-drawer-list {
//     .mdc-drawer-item:last-child {
//       margin-bottom: 56px;
//     }
//   }
// }
</style>

