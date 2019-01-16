<template>
  <mdc-layout-app>
    <options-toolbar />
    <options-drawer @change="drawer = !drawer" />

    <main :class="['options-content', drawer ? 'drawer-open' : '']">
      <router-view class="-child" />
    </main>
  </mdc-layout-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import OptionsToolbar from '@/components/OptionsToolbar.vue';
import OptionsDrawer from '@/components/OptionsDrawer.vue';
import debug from '@/functions/debug';

@Component({
  components: {
    OptionsDrawer,
    OptionsToolbar,
  },
})
export default class Options extends Vue {
  private drawer: boolean = false;

  private mounted() {
    this.$nextTick(() => {
      this.$root.$emit('toggle-drawer');
    });
  }
}
</script>

<style lang="scss">
@import '../assets/styles/global';

// @import '~vue-mdc-adapter/dist/vue-mdc-adapter.min.css';

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
  --app-toolbar-height: 56px;
  --app-drawer-width: 240px;

  @media (min-width: 599px) {
    --app-toolbar-height: 64px;
  }
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
  background-color: var(--mdc-theme-background);

  padding-top: var(--app-toolbar-height);

  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  z-index: 1;
  position: absolute;

  &.drawer-open {
    padding-left: var(--app-drawer-width);
  }

  .-child {
    height: 100%;
  }
}
</style>
