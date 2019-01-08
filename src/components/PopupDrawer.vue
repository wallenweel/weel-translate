<template>
  <mdc-drawer class="popup-drawer"
    temporary
    toggle-on="toggle-drawer"
    slot="drawer">
    <mdc-card-media :src="drawerHead"></mdc-card-media>
    <mdc-drawer-list class="-list">
      <mdc-drawer-item v-for="(item, i) in items" :key="i"
        :to="item.to" :href="item.href"
      >
        <mdc-icon style="margin-right: 16px;">
          <icon-translate v-if="item.icon === 'translate'" />
          <icon-favorite v-if="item.icon === 'favorite'" />
          <icon-history v-if="item.icon === 'history'" />
          <icon-settings v-if="item.icon === 'settings'" />
          <icon-style v-if="item.icon === 'style'" />
        </mdc-icon>
        {{ $t(item.locale) }}
      </mdc-drawer-item>
    </mdc-drawer-list>
  </mdc-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import drawerHead from '@/assets/drawer_head.png';
import IconTranslate from '@/components/icons/Translate.vue';
import IconFavorite from '@/components/icons/Favorite.vue';
import IconHistory from '@/components/icons/History.vue';
import IconSettings from '@/components/icons/Settings.vue';
import IconStyle from '@/components/icons/Style.vue';
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

@Component({
  components: {
    IconTranslate,
    IconFavorite,
    IconHistory,
    IconSettings,
    IconStyle,
  },
})
export default class PopupDrawer extends Vue {
  private drawerHead = drawerHead;
  private items: ListItems = [
    { icon: 'translate', locale: 'translate', to: '/translate' },
    { icon: 'favorite', locale: 'picked', to: '/picked' },
    { icon: 'history', locale: 'recent', to: '/recent' },
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

