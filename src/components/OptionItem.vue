<template>
  <div class="option-item" v-if="item.test ? testItem(item.test) : true">
    <mdc-headline v-if="!!item.headline">{{ item.headline }}</mdc-headline>
    <mdc-subheading v-if="!!item.subheading">{{ item.subheading }}</mdc-subheading>

    <template v-for="(m, n) in item.values">
      <mdc-radio :key="`${item.name}_${m[0]}_${n}`"
        v-if="item.type === 'radio'"
        :name="item.name" :value="m[1]" :label="m[0]"
        :checked="m[1] === item.value"
        :picked="item.value" @change="value => handleChange(item.name, value)"
      />
    </template>
    
    <mdc-checkbox
      v-if="item.type === 'checkbox'"
      :name="item.name" :label="item.label"
      :checked="item.value" @change="value => handleChange(item.name, value)"
    />

    <mdc-slider
      v-if="item.type === 'slider'"
      :min="item.meta.min" :max="item.meta.max" :step="item.meta.step" display-markers
      :name="item.name"
      :value="item.value" @change="value => handleChange(item.name, value)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import debug from '@/functions/debug';

@Component
export default class OptionItem extends Vue {
  @Prop(Object) private item!: any;
  @Prop(Object) private values!: { [k: string]: any };

  @Emit('change')
  private handleChange(key: string, value: any) {
    return [key, value];
  }

  private testItem([key, value]: [string, any]): boolean {
    return this.values[key] === value;
  }
}
</script>

<style lang="scss">
.option-item {
  .mdc-headline,
  .mdc-subheading {
    width: 100%;
    margin: 8px 0;
    flex-shrink: 0;
  }
  .mdc-headline {
    border-radius: 0 16px 16px 0;
    background-color: var(--mdc-theme-primary, #6200ee);
    color: var(--mdc-theme-text-primary-on-dark, #ffffff);
    font-size: 1rem;
    position: relative;
    &::before {
      content: "";
      background-color: var(--mdc-theme-primary, #6200ee);
      height: 100%;
      width: 16px;
      margin: auto;
      left: -16px;
      top: 0;
      bottom: 0;
      position: absolute;
      display: block;
    }
  }
  .mdc-subheading {
    font-size: .75rem;
  }
}
</style>

