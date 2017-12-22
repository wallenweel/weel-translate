<template lang="pug">
  v-container
    div(ref="test") test
    base-translation(:api="currentSource" :result="result")
</template>

<script>
import { mapState } from 'vuex'
import BaseTranslation from '@/components/BaseTranslation'
import { injectHTML } from '@/functions/utils'
import parserHelper from '@/functions/parserHelper'
import { response } from '@/api/mocks'
export default {
  name: 'PopupHomeTranslation',
  data () {
    return {}
  },
  mounted () {
    let tpl = this.$store.state.templates.preset['float-result-panel']
    let parser = tpl.match(/<!--parser([\s\S]+?)-->/i, tpl)
    if (parser) {
      try {
        parser = JSON.parse(parser[1])
      } catch (error) {
        console.log(error)
      }
    }
    const result = parserHelper({ parser })(JSON.parse(response))
    console.log(`${Object.keys(result).join('|')}`)
    const reg = new RegExp(`{{(${Object.keys(result).join('|')})}}`, 'g')
    tpl = tpl.replace(reg, (preset, key) => {
      console.log(key)
      return result[key]
    })
    injectHTML(tpl, this.$refs.test)
  },
  computed: {
    ...mapState(['currentSource', 'result'])
  },
  components: {
    BaseTranslation
  }
}
</script>
