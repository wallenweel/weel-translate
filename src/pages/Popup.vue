<template>
  <mdc-layout-app>

    <mdc-toolbar slot="toolbar" waterfall>
      <mdc-toolbar-row>
        <mdc-toolbar-section align-start>
          <mdc-toolbar-menu-icon event="toggle-drawer"></mdc-toolbar-menu-icon>
          <mdc-toolbar-title>Translate</mdc-toolbar-title>
        </mdc-toolbar-section>
      </mdc-toolbar-row>
    </mdc-toolbar>

    <mdc-drawer class="popup-drawer" slot="drawer" toggle-on="toggle-drawer">
      <mdc-card-media></mdc-card-media>
      </mdc-card>
      <mdc-drawer-list>
        <mdc-drawer-item start-icon="translate">Translate</mdc-drawer-item>
        <mdc-drawer-item start-icon="settings">Setting</mdc-drawer-item>
        <mdc-drawer-item start-icon="extension">Advance</mdc-drawer-item>
      </mdc-drawer-list>
    </mdc-drawer>

    <main class="content" >
      <router-view></router-view>
    </main>

  </mdc-layout-app>
</template>

<style lang="scss">
$mdc-theme-secondary: #6200ee;
// First, set the value for variable
$mdc-typography-font-family: "Roboto Mono", "Microsoft Yahei", "sans-serif", monospace;

@import 'vue-mdc-adapter/dist/theme/styles';
@import 'vue-mdc-adapter/dist/layout-app/styles';
@import 'vue-mdc-adapter/dist/list/styles';
@import 'vue-mdc-adapter/dist/toolbar/styles';
@import 'vue-mdc-adapter/dist/drawer/styles';
@import 'vue-mdc-adapter/dist/button/styles';
@import 'vue-mdc-adapter/dist/fab/styles';
@import 'vue-mdc-adapter/dist/card/styles';

// Then, import required files
@import "@material/typography/mixins";

// html {
//   height: 480px;
//   width: 320px;
//   margin: 0 auto;
// }

body {
  @include mdc-typography(body2);

  height: inherit;
  width: inherit;
  min-height: 100%;
  margin: 0;
}

.popup-drawer {
  .mdc-drawer__drawer {
    width: calc(100% - 112px);
  }
}
</style>
