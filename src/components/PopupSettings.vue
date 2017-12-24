<template lang="pug">
  v-container
    v-btn(block color="error" dark lazy @click.native="dialog = true")
      span Reset Extension
    v-dialog(v-model="dialog" max-width="290")
      v-card
        v-card-title(class="headline") Reset The Extension?
        v-card-text
          span This operation will restore the extension's default data, if you want that, click "Okay" button.
        v-card-actions
          v-spacer
          v-btn(color="secondary" flat="flat" @click.native="dialog = false") Cancel
          v-btn(color="secondary" flat="flat" @click.native="resetExtension") Okay
</template>

<script>
import { mapActions } from 'vuex'
import { RESET_LOCAL_STORAGE } from '@/types'

export default {
  name: 'PopupHomeSettings',
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    ...mapActions({
      resetExtension (dispatch) {
        dispatch(RESET_LOCAL_STORAGE)
        this.dialog = false
      }
    })
  }
}
</script>
