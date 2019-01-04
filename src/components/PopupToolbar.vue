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
          v-if="name === 'translate'"
          @click="sourceMenu = true"
        >{{ source.name }}</mdc-button>
        <mdc-menu-anchor v-if="name === 'translate'">
          <mdc-menu v-model="sourceMenu" @select="handleSourceSelect">
            <mdc-menu-item disabled>{{ source.name }}</mdc-menu-item>
            <mdc-menu-divider />
            <template v-for="(item, i) in enabledSources">
              <mdc-menu-item :key="i"
                v-if="item.id !== source.id"
                :data-id="item.id"
              >{{ item.name }}</mdc-menu-item>
            </template>
          </mdc-menu>
        </mdc-menu-anchor>

        <!-- Reset -->
        <mdc-button class="-spec -reset" @click="handleReset(name)"
          dense v-if="name === 'preference' || name === 'presets'"
        >{{ $t('reset') }}</mdc-button>
        <!-- Clear -->
        <mdc-button class="-spec -reset" @click="handleClear(name)"
          dense v-if="name === 'picked' || name === 'recent'"
        >{{ $t('clear') }}</mdc-button>
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
  @__.Action('clear') private clearList!: ActionMethod;

  private title: string = '';
  private name?: string;
  private sourceMenu: boolean = false;

  @Prop(Boolean)
  private raised?: boolean;

  private created() {
    const { name, meta: { title, locale } } = this.$route;

    this.name = name;
    this.title = locale || title;
  }

  private handleSourceSelect(target: any) {
    const id = target.item.getAttribute('data-id');
    this.changeSource(id);
  }

  private handleReset(name: 'preference' | 'presets') {
    if (name === 'preference') {
      return this.resetPreference();
    }
  }

  private handleClear(type: 'picked' | 'recent') {
    this.clearList(type);
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

  @Watch('$route')
  private onViewChanged({ name, meta: { title, locale } }: any) {
    this.name = name;
    this.title = locale || title;
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

