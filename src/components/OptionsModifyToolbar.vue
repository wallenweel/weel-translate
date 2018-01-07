<template lang="pug">
  v-toolbar(dense style="z-index: 4;")
    v-tooltip(bottom v-if="create !== false")
      v-btn(icon color="accent" slot="activator" @click="() => $emit('create')")
        v-icon add
      span Create New One
    v-spacer

    v-chip(
      small
      v-for="(item, i) in items" :key="item.id"
      :close="currentId === item.id"
      :disabled="currentId === item.id"
      :outline="currentId !== item.id"
      @input="() => $emit('close', { id: item.id, index: i })"
      @click="() => $emit('active', { prev: currentId, id: item.id, index: i })"
      )
      span {{ item.name }}

    v-spacer
    //- v-tooltip(bottom)
    //-   v-btn(icon slot="activator")
    //-     v-icon(color="secondary") developer_board
    //-   span Developer Mode
    v-tooltip(bottom)
      v-btn(
        color="primary" slot="activator"
        @click="() => $emit('save')"
        ) Save
      span Save Current
</template>

<script>
export default {
  name: 'OptionsModifyToolbar',
  props: ['items', 'currentId', 'create']
}
</script>
