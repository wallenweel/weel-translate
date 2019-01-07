<template>
  <mdc-button class="translation-action-pick"
    @click="handlePick"
  >
    <icon-favorite :type="hasPicked ? 'sharp' : 'two-tone'" />
  </mdc-button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import md5 from '@/functions/md5';
import IconFavorite from '@/components/icons/Favorite.vue';

@Component({
  components: {
    IconFavorite,
  },
})
export default class PickActionButton extends Vue {
  @Prop(Object) private params?: null | { [k: string]: any };

  private id?: string;

  private get text(): string {
    return this.$store.state.translation.text;
  }
  private get fromto(): SourcePresetItem['fromto'] {
    return this.$store.state.translation.source.fromto;
  }
  private get pickedItems(): translationListItem[] {
    return this.$store.state.translation.picked;
  }
  private get picked(): [string, number] {
    let [id, index] = ['', NaN];
    this.pickedItems.filter((item, i) => {
      if (!!this.params && item.id === md5(`${this.text + this.params.title + this.fromto.join('')}`)) {
        [id, index] = [item.id, i];
      }
    });
    return [id, index];
  }
  private get hasPicked(): boolean { return !!this.picked[0]; }

  private handlePick() {
    if (!this.hasPicked) {
      this.$store.dispatch('translation/pick', this.params);
    } else {
      this.$store.dispatch('translation/unpick', this.picked[0]);
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
