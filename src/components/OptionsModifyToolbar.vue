<template lang="pug">
  v-toolbar(dense style="z-index: 4;")
    v-tooltip(bottom)
      v-btn(icon color="accent" slot="activator")
        v-icon add
      span Create New One
    v-spacer

    //- v-chip(small outline disabled close)
    //-   span Google
    v-chip(
      small
      v-for="(item, index) in items" :key="item.id"
      :close="!index"
      :disabled="!index"
      :outline="!!index"
      @input="handleChipClose"
      @click="handleChipClick"
      )
      span {{ item.name }}

    v-spacer
    v-tooltip(bottom)
      v-btn(icon slot="activator")
        v-icon(color="secondary") developer_board
      span Developer Mode
    v-tooltip(bottom)
      v-btn(color="primary" slot="activator") Save
      span Save Current
</template>

<script>
export default {
  name: 'OptionsModifyToolbar',
  data () {
    return {}
  },
  props: ['items'],
  methods: {
    handleChipClose (close) {
      console.log(!close)
    },
    handleChipClick (ev) {
      console.log(ev.index)
    }
  }
}
</script>
