<template>
  <mdc-layout-app class="popup">
    <popup-toolbar :raised="!isReachStart"></popup-toolbar>
    <popup-drawer></popup-drawer>
    <popup-content v-model="isReachStart"></popup-content>

    <mdc-snackbar v-model="snack" @hide="resetNotify" ref="snack" />
  </mdc-layout-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Action, Getter } from 'vuex-class';
import { Component, Watch } from 'vue-property-decorator';
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
  private snack: any = { message: `` };

  @State private notify!: null | string;
  @Getter private theme!: null | string;

  @Action('notify') private resetNotify: any;

  private get cssVariables() {
    const { color } = this.theme as any;
    return [
      `--mdc-theme-primary: ${color.primary}`,
      `--mdc-theme-secondary: ${color.secondary}`,
    ].join(';');
  }

  @Watch('notify')
  private onNotify(val: null | string) {
    if (!val) { return; }

    (this.$refs.snack as any).show({ message: val || 'something wrong, no reason.' });
  }

  @Watch('cssVariables', { immediate: true })
  private onCssVariables(style: string) {
    document.body.style.cssText = style;
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
@import '~vue-mdc-adapter/dist/icon-toggle/icon-toggle.min.css';
@import '~vue-mdc-adapter/dist/button/button.min.css';
@import '~vue-mdc-adapter/dist/chips/chips.min.css';
@import '~vue-mdc-adapter/dist/fab/fab.min.css';
@import '~vue-mdc-adapter/dist/card/card.min.css';
@import '~vue-mdc-adapter/dist/dialog/dialog.min.css';
@import '~vue-mdc-adapter/dist/snackbar/snackbar.min.css';
@import '~vue-mdc-adapter/dist/linear-progress/linear-progress.min.css';
@import '~vue-mdc-adapter/dist/textfield/textfield.min.css';
@import '~vue-mdc-adapter/dist/radio/radio.min.css';
@import '~vue-mdc-adapter/dist/checkbox/checkbox.min.css';
@import '~vue-mdc-adapter/dist/select/select.min.css';
@import '~vue-mdc-adapter/dist/slider/slider.min.css';
@import '~vue-mdc-adapter/dist/menu/menu.min.css';
@import '~vue-mdc-adapter/dist/grid-list/grid-list.min.css';

:root {
  --app-height: 420px;
  --app-width: 280px;
  --app-toolbar-height: 56px;

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
  background-color: var(--mdc-theme-primary);
}

html, .popup {
  background-color: #f5f5f5;
}

.popup-content {
  background-color: white;
}
</style>
