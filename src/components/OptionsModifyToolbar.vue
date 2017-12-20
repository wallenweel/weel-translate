<template lang="pug">
  v-toolbar(dense)
    v-tooltip(bottom)
      v-btn(icon color="accent" slot="activator")
        v-icon add
      span Create New One
    v-spacer

    v-chip(small outline disabled close)
      span Google
    v-chip(small)
      span Google CN
    v-chip(small)
      span Youdao

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
  name: 'OptionsModifyToolbar'
}
</script>
