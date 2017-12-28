<template lang="pug">
  i(:style="styleObject" ref="slot")
    slot
</template>

<script>
import colors from 'vuetify/es5/util/colors'
import { vuetify } from '@/globals'

export default {
  name: 'svgIcon',
  data () {
    return {
      base: 12,
      svgname: this.$slots.default[0].text,
      observer: null
    }
  },
  props: {
    size: {
      type: [Number, String],
      default: 24
    },
    color: String,
    observe: Boolean
  },
  mounted () {
    if (this.observe) this.watchSlotChange()
  },
  beforeDestroy () {
    if (this.observe) this.observer.disconnect()
  },
  computed: {
    svgurl () {
      return require(`@/assets/svg/${this.svgname}.svg`)
    },
    styleObject () {
      return ({
        'font-size': `${this.base}px`,
        'text-indent': '-99999px',
        'background-color': this.getColor || 'currentColor',
        'height': this.calc(),
        'width': this.calc(),
        '-webkit-mask': `url(${this.svgurl}) no-repeat 50% 50%/${this.calc()} ${this.calc()}`,
        'mask': `url(${this.svgurl}) no-repeat 50% 50%/${this.calc()} ${this.calc()}`
      })
    },
    getColor () {
      if (!this.color) return ''

      const color = this.color.replace(/-(\w)/g, (a, c) => c.toUpperCase())

      return Object.assign(vuetify.theme, colors)[color]['base']
    }
  },
  methods: {
    calc () { return `${parseInt(this.size) / this.base}em` },
    watchSlotChange () {
      this.observer = new MutationObserver(function () {
        this.svgname = this.$slots.default[0].text
      }.bind(this))

      this.observer.observe(this.$el.firstChild, { characterData: true })
    }
  }
}
</script>

