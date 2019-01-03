<template>
  <mdc-button class="translation-action-pick"
    @click="handlePick"
  >
    <icon-favorite :type="hasPicked ? 'sharp' : 'two-tone'" />
  </mdc-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import IconFavorite from '@/components/icons/Favorite.vue';

@Component({
  components: {
    IconFavorite,
  },
})
export default class PickActionButton extends Vue {
  @Prop(Object) private params?: null | { [k: string]: any };

  private get text(): string {
    return this.$store.state.translation.text;
  }
  private get pickedItems(): translationListItem[] {
    return this.$store.state.translation.picked;
  }
  private get picked(): [translationListItem, number] {
    let [p, n] = [, NaN];
    this.pickedItems.filter((item, index) => {
      if (item.text === this.text) {
        [p, n] = [item as any, index];
      }
    });
    return [p!, n];
  }
  private get hasPicked(): boolean { return !!this.picked[0]; }

  private handlePick() {
    if (!this.hasPicked) {
      this.$store.dispatch('translation/pick', this.params);
    } else {
      this.$store.dispatch('translation/unpick', this.picked[1]);
    }
  }
}
</script>

<style lang="scss">
button.translation-action-pick {
  border-radius: 36px;
  width: 36px;
  min-width: 36px;
}
</style>
