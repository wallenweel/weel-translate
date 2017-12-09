<template lang="pug">
  v-layout
    v-bottom-nav(
      absolute
      :value="true"
      :active.sync="navFirst"
      color="transparent"
      style="left: 0;"
    )
      v-btn(flat color="primary" value="translate")
        span Translation
        v-icon translate
      v-btn(flat color="primary" value="recent")
        span Recent
        v-icon history
      v-btn(flat color="primary" value="dictionary")
        span Collection
        v-icon style
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HelloWorld',
  data () {
    return {
      navFirst: 'translate'
    }
  },
  computed: {
    ...mapState([
      'count'
    ])
  },
  methods: {
    onClick () {
      console.log(new Date())
      this.$store.commit('increment')
    }
  }
}
</script>

<style>
</style>
