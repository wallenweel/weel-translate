<template lang="pug">
  v-container
    v-subheader
      |Only save 20 tiles
      v-spacer
      v-btn(flat icon style="margin-right: -8px;" @click="clear")
        v-icon(color="grey") delete_sweep
    v-list(v-if="items.length")
      v-list-tile(avatar v-for="(item, index) in items" v-bind:key="index" @click="")
        v-list-tile-content
          v-list-tile-title {{ item.meta.q }}
          v-list-tile-sub-title Service: {{ item.source.name }}
        v-list-tile-action
          v-btn(icon @click="remove(index)")
            v-icon(small color="grey") delete
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'PopupHomeRecent',
  data () {
    return {}
  },
  created () {
    // console.log(this.history)
  },
  computed: {
    items () {
      return this.history || []
    },
    ...mapState({
      history (state) { return state.translation_history }
    })
  },
  methods: {
    ...mapMutations({
      remove: 'removeHistory',
      clear: 'clearHistory'
    })
  }
}
</script>
