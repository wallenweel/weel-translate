<template lang="pug">
  v-container
    base-translation(
      template="default"
      languageSwitcher
      :src-dest="src_dest"
      :api="currentSource"
      :result="result"
      :input="input_text || tmp.input_text"
      @input="updateInput"
      @changes="languageChanges"
      )
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import BaseTranslation from '@/components/BaseTranslation'

export default {
  name: 'PopupHomeTranslation',
  computed: {
    ...mapState(['result', 'src_dest', 'input_text', 'tmp']),
    ...mapGetters(['currentSource'])
  },
  methods: {
    ...mapMutations({
      languageChanges (commit, langs) {
        commit('languageChanges', langs)
      },
      updateInput (commit, text) {
        commit('updateTmpState', ['input_text', text])
      }
    })
  },
  components: {
    BaseTranslation
  }
}
</script>
