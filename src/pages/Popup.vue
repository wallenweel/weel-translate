<template>
  <mdc-layout-app>
    <popup-toolbar></popup-toolbar>
    <popup-drawer></popup-drawer>

    <main class="content" >
      <router-view></router-view>
    </main>
  </mdc-layout-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PopupToolbar from '@/components/PopupToolbar.vue';
import PopupDrawer from '@/components/PopupDrawer.vue';

@Component({
  components: {
    PopupDrawer,
    PopupToolbar,
  },
})
export default class Popup extends Vue {}
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

body {
  @include mdc-typography(body2);

  height: inherit;
  width: inherit;
  min-height: 100%;
  margin: 0;
}
</style>
