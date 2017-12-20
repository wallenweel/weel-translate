<template lang="pug">
  v-container
    base-translation(:api="currentSource")
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
    ...mapState(['currentSource'])
  },
  components: {
    BaseTranslation
  }
}
</script>
