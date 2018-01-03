<template lang="pug">
  v-layout(wrap)
    options-modify-toolbar

    v-layout(wrap :class="$style.content")
      v-flex(d-flex sm6 lg6 :class="$style.editorPart")
        base-code-editor(
          editorStyle="min-height: calc(100vh - 96px);"
          :content="tmp.templates.preset['default']"
          :method="handleRun"
          mode="text/html"
          error="true"
          )

      v-flex(d-flex sm6 lg6 :class="$style.respondPart")
        v-layout(column style="width: 100%; height: 100%;")
          v-toolbar(dense)
            v-btn(
              icon color="accent"
              style="margin-top: 8px;"
              @click="openLink"
              )
              v-icon touch_app
            v-text-field(
              label="Open other link in iframe."
              placeholder="https://"
              clearable hide-details
              v-model="iframeLink"
              )

          iframe(
            height="100%" width="100%"
            style="border: none; background: white;"
            :src="iframeHref || href" ref="iframe"
            )
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
      href: '/content/index.html',
      iframeLink: '',
      iframeHref: '',
      preset: this.$store.state.templates['float-result-panel']
    }
  },
  computed: {
    response () { return this.$store.state.tmp.sources.response },
    ...mapState(['currentSource', 'result', 'editorContent', 'tmp'])
  },
  methods: {
    handleRun (editor) {
      const preset = editor.getValue()
      try {
        this.$store.commit('compileCodes', JSON.parse(preset))
        this.$store.dispatch('tempRequest')
        // console.log(this.$store.state.tmp.sources.api)
      } catch (error) {
        // TODO: add error dialog
        console.log(error)
      }
    },
    openLink () {
      this.iframeHref = this.iframeLink || this.href
    }
  },
  watch: {
    iframeLink (v) {
      if (!v) this.iframeHref = this.href
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
