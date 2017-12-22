<template lang="pug">
  v-toolbar(dense style="z-index: 4;")
    v-tooltip(bottom)
      v-btn(icon color="accent" slot="activator" @click="handleCreate")
        v-icon add
      span Create New One
    v-spacer

    //- v-chip(small outline disabled close)
    //-   span Google
    v-chip(
      small
      v-for="(item, index) in items" :key="item.id"
      :close="currentId === item.id"
      :disabled="currentId === item.id"
      :outline="currentId !== item.id"
      @input="handleChipClose(item.id)"
      @click="handleChipClick(item.id)"
      )
      span {{ item.name }}

    v-spacer
    //- v-tooltip(bottom)
    //-   v-btn(icon slot="activator")
    //-     v-icon(color="secondary") developer_board
    //-   span Developer Mode
    v-tooltip(bottom)
      v-btn(color="primary" slot="activator" :disabled="saveDisabled" @click="handleSave") Save
      span Save Current
</template>

<script>
export default {
  name: 'OptionsModifyToolbar',
  data () {
    return {}
  },
  props: ['items', 'currentId', 'createCb', 'closeCb', 'activeCb', 'saveCb', 'saveDisabled'],
  methods: {
    handleCreate (ev) {
      this.createCb(ev)
    },
    handleChipClose (close) {
      this.closeCb(close)
    },
    handleChipClick (ev) {
      this.activeCb(ev)
    },
    handleSave (ev) {
      this.saveCb(ev)
    }
  }
}
</script>
