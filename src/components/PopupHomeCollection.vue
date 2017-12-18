<template lang="pug">
  v-container
    v-list
      v-list-tile(avatar v-for="item in items" v-bind:key="item.title" @click="")
        v-list-tile-content
          v-list-tile-title(v-text="item.title")
          v-list-tile-sub-title {{ item.subtitle
        v-list-tile-action
          v-btn(icon @click="cancleFavorite")
            v-icon(color="yellow darken-2") star
    v-snackbar(
      absolute
      :timeout="6000"
      top
      v-model="snackbar"
      ) You have removed it.
      v-btn(flat small color="pink" @click.native="snackbar = false") Cancel
</template>

<script>
export default {
  name: 'PopupHomeCollection',
  data () {
    return {
      items: [
        { title: 'Jason Oner' },
        { title: 'Travis Howard' },
        { title: 'Ali Connors' },
        { title: 'Cindy Baker' },
        { title: 'Cindy Baker' },
        { title: 'Cindy Baker' },
        { title: 'Cindy Baker' },
        { title: 'Cindy Baker' }
      ],
      snackbar: false
    }
  },
  methods: {
    cancleFavorite (ev) {
      this.snackbar = true
      // this.star = 'star_border'
      ev.target.querySelector('i.icon').innerText = 'star_border'
    }
  }
}
</script>
