<template lang="pug">
  v-layout
    router-view
    v-bottom-nav(
      absolute
      :value="true"
      :active.sync="navActive"
      color="transparent"
      style="left: 0;"
    )
      v-btn(flat color="primary" value="translation")
        span Translation
        v-icon translate
      v-btn(flat color="primary" value="recent")
        span Recent
        v-icon history
      v-btn(flat color="primary" value="collection")
        span Collection
        v-icon style
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PopupHome',
  data () {
    return {
      navActive: 'translation'
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
  },
  watch: {
    navActive (v) {
      this.$router.push(v)
    }
  }
}
</script>

<style>
</style>
