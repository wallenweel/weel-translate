<template>
  <div v-if="item.test ? testItem(item.test) : true">
    <mdc-headline v-if="!!item.headline">{{ item.headline }}</mdc-headline>
    <mdc-subheading v-if="!!item.subheading">{{ item.subheading }}</mdc-subheading>

    <template v-for="(m, n) in item.values">
      <mdc-radio :key="`${item.name}_${m[0]}_${n}`"
        v-if="item.type === 'radio'"
        :name="item.name" :value="m[1]" :label="m[0]"
        :checked="m[1] === values[item.value]"
        :picked="values[item.value]" @change="(value) => handleChange(item.value, value)"
      />
    </template>
    
    <mdc-checkbox
      v-if="item.type === 'checkbox'"
      :checked="values[item.value]" @change="(value) => handleChange(item.value, value)"
      :label="item.label"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import debug from '@/functions/debug';

@Component
export default class PreferenceOption extends Vue {
  @Prop(Object) private item!: any;
  @Prop(Object) private values!: { [k: string]: any };

  @Emit('change')
  private handleChange(key: string, value: any) {
    return { [key]: value };
  }

  private testItem([key, value]: [string, any]): boolean {
    return this.values[key] === value;
  }
}
</script>
