<template>
  <icon-favorite name="22" />
  <!-- <mdc-icon-toggle class="translation-action-pick" :accent=accent
    v-model="toggle"
    toggle-on="favorite"
    toggle-off="favorite_border"></mdc-icon-toggle> -->
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
