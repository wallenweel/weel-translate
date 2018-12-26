<template>
  <svg xmlns="http://www.w3.org/2000/svg" :type="defaultType"
    :width="width || size || 24" :height="height || size || 24"
    :viewBox="`0 0 ${width || size || 24} ${height || size || 24}`"
    :aria-labelledby="name || 'blank'" role="presentation"
  >
    <title :id="name || 'blank'" lang="en">{{ name || 'blank' }} icon</title>
    <g :fill="color || 'currentColor'">
      <slot></slot>
      <slot name="filled" />
      <slot name="outlined" />
      <slot name="rounded" />
      <slot name="two-tone" :fill="color || 'currentColor'" />
      <slot name="sharp" />
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class IconBase extends Vue {
  @Prop(String) private type?: 'filled' | 'outlined' | 'rounded' | 'two-tone' | 'sharp';
  @Prop(String) private name?: string;
  @Prop([Number, String]) private size?: number | string;
  @Prop([Number, String]) private height?: number | string;
  @Prop([Number, String]) private width?: number | string;
  @Prop(String) private color?: string;

  private defaultType: string = 'two-tone';
}
</script>

<style lang="scss" scoped>
svg {
  > g > g { display: none; }

  &[type="filled"] g[type="filled"] { display: block; }
  &[type="outlined"] g[type="outlined"] { display: block; }
  &[type="rounded"] g[type="rounded"] { display: block; }
  &[type="two-tone"] g[type="two-tone"] { display: block; }
  &[type="sharp"] g[type="sharp"] { display: block; }
}
</style>
