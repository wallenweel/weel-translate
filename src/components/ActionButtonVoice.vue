<template>
  <mdc-button class="translation-action-voice"
    :disabled="toggle"
    @click="handleVoice"
  >
    <icon-volume-off v-if="isDisabled"/>
    <icon-volume-down v-if="!isDisabled && !toggle" />
    <icon-volume-up v-if="!isDisabled && toggle" :type="flag ? 'sharp' : 'two-tone'" />
  </mdc-button>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
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
  @Prop(Boolean) private flag?: boolean;
  @Prop(Object) private params?: null | { [k: string]: any };

  private toggle: boolean = false;
  private get isDisabled() { return this.disabled || false; }

  private handleVoice() {
    const { src, dest } = this.params || {} as any;
    this.toggle = true;
    this.$store.dispatch('translation/voice', [src, dest]);
  }

  @Watch('flag') private onFlag(val: boolean) {
    if (!val) {
      this.toggle = false;
    }
  }
}
</script>

<style lang="scss">
button.translation-action-voice {
  border-radius: 32px;
  width: 32px;
  min-width: 32px;
  padding: 0;
}
</style>
