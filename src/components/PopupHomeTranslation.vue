<template lang="pug">
  v-container
    base-translation(
      languageSwitch
      :src="srcLanguage" :dest="destLanguage"
      :api="currentSource"
      :result="result"
      )
</template>

<script>
import { mapState } from 'vuex'
import BaseTranslation from '@/components/BaseTranslation'

export default {
  name: 'PopupHomeTranslation',
  data () {
    return {}
  },
  computed: {
    ...mapState(['currentSource', 'result', 'srcLanguage', 'destLanguage'])
  },
  components: {
    BaseTranslation
  }
}
</script>
