<template>
  <mdc-toolbar slot="toolbar" waterfall>
    <mdc-toolbar-row>
      <mdc-toolbar-section align-start>
        <mdc-toolbar-menu-icon event="toggle-drawer"></mdc-toolbar-menu-icon>
        <mdc-toolbar-title>Translate</mdc-toolbar-title>
      </mdc-toolbar-section>
    </mdc-toolbar-row>
  </mdc-toolbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class PopupToolbar extends Vue {}
</script>

<style lang="scss">
@import 'vue-mdc-adapter/dist/toolbar/styles';
</style>

