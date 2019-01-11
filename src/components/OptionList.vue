<template>
  <mdc-layout-grid class="option-list">
    <mdc-layout-cell class="-row" v-for="(item, i) in items" :key="`item_${i}`">
      <option-item class="-option" :key="`opt_${i}`"
        :data-name="item.name" :values="options" :item="item"
        @change="handleChange"
      />

      <template v-if="!!item.appends">
        <option-item class="-option"
          v-for="(append, n) in item.appends" :key="`opt_append_${n}`"
          :data-name="append.name" :values="options" :item="append"
          @change="handleChange"
        />
      </template>
    </mdc-layout-cell>
  </mdc-layout-grid>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import OptionItem from '@/components/OptionItem.vue';

@Component({
  components: {
    OptionItem,
  },
})
export default class OptionList extends Vue {
  @Prop(Array) private items!: any;
  @Prop(Object) private options!: any;

  @Emit('change')
  private handleChange(change: any) {
    return change;
  }
}
</script>

<style lang="scss">
.option-list {
  label {
    font-size: .75rem;
  }

  .-row {
    padding: 0 16px 16px;
  }

  .-option {
    flex-wrap: wrap;
    display: flex;
  }
}
</style>
