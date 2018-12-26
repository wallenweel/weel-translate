<template>
  <mdc-button class="translation-action-voice"
    :disabled="isDisabled"
    @click="toggle = !toggle"
  >
    <icon-volume-off v-if="isDisabled"/>
    <icon-volume-down v-if="!isDisabled && !toggle" />
    <icon-volume-up v-if="!isDisabled && toggle" :type="toggle ? 'sharp' : 'two-tone'" />
  </mdc-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import IconVolumeOff from '@/components/icons/VolumeOff.vue';
import IconVolumeDown from '@/components/icons/VolumeDown.vue';
import IconVolumeUp from '@/components/icons/VolumeUp.vue';

@Component({
  components: {
    IconVolumeOff,
    IconVolumeDown,
    IconVolumeUp,
  },
})
export default class VoiceActionButton extends Vue {
  @Prop(Boolean) private disabled?: boolean;

  private toggle = false;
  private get isDisabled() { return this.disabled || false; }
}
</script>

<style lang="scss">
button.translation-action-voice {
  border-radius: 36px;
  width: 36px;
  min-width: 36px;
}
</style>
