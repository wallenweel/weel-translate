<template>
  <mdc-drawer class="options-drawer" toggle-on="toggle-drawer" @change="$emit('change')">
    <mdc-drawer-list class="-list">
      <mdc-drawer-item v-for="(item, i) in items" :key="i"
        :to="item.to" :href="item.href"
      >
        <mdc-icon style="margin-right: 16px;">
          <icon-translate v-if="item.icon === 'translate'" />
          <icon-style v-if="item.icon === 'style'" />
          <icon-code v-if="item.icon === 'code'" />
          <icon-pageview v-if="item.icon === 'pageview'" />
        </mdc-icon>
        {{ $t(item.locale) }}
      </mdc-drawer-item>
    </mdc-drawer-list>
  </mdc-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import IconTranslate from '@/components/icons/Translate.vue';
import IconStyle from '@/components/icons/Style.vue';
import IconPageview from '@/components/icons/Pageview.vue';
import IconCode from '@/components/icons/Code.vue';
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
    IconCode,
    IconStyle,
    IconPageview,
  },
})
export default class PopupDrawer extends Vue {
  private items: ListItems = [
    { icon: 'translate', locale: 'translation_preset', to: '/translation-preset' },
    { icon: 'pageview', locale: 'web_preset', to: '/web-preset' },
    { icon: 'code', locale: 'template_preset', to: '/template-preset' },
    { icon: 'style', locale: 'style_preset', to: '/style-preset' },
  ];
}
</script>

<style lang="scss">
@import '~vue-mdc-adapter/dist/drawer/drawer.min.css';

.options-drawer {
  height: var(--app-height);
  z-index: 2;
  position: relative;

  .mdc-drawer__drawer {
    background-color: var(--mdc-theme-background);
  }

  .mdc-drawer-list {
    .mdc-drawer-item:last-child {
      margin-bottom: 56px;
    }
  }
}
</style>

