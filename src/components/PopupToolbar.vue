<template>
  <mdc-toolbar class="popup-toolbar" waterfall slot="toolbar" ref="wrap">
    <mdc-toolbar-row>
      <mdc-toolbar-section align-start>
        <mdc-toolbar-menu-icon event="toggle-drawer" style="padding: 0;">
          <mdc-icon>
            <icon-menu />
          </mdc-icon>
        </mdc-toolbar-menu-icon>
        <mdc-toolbar-title>{{ $t(title) }}</mdc-toolbar-title>

        <!-- Source -->
        <mdc-button class="-spec -source" dense
          v-if="title.toLowerCase() === 'translate'"
          @click="sourceMenu = true"
        >{{ source.name }}</mdc-button>
        <mdc-menu-anchor v-if="title.toLowerCase() === 'translate'">
          <mdc-menu v-model="sourceMenu" @select="handleSourceSelect">
            <mdc-menu-item disabled>{{ source.name }}</mdc-menu-item>
            <mdc-menu-divider />
            <mdc-menu-item
              v-for="(item, i) in enabledSources" :key="i"
              v-if="item.id !== source.id"
              :data-id="item.id"
            >{{ item.name }}</mdc-menu-item>
          </mdc-menu>
        </mdc-menu-anchor>

        <!-- Reset -->
        <mdc-button class="-spec -reset" @click="handlePreferenceReset"
          dense v-if="title.toLowerCase() === 'preference'"
        >{{ $t('reset') }}</mdc-button>
      </mdc-toolbar-section>
    </mdc-toolbar-row>
  </mdc-toolbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import IconMenu from '@/components/icons/Menu.vue';
import debug from '@/functions/debug';
import { ActionMethod } from 'vuex';

const _ = namespace('preference');
const __ = namespace('translation');

@Component({
  components: {
    IconMenu,
  },
})
export default class PopupToolbar extends Vue {
  @_.Action('reset') private resetPreference!: ActionMethod;

  @__.State private source!: SourcePresetItem;
  @__.State private enabledSources!: SourcePresetItem[];
  @__.Action('source') private changeSource!: ActionMethod;

  private title: string = '';
  private sourceMenu: boolean = false;

  @Prop(Boolean)
  private raised?: boolean;

  private created() {
    const { title, locale } = this.$route.meta;

    this.title = title || locale;
  }

  private handleSourceSelect(target: any) {
    const id = target.item.getAttribute('data-id');
    this.changeSource(id);
  }

  private handlePreferenceReset() {
    this.resetPreference();
  }

  @Watch('raised')
  private onScrollReachStart(val: boolean, old: boolean) {
    const [max, min, cls] = [
      'mdc-toolbar--flexible-space-maximized',
      'mdc-toolbar--flexible-space-minimized',
      (this.$refs.wrap as any).$el.firstChild.classList,
    ];
    if (val) {
      cls.remove(max);
      cls.add(min);
    } else {
      cls.remove(min);
      cls.add(max);
    }
  }

  @Watch('$route.meta')
  private onViewChanged({ title, locale }: any) {
    this.title = title || locale;
  }
}
</script>

<style lang="scss">
.popup-toolbar {
  .mdc-toolbar {
    width: 100%;
    flex-shrink: 0;
    position: relative;
  }

  button.-spec {
    background-color: #5800d5;
    border-radius: 24px;
    max-width: 96px;
    color: white;
    margin: auto;
    margin-right: 8px;

    &.-source + .mdc-menu-anchor > .mdc-menu {
      margin: 8px;
    }
  }
}
</style>

