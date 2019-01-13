<template>
  <div class="color-picker" :style="wrapStyle">
    <div class="-bar" :style="hueStyle">
      <input type="range" min="0" max="360" v-model="h"
        @input="({ target }) => handleChange({ h: target.value })">
    </div>
    <div class="-bar" :style="saturationStyle">
      <input type="range" min="0" max="100" v-model="s"
        @input="({ target }) => handleChange({ s: target.value })">
    </div>
    <div class="-bar" :style="lightnessStyle">
      <input type="range" min="0" max="100" v-model="v"
        @input="({ target }) => handleChange({ v: target.value })">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Watch, Vue } from 'vue-property-decorator';
import { hexToHsv, hslToHex, stringify } from 'colorsys';

@Component
export default class ColorPicker extends Vue {
  @Prop(String) private value?: string;

  private mode: keyof Colors = 'hsl';
  private barHeight: number = 16;

  private h: number = 225;
  private s: number = 100;
  private v: number = 100;
  private colors: Colors = {
    hsl: stringify(this.hsl),
    hex: hslToHex(this.hsl),
  };

  private created() {
    if (/^\#[\w\d]+/.test(this.value || '')) { // is hex
      const { h, s, v } = hexToHsv(this.value);
      this.h = h; this.s = s; this.v = v;
    }
    this.setColors();
  }

  private get color() {
    return this.colors[this.mode];
  }
  private get hsl(): hsl {
    return hsb2hsl(parse(this.h) / 360, parse(this.s) / 100, parse(this.v) / 100);
  }

  private get wrapStyle() {
    return [
      `--color-picker-height: ${this.barHeight}px`,
    ].join(';');
  }
  private get hueStyle() {
    const c = [];
    for (let i = 0; i < 7; i++) {
      const hue = i * 60;
      c.push(stringify(hsb2hsl(parse(hue / 360), parse(this.s) / 100, parse(this.v / 100))));
    }
    return {
      backgroundImage: `linear-gradient(to right, ${c.join(', ')})`,
      paddingLeft: `calc(${this.h / 360 * 100}% - 16px)`,
      color: this.color,
    };
  }
  private get saturationStyle() {
    const [start, end] = [
      stringify(hsb2hsl(parse(this.h / 360), 0, parse(this.v / 100))),
      stringify(hsb2hsl(parse(this.h / 360), 1, parse(this.v / 100))),
    ];
    return {
      backgroundImage: `linear-gradient(to right, ${start}, ${end})`,
      paddingLeft: `calc(${this.s}% - 16px)`,
      color: this.color,
    };
  }
  private get lightnessStyle() {
    const [start, end] = [
      stringify(hsb2hsl(parse(this.h / 360), 0, 0)),
      stringify(hsb2hsl(parse(this.h / 360), parse(this.s / 100), 1)),
    ];
    return {
      backgroundImage: `linear-gradient(to right, ${start}, ${end})`,
      paddingLeft: `calc(${this.v}% - 16px)`,
      color: this.color,
    };
  }

  private setColors() {
    this.colors = {
      hsl: stringify(this.hsl),
      hex: hslToHex(this.hsl),
    };
  }

  private handleChange(data: any) {
    this.setColors();
    this.emitChange(this.colors);
  }

  @Emit('change')
  private emitChange(colors: Colors) {
    return colors;
  }
}

function parse(n: number): number {
  return parseFloat(`${n}`);
}

interface Colors {
  hsl?: string;
  hex?: string;
}

type hsl = { [t in 'h' | 's' | 'l']: number };
function hsb2hsl(h: number, s: number, b: number): hsl {
  const hsl: hsl = { h, s: s * b, l: (2 - s) * b };

  if (hsl.l <= 1 && hsl.l > 0) {
    hsl.s /= hsl.l;
  } else {
    hsl.s /= 2 - hsl.l;
  }

  if (hsl.s > 1) { hsl.s = 1; }
  if (!(hsl.s > 0)) { hsl.s = 0; }

  hsl.h *= 360; hsl.s *= 100; hsl.l *= 100;
  hsl.l /= 2;

  return hsl;
}
</script>

<style lang="scss">
.color-picker {
  width: 100%;
  max-width: 220px;

  .-bar {
    box-sizing: border-box;
    border-radius: var(--color-picker-height, 8px);
    height: var(--color-picker-height, 16px);
    width: 100%;
    margin: 4px;
    position: relative;

    &::before {
      content: "";
      box-sizing: border-box;
      border-radius: var(--color-picker-height, 8px);
      background-color: currentColor;
      border: 1px solid rgba(220, 220, 220, .74);
      height: var(--color-picker-height, 16px);
      width: var(--color-picker-height, 16px);
      display: block;
    }

    > input[type="range"] {
      opacity: 0;
      width: 100%;
      margin: auto;
      padding: 0;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      position: absolute;
    }
  }
}
</style>
