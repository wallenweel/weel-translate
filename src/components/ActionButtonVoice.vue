<template>
  <mdc-button class="translation-action-voice"
    :disabled="isDisabled"
    @click="handleVoice"
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
import debug from '@/functions/debug';

@Component({
  components: {
    IconVolumeOff,
    IconVolumeDown,
    IconVolumeUp,
  },
})
export default class VoiceActionButton extends Vue {
  @Prop(Boolean) private disabled?: boolean;
  @Prop(Object) private params?: null | { [k: string]: any };

  private toggle = false;
  private get isDisabled() { return this.disabled || false; }

  private handleVoice() {
    const { src, dest } = this.params || {} as any;
    this.$store.dispatch('translation/voice', [src, dest]);
  }
}
</script>

<style lang="scss">
button.translation-action-voice {
  border-radius: 36px;
  width: 36px;
  min-width: 36px;
}
</style>
