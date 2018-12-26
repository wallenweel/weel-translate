<template>
  <mdc-button class="translation-action-pick"
    :accent=accent
    @click="toggle = !toggle"
  >
    <icon-favorite :type="toggle ? 'sharp' : 'two-tone'" />
  </mdc-button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import IconFavorite from '@/components/icons/Favorite.vue';

@Component({
  components: {
    IconFavorite,
  },
})
export default class PickActionButton extends Vue {
  private toggle = false;
  private accent = true;
}
</script>

<style lang="scss">
button.translation-action-pick {
  border-radius: 36px;
  width: 36px;
  min-width: 36px;
}
</style>
