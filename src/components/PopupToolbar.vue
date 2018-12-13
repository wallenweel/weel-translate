<template>
  <mdc-toolbar class="popup-toolbar" slot="toolbar" waterfall>
    <mdc-toolbar-row>
      <mdc-toolbar-section align-start>
        <mdc-toolbar-menu-icon event="toggle-drawer"></mdc-toolbar-menu-icon>
        <mdc-toolbar-title>{{ title }}</mdc-toolbar-title>

        <mdc-chip-set class="-source">
          <mdc-chip>{{ sourceName }}</mdc-chip>
        </mdc-chip-set>
      </mdc-toolbar-section>
    </mdc-toolbar-row>
  </mdc-toolbar>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import debug from '@/functions/debug';

@Component
export default class PopupToolbar extends Vue {
  private title = '';
  private sourceName = 'Google';

  private created() {
    this.title = this.$route.meta.title;
  }

  private beforeRouteEnter(to: any, from: any, next: any) {
    debug.log(to, from);
    next();
  }

  @Watch('$route.meta')
  private onViewChanged(val: any, old: any) {
    this.title = val.title;
  }
}
</script>

<style lang="scss">
@import '~vue-mdc-adapter/dist/toolbar/toolbar.min.css';

.popup-toolbar {
  .-source {
    margin-left: auto;
    .mdc-chip {
      background-color: #5800d5;
      color: white;
    }
  }
}
</style>

