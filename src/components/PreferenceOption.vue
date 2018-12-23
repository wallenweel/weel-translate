<template>
  <div>
    <mdc-headline v-if="!!item.headline">{{ item.headline }}</mdc-headline>
    <mdc-subheading v-if="!!item.subheading">{{ item.subheading }}</mdc-subheading>

    <mdc-radio
      :picked="values[item.value]" @change="(value) => handleChange(item.value, value)"
      v-if="item.type === 'radio'" v-for="(m, n) in item.values" :key="`${m[0]}_${n}`"
      :name="item.name" :value="m[1]" :label="m[0]"
    />
    
    <mdc-checkbox
      :checked="values[item.value]" @change="(value) => handleChange(item.value, value)"
      v-if="item.type === 'checkbox'"
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
}
</script>
