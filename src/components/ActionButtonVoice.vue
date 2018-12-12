<template>
  <mdc-icon-toggle class="translation-action-voice" :accent=accent
    v-model="toggle"
    toggle-on="volume_up"
    toggle-off="volume_down">
  </mdc-icon-toggle>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class VoiceActionButton extends Vue {
  private toggle = false;
  private accent = false;
}
</script>
