import { mapState } from 'vuex'
import { istype } from '@/functions/utils'
import {
  REQUEST_TRANSLATION,
  REQUEST_VOICE
} from '@/types'

export default ({ el, store, template }) => ({
  el,
  template,
  store,
  data () {
    return {
      selectedText: null,
      fabShow: false,
      fapShow: false
    }
  },
  mounted () {
    document.addEventListener('mousedown', ev => {
      if (this.selectedText) {
        this.$nextTick(() => {
          this.fabShow = false
          this.fapShow = false
        })
      }

      return true
    }, false)

    document.addEventListener('mouseup', ev => {
      this.selectedText = window.getSelection().toString().trim()

      // 1. need current page have text selection
      // 2. only left click can trigger this
      if (!this.selectedText.length || ev.button !== 0) return true

      // prevent tirgger the same text rect again
      if (this.selectionRect) {
        const { clientX, clientY } = ev
        const { height, width, x, y } = this.selectionRect

        if (
          (clientX > x && clientX < x + width) &&
          (clientY > y && clientY < y + height)
        ) {
          this.$store.commit('clearSelection')

          return true
        }
      }

      this.$store.commit('getSelection')

      if (this.useFAB) {
        this.fabShow = true
        this.$nextTick(() => this.fabPosition())
      }

      return true
    }, false)
  },
  computed: {
    ...mapState(['result', 'selectionRect', 'settings', 'src_dest']),
    getResult () {
      const { phonetic_src, phonetic_dest, translation, explain } = this.result

      return {
        phonetic_src,
        phonetic_dest,
        translation: istype(translation, 'array') ? translation.join('') : translation,
        explain: istype(explain, 'array') ? explain.join('\n') : explain
      }
    },
    useFAB () { return this.settings.use_fab },
    useFAP () { return this.settings.use_fap }
  },
  methods: {
    handleFAB () {
      this.$store.dispatch(REQUEST_TRANSLATION, { q: this.selectedText })
    },
    handleVoice (from) {
      const code = {
        src: this.src_dest[0],
        dest: this.src_dest[1]
      }[from]

      this.$store.dispatch(REQUEST_VOICE, { q: this.selectedText, code })
    },
    fabPosition () {
      const { innerWidth, innerHeight } = window
      const { offsetWidth, offsetHeight } = this.$refs.fab
      const { height, width, x, y } = this.selectionRect

      let [offsetX, offsetY] = [
        x + width / 2 - offsetWidth / 2,
        y + height + offsetHeight * 0.125
      ]

      offsetX = offsetX > 0 ? offsetX : 16
      offsetY = offsetY > 0 ? offsetY : 16

      offsetX = innerWidth - offsetWidth - offsetX > 0 ? offsetX : innerWidth - offsetWidth
      offsetY = innerHeight - offsetY - offsetHeight > 0 ? offsetY : y - offsetHeight / 0.875

      this.$refs.fab.style.WebkitTransform = `translate3d(${offsetX}px, ${offsetY}px, 0)`
    },
    fapPosition () {
      const { innerWidth, innerHeight } = window
      const { offsetWidth, offsetHeight } = this.$refs.fap
      const { height, width, x, y } = this.selectionRect

      let [offsetX, offsetY] = [
        x + width / 2 - offsetWidth / 2,
        y + height + 16
      ]

      offsetX = offsetX > 0 ? offsetX : 16
      offsetY = offsetY > 0 ? offsetY : 16

      offsetX = innerWidth - offsetWidth - offsetX > 0 ? offsetX : innerWidth - offsetWidth - 16
      offsetY = innerHeight - offsetY - offsetHeight > 0 ? offsetY : y - offsetHeight - 16

      this.$refs.fap.style.WebkitTransform = `translate3d(${offsetX}px, ${offsetY}px, 0)`
    }
  },
  watch: {
    result () {
      this.fapShow = true
      this.$nextTick(() => this.fapPosition())
      this.fabShow = false
    }
  }
})
