<template lang="pug">
  v-layout(wrap)
    options-modify-toolbar

    v-layout(wrap :class="$style.content")
      v-flex(d-flex sm6 lg5 :class="$style.editorPart")
        base-code-editor(
          editorStyle="min-height: calc(100vh - 96px);"
          :content="editorContent.api"
          :compile-cb="handleRun"
          :reload-cb="reload"
          mode="application/json"
          )

      v-flex(d-flex sm6 lg4 :class="$style.respondPart")
        v-layout(column style="width: 100%; height: 100%;")
          v-toolbar(dense)
            v-toolbar-title Text Query Result
            //- v-spacer
            //- v-tooltip(bottom)
            //-   v-btn(color="white" round disabled slot="activator") Text
            //-   span Query Text
            //- v-tooltip(bottom)
            //-   v-btn(color="white" round disabled slot="activator") Audio
            //-   span Query Audio

          v-flex(:class="$style.responseArea")
            code {{ tmp.sources.response }}

      v-flex(d-flex sm12 lg3 :class="$style.viewPart")
        v-layout(column)
          v-toolbar(dense color="primary" dark)
            v-toolbar-title Test This Preset
          v-container
            base-translation(:api="tmp.sources.current_api" :result="result")
            v-flex {{ tmp.sources.queryDetail }}
            v-flex(:class="compiled").overlay.overlay--absolute
</template>

<script>
import { mapState } from 'vuex'
import BaseCodeEditor from '@/components/BaseCodeEditor'
import BaseTranslation from '@/components/BaseTranslation'
import OptionsModifyToolbar from '@/components/OptionsModifyToolbar'

export default {
  name: 'ServiceSourceAPI',
  data () {
    return {
      title: 'Edit/Create Translation API',
      editor: null,
      compiled: 'overlay--active'
    }
  },
  created () {
    // console.log(this.presets)
  },
  computed: {
    result () {
      console.log(this.tmp.sources.current_result)
      return this.tmp.sources.current_result
    },
    ...mapState(['tmp', 'editorContent'])
  },
  methods: {
    handleRun (editor) {
      const preset = editor.getValue()
      this.compiled = ''
      try {
        this.$store.commit('compileCodes', JSON.parse(preset))
        // this.$store.dispatch('tempRequest')
        // console.log(this.$store.state.tmp.sources.current_api)
      } catch (error) {
        // TODO: add error dialog
        console.log(error)
      }
    },
    reload () {
      this.compiled = 'overlay--active'
      this.$store.commit('tempReset')
      console.log(this.$store.state.tmp.sources.current_api)
    }
  },
  components: {
    BaseCodeEditor,
    BaseTranslation,
    OptionsModifyToolbar
  }
}
</script>

<style lang="scss" module>
.content {
  width: 100%;
  height: calc(100% - 48px);
  overflow-x: hidden;
  overflow-y: auto;
}

.editorPart {
  height: 100%;
}

.respondPart {
  height: 100%;
  code {
    width: 100%;
    height: 100%;
    background: none;
    padding: 24px;
    box-shadow: unset;
  }
}

.responseArea {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.viewPart {
  background-color: #f5f5f5;
  height: 100%;
  position: relative;
  overflow: auto;
}
</style>
