<template>
  <mdc-layout-app>
    <options-toolbar :raised="!isReachStart"></options-toolbar>
    <options-drawer />
  </mdc-layout-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import OptionsToolbar from '@/components/OptionsToolbar.vue';
import OptionsDrawer from '@/components/OptionsDrawer.vue';

@Component({
  components: {
    OptionsDrawer,
    OptionsToolbar,
  },
})
export default class Options extends Vue {
  private isReachStart: boolean = true;
}
</script>

<style lang="scss">
// @import '~vue-mdc-adapter/dist/vue-mdc-adapter.min.css';

$mdc-theme-primary: #6200ee;
$mdc-theme-secondary: #6200ee;
$mdc-typography-font-family: "Roboto Mono", "Microsoft Yahei", "sans-serif", monospace;

@import 'vue-mdc-adapter/dist/theme/styles';
@import 'vue-mdc-adapter/dist/typography/styles';
@import 'vue-mdc-adapter/dist/ripple/styles';
@import 'vue-mdc-adapter/dist/icon/styles';

@import '~vue-mdc-adapter/dist/toolbar/toolbar.min.css';
@import '~vue-mdc-adapter/dist/layout-app/layout-app.min.css';
@import '~vue-mdc-adapter/dist/list/list.min.css';
@import '~vue-mdc-adapter/dist/button/button.min.css';
@import '~vue-mdc-adapter/dist/chips/chips.min.css';
@import '~vue-mdc-adapter/dist/fab/fab.min.css';
@import '~vue-mdc-adapter/dist/card/card.min.css';
@import '~vue-mdc-adapter/dist/dialog/dialog.min.css';
@import '~vue-mdc-adapter/dist/snackbar/snackbar.min.css';
@import '~vue-mdc-adapter/dist/textfield/textfield.min.css';
@import '~vue-mdc-adapter/dist/tabs/tabs.min.css';

:root {
  --app-height: 100vh;
  --app-width: 100vw;
  // --app-toolbar-height: 56px;

  // @media (min-width: 599px) {
  //   --app-toolbar-height: 64px;
  // }
}

html {
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

.options-content {
  background-color: white;
}
</style>
