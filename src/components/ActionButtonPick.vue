<template>
  <mdc-button class="translation-action-pick"
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
}
</script>

<style lang="scss">
button.translation-action-pick {
  border-radius: 36px;
  width: 36px;
  min-width: 36px;
}
</style>
