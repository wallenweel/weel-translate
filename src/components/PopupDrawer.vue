<template>
  <mdc-drawer class="popup-drawer"
    temporary
    toggle-on="toggle-drawer"
    slot="drawer">
    <mdc-card-media class="-head" :src="drawerHead">
      <nav class="-feedback">
        <a :href="nav.issues" target="_blank" title="issues"><icon-feedback type="sharp" /></a>
        <a :href="nav.github" target="_blank" title="github"><icon-github /></a>
      </nav>
    </mdc-card-media>
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
import IconFeedback from '@/components/icons/Feedback.vue';
import IconGithub from '@/components/icons/Github.vue';
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
    IconFeedback,
    IconGithub,
  },
})
export default class PopupDrawer extends Vue {
  private drawerHead: any = drawerHead;
  private nav: any = {
    github: 'https://github.com/wallenweel/weel-translate',
    issues: 'https://github.com/wallenweel/weel-translate/issues',
  };
  private items: ListItems = [
    { icon: 'translate', locale: 'translate', to: '/translate' },
    { icon: 'favorite', locale: 'picked', to: '/picked' },
    { icon: 'history', locale: 'recent', to: '/recent' },
    { icon: 'style', locale: 'preference', to: '/preference' },
    { icon: 'settings', locale: 'settings', to: '/settings' },
  ];
}
</script>

<style lang="scss">
@import '~vue-mdc-adapter/dist/drawer/drawer.min.css';

.popup-drawer {
    .-head {
      &:hover {
        .-feedback {
          opacity: 1;
        }
      }
    }
  .-feedback {
    opacity: 0;
    transition: opacity .25s ease-in;
    background-color: rgba(0, 0, 0, .45);
    height: 100%;
    width: 100%;
    display: flex;
    > a {
      color: white;
      margin-top: auto;
      padding: 8px;

      opacity: 1;
      transition: opacity .125s ease-in;
      &:hover {
        opacity: .8;
      }
    }
    svg {
      &[name="github"] {
        path {
          transform: scale(1.24);
        }
      }
    }
  }
}
</style>

