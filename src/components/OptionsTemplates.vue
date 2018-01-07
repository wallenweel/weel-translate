<template lang="pug">
  v-layout(wrap)
    options-modify-toolbar(:create="false" @save="savePreset")
    v-snackbar(
      absolute
      :timeout="3000"
      top
      v-model="snackbar"
      ) {{ alert[1] }}
      v-btn(flat small color="pink" @click.native="snackbar = false") Close

    v-layout(wrap :class="$style.content")
      v-flex(d-flex sm12 lg12 :class="$style.editorPart")
        base-code-editor(
          editorStyle="min-height: calc(100vh - 96px);"
          :content="preset"
          mode="text/html"
          @changes="editorChanges"
          @compile="editorCompile"
          )

      v-flex(d-flex sm6 lg6 :class="$style.respondPart" v-if="false")
        v-layout(column style="width: 100%; height: 100%;")
          v-toolbar(dense)
            v-btn(
              icon
              @click="$refs.iframe.contentWindow.location.reload()"
              )
              v-icon refresh
            v-btn(icon @click="openLink")
              v-icon done
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
import { mapState, mapMutations } from 'vuex'
import { SAVE_CUSTOM_TEMPLATES_PRESET } from '@/types'
import BaseCodeEditor from '@/components/BaseCodeEditor'
import BaseTranslation from '@/components/BaseTranslation'
import OptionsModifyToolbar from '@/components/OptionsModifyToolbar'

// import Vue from 'vue'
// import store from '@/stores/content'
// import defaultOptions from '@/pages/content/defaultOptions'

const tmpType = 'templates'
export default {
  name: 'ServiceSourceAPI',
  data () {
    return {
      snackbar: false,
      id: 'default',
      href: '/content/index.html',
      iframeLink: '',
      iframeHref: ''
    }
  },
  computed: {
    response () { return this.$store.state.tmp.sources.response },
    presets () { return this.templates['preset'] },
    compiled () { return this.templates['compiled'] },
    preset () { return this.presets[this.id] },
    alert () { return this.templates['alert'] },

    ...mapState({
      templates ({ tmp }) {
        return tmp.templates
      }
    })
  },
  methods: {
    savePreset () {
      this.$store.dispatch(SAVE_CUSTOM_TEMPLATES_PRESET)
    },
    openLink () {
      this.iframeHref = this.iframeLink || this.href
    },

    // injectInstance () {
    //   const iframe = this.$refs.iframe

    //   // iframe.contentWindow.location.reload()
    //   // console.log(iframe)
    //   // return

    //   const { template, script } = this.compiled[this.id]

    //   const el = iframe.contentDocument.createElement('div')
    //   iframe.contentDocument.body.appendChild(el)

    //   /* eslint-disable no-new */
    //   new Vue(Object.assign(
    //     defaultOptions({ el, store, template }),
    //     /* eslint-disable no-eval */
    //     (eval(script)({ mapState, mapGetters, mapMutations, mapActions }))
    //   ))
    // },

    ...mapMutations({
      editorCompile (commit, content) {
        commit('compileCurrentCodes', [tmpType, { id: this.id, content }])
        // this.injectInstance()
      },
      editorChanges (commit, content) {
        commit('currentEditorChanges', [tmpType, { id: this.id, content }])
      }
    })
  },
  watch: {
    alert ([flag]) {
      this.snackbar = flag
    },
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
