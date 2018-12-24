<template>
  <mdc-toolbar class="popup-toolbar"
    waterfall
    slot="toolbar"
    ref="wrap">
    <mdc-toolbar-row>
      <mdc-toolbar-section align-start>
        <mdc-toolbar-menu-icon event="toggle-drawer"></mdc-toolbar-menu-icon>
        <mdc-toolbar-title>{{ $t(title) }}</mdc-toolbar-title>

        <mdc-chip-set class="-source" v-if="title.toLowerCase() === 'translate'">
          <mdc-chip>{{ sourceName }}</mdc-chip>
        </mdc-chip-set>
        <mdc-chip-set class="-source" v-if="title.toLowerCase() === 'preference'">
          <mdc-chip>Reset</mdc-chip>
        </mdc-chip-set>
      </mdc-toolbar-section>
    </mdc-toolbar-row>
  </mdc-toolbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import debug from '@/functions/debug';

const translationM = namespace('translation');

@Component
export default class PopupToolbar extends Vue {
  @translationM.State('source') private source!: SourcePresetItem;

  private title = '';

  private get sourceName() { return this.source.name; }

  @Prop(Boolean)
  private raised?: boolean;

  private created() {
    const { title, locale } = this.$route.meta;

    this.title = title || locale;
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

  .-source {
    margin-left: auto;
    .mdc-chip {
      background-color: #5800d5;
      color: white;
    }
  }
}
</style>

