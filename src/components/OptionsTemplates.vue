<template lang="pug">
  v-layout(wrap)
    options-modify-toolbar

    v-layout(wrap :class="$style.content")
      v-flex(d-flex sm6 lg5 :class="$style.editorPart")
        base-code-editor(
          editorStyle="min-height: calc(100vh - 96px);"
          :content="preset"
          :method="handleRun"
          mode="text/html"
          error="true"
          )

      v-flex(d-flex sm6 lg4 :class="$style.respondPart")
        v-layout(column style="width: 100%; height: 100%;")
          v-toolbar(dense)
            v-toolbar-title Get Request
            v-spacer
            v-tooltip(bottom)
              v-btn(color="white" round slot="activator") Text
              span Query Text

          v-flex(:class="$style.responseArea")
            code {{ response }}

      v-flex(d-flex sm12 lg3 :class="$style.viewPart")
        v-layout(column)
          v-container
            base-translation(:api="currentSource" :response="result")
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
      preset: this.$store.state.templates['float-result-panel']
    }
  },
  mounted () {
    // console.log(this.preset)
  },
  computed: {
    response () { return this.$store.state.temp.response },
    ...mapState(['currentSource', 'result'])
  },
  methods: {
    handleRun (editor) {
      const preset = editor.getValue()
      try {
        this.$store.commit('presetRunPass', JSON.parse(preset))
        this.$store.dispatch('testRequest')
        // console.log(this.$store.state.temp.api)
      } catch (error) {
        // TODO: add error dialog
        console.log(error)
      }
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
  // background-color: $color-secondary;
  height: 100%;
  overflow: auto;  
}
</style>
