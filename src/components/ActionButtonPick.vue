<template>
  <mdc-icon-toggle class="translation-action-pick" :accent=accent
    v-model="toggle"
    toggle-on="favorite"
    toggle-off="favorite_border"></mdc-icon-toggle>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class PickActionButton extends Vue {
  private toggle = false;
  private accent = true;
}
</script>
