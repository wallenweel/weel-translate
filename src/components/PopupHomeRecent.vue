<template lang="pug">
  v-container
    v-subheader
      |Only save 20 tiles
      v-spacer
      v-btn(flat icon style="margin-right: -8px;")
        v-icon(color="grey") delete_sweep
    v-list
      v-list-tile(avatar v-for="item in items" v-bind:key="item.title" @click="")
        v-list-tile-content
          v-list-tile-title(v-text="item.title")
          v-list-tile-sub-title {{ item.subtitle
        //- v-list-tile-action
          v-btn(icon)
            v-icon(small color="grey") delete
</template>

<script>
export default {
  name: 'PopupHomeRecent',
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
      ]
    }
  }
}
</script>
