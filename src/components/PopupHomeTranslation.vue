<template lang="pug">
  v-container
    base-translation(
      languageSwitcher
      :src-dest="src_dest"
      :api="currentSource"
      :result="result"
      @changes="languageChanges"
      )
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import BaseTranslation from '@/components/BaseTranslation'

export default {
  name: 'PopupHomeTranslation',
  data () {
    return {}
  },
  computed: {
    ...mapState(['currentSource', 'result', 'src_dest'])
  },
  methods: {
    ...mapMutations({
      languageChanges (commit, langs) {
        commit('languageChanges', langs)
      }
    })
  },
  components: {
    BaseTranslation
  }
}
</script>
