<template>
  <mdc-layout-app>
    <popup-toolbar :raised="!isReachStart"></popup-toolbar>
    <popup-drawer></popup-drawer>
    <popup-content v-model="isReachStart"></popup-content>
  </mdc-layout-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PopupToolbar from '@/components/PopupToolbar.vue';
import PopupDrawer from '@/components/PopupDrawer.vue';
import PopupContent from '@/components/PopupContent.vue';
import debug from '@/functions/debug';

@Component({
  components: {
    PopupDrawer,
    PopupToolbar,
    PopupContent,
  },
})
export default class Popup extends Vue {
  private isReachStart: boolean = true;
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
@import '~vue-mdc-adapter/dist/fab/fab.min.css';
@import '~vue-mdc-adapter/dist/card/card.min.css';
@import '~vue-mdc-adapter/dist/dialog/dialog.min.css';
@import '~vue-mdc-adapter/dist/linear-progress/linear-progress.min.css';
html {
  --app-height: 420px;
  --app-width: 280px;

  height: var(--app-height);
  width: var(--app-width);
  margin: auto;
  overflow: hidden;
}

body {
  @include mdc-typography(body2);

  height: inherit;
  width: inherit;
  min-height: 100%;
  margin: 0;
}

body {
  background-color: #f5f5f5;
}

.popup-content {
  background-color: white;
}
</style>
