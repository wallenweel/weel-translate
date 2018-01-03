<template lang="pug">
  v-layout(wrap)
    options-modify-toolbar(
      :items="items"
      :current-id="id"
      @create="() => (createDialog = true)"
      @close="removePreset"
      @active="switchPreset"
      @save="savePreset"
      )
    v-snackbar(
      absolute
      :timeout="3000"
      top
      v-model="snackbar"
      ) {{ alert[1] }}
      v-btn(flat small color="pink" @click.native="snackbar = false") Close

    options-service-source-create(
      :show="createDialog"
      :select="items"
      @close="v => (createDialog = v)"
      @create="createPreset"
      )

    v-layout(wrap column v-if="!items.length" :class="$style.content")
      v-alert(type="error" :value="true" style="width: 100%;")
        span Please keep one preset at least or refresh(F5) this page restore all of them.

    v-layout(wrap :class="$style.content" v-else)
      v-flex(d-flex sm6 lg5 :class="$style.editorPart")
        base-code-editor(
          editorStyle="min-height: calc(100vh - 96px);"
          mode="application/json"
          :content="preset"
          :changes="id"
          @changes="editorChanges"
          @restore="editorRestore"
          @compile="editorCompile"
          )

      v-flex(d-flex sm6 lg4 :class="$style.respondPart")
        v-layout(column style="width: 100%; height: 100%;")
          v-toolbar(dense)
            v-toolbar-title Text Query Result
          v-flex(:class="$style.responseArea")
            code {{ response }}

      v-flex(d-flex sm12 lg3 :class="$style.viewPart")
        v-layout(column)
          v-tooltip(v-model="tip" bottom)
            v-flex(slot="activator")
            span {{ tipMsg }}
          v-toolbar(dense color="primary" dark)
            v-toolbar-title Test This Preset
          v-container
            base-translation(
              :api="api"
              :result="result"
              :input="queryText"
              @input="inputChanged"
              )
            v-flex {{ queryDetail }}
            v-flex(:class="overlay").overlay.overlay--absolute
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { SAVE_CUSTOM_SOURCES_PRESET } from '@/types'

import BaseCodeEditor from '@/components/BaseCodeEditor'
import BaseTranslation from '@/components/BaseTranslation'
import OptionsModifyToolbar from '@/components/OptionsModifyToolbar'
import OptionsServiceSourceCreate from '@/components/OptionsServiceSourceCreate'

const tmpType = 'sources'
export default {
  name: 'ServiceSourceAPI',
  data () {
    return {
      snackbar: false,
      createDialog: false,
      tip: false,
      tipMsg: '...'
    }
  },
  computed: {
    globalTip () { return this.$store.state.globalTip },

    alert () { return this.sources['alert'] },
    presets () { return this.sources['preset'] },

    id () { return this.sources['current_id'] },
    api () { return this.sources['current_api'] },
    preset () { return this.presets[this.id] },
    response () { return this.sources['current_response'] },
    items () { return this.sources['items'] },
    queryText () { return this.sources['current_input'] },
    queryDetail () { return this.sources['query_detail'] },
    result () { return this.sources['current_result'] },

    reset () { return Object.keys(this.api).length },
    overlay () { return !this.reset ? 'overlay--active' : '' },

    ...mapState({
      sources ({ tmp }) { return tmp.sources }
    })
  },
  methods: {
    ...mapMutations({
      inputChanged (commit, text) {
        commit('tmpStateUpdate', [tmpType, { current_input: text }])
      },
      editorChanges (commit, content) {
        commit('currentEditorChanges', [tmpType, { id: this.id, content }])
      },
      editorCompile (commit, content) {
        commit('compileCurrentCodes', [tmpType, { id: this.id, content }])
      },
      editorRestore (commit) {
        commit('tmpCurrentRestore', [tmpType, { id: this.id }])
      },

      createPreset (commit, { id, name, inherit }) {
        const [_id, _name] = [JSON.stringify(id), JSON.stringify(name)]

        let preset = `{\r  "id": ${_id},\r  "name": ${_name}\r}`
        if (inherit) preset = `[${JSON.stringify(inherit)}, ${preset}]`

        commit('createdNewPreset', [tmpType, { id, name, preset }])
      },
      switchPreset (commit, { id }) {
        commit('changeCurrentPreset', [tmpType, { id }])
      },
      removePreset (commit, { id }) {
        commit('removeCurrentPreset', [tmpType, { id }])
      }
      // savePreset (commit) {
      //   commit('saveCurrentPreset', [tmpType])
      // }
    }),

    ...mapActions({
      savePreset (dispatch) {
        dispatch(SAVE_CUSTOM_SOURCES_PRESET)
      }
    }),

    useTip (value) {
      [this.tip, this.tipMsg] = value
      setTimeout(() => (this.tip = false), 2500)
    }
  },
  watch: {
    alert ([flag]) {
      this.snackbar = flag
    },
    globalTip (value) { this.useTip(value) }
  },
  components: {
    BaseCodeEditor,
    BaseTranslation,
    OptionsModifyToolbar,
    OptionsServiceSourceCreate
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
