<template lang="pug">
  v-container
    v-subheader
      |Appropriately use this list.
    v-list(v-if="items.length")
      v-list-tile(v-for="(item, index) in items" :key="index")
        v-list-tile-content
          v-list-tile-title {{ item.meta.q }}
          v-list-tile-sub-title {{ item.result.translation }}
        v-list-tile-action
          v-btn(icon @click="unStar(index)")
            v-icon(color="yellow darken-2" :ref="`star_${index}`") star

    v-dialog(lazy v-model="dialog")
      v-card
        v-card-title
          span Remove It From this list?
        v-card-actions
          v-spacer
          v-btn(color="secondary" flat @click.stop="dialog = false") No
          v-btn(color="secondary" flat @click.stop="remove") Sure
</template>

<script>
export default {
  name: 'PopupHomeCollection',
  data () {
    return {
      dialog: false,
      currentIndex: null
    }
  },
  computed: {
    items () { return this.collection || [] },
    collection () { return this.$store.state.translation_collection }
  },
  methods: {
    unStar (index) {
      this.dialog = true
      this.currentIndex = index
      this.$refs[`star_${index}`][0].textContent = 'star_border'
    },
    remove () {
      this.$store.commit('removeCollection', this.currentIndex)
      this.dialog = false
    }
  },
  watch: {
    dialog (v) {
      if (!v) {
        this.$refs[`star_${this.currentIndex}`][0].textContent = 'star'
        this.dialog = false
      }
    }
  }
}
</script>
