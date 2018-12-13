<template>
  <mdc-layout-app>
    <popup-toolbar :raised="!isReachStart"></popup-toolbar>
    <popup-drawer></popup-drawer>

    <main>
      <scrollbar class="main-scrollbar" v-once ref="scrollbar"
        @ps-y-reach-start="handleScrollReachStart"
        @ps-scroll-down="handleScrollDown"
      >
        <router-view></router-view>
      </scrollbar>
    </main>
  </mdc-layout-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PopupToolbar from '@/components/PopupToolbar.vue';
import PopupDrawer from '@/components/PopupDrawer.vue';
import debug from '@/functions/debug';

@Component({
  components: {
    PopupDrawer,
    PopupToolbar,
  },
})
export default class Popup extends Vue {
  private isReachStart: boolean = true;

  private mounted() {
    if (this.$refs.scrollbar.$el.scrollTop > 0) {
      this.isReachStart = false;
      debug.log(this.$refs.scrollbar.$el.scrollTop);
    }
  }

  private handleScrollReachStart() {
    if (this.isReachStart) { return; }
    this.isReachStart = true;
  }

  private handleScrollDown(ev: any) {
    if (!this.isReachStart) { return; }
    this.isReachStart = false;
  }
}
</script>

<style lang="scss">
// @import '~vue-mdc-adapter/dist/vue-mdc-adapter.min.css';

// First, set the value for variable
$mdc-theme-primary: #6200ee;
$mdc-theme-secondary: #6200ee;
$mdc-typography-font-family: "Roboto Mono", "Microsoft Yahei", "sans-serif", monospace;

@import 'vue-mdc-adapter/dist/theme/styles';
@import 'vue-mdc-adapter/dist/typography/styles';
@import 'vue-mdc-adapter/dist/ripple/styles';
@import 'vue-mdc-adapter/dist/icon/styles';

@import '~vue-mdc-adapter/dist/layout-app/layout-app.min.css';
@import '~vue-mdc-adapter/dist/list/list.min.css';
@import '~vue-mdc-adapter/dist/icon-toggle/icon-toggle.min.css';
@import '~vue-mdc-adapter/dist/button/button.min.css';
@import '~vue-mdc-adapter/dist/chips/chips.min.css';

html {
  height: 420px;
  width: 280px;
}

body {
  @include mdc-typography(body2);

  height: inherit;
  width: inherit;
  min-height: 100%;
  margin: 0;
}

.main-scrollbar {
  height: calc(100vh - 56px);
  width: 100%;
}

.ps {
  $y-w: 4px;
  .ps__scrollbar-y-rail {
    background-color: var(--mdc-theme-text-secondary-on-dark, transparent) !important;
    width: $y-w !important;
    right: 2px !important;
    .ps__scrollbar-y {
      background-color: var(--mdc-theme-text-hint-on-light, transparent) !important;
      width: $y-w !important;
      right: 0 !important;
    }
  }
}
</style>
