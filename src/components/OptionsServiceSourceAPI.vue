<template lang="pug">
  v-layout(wrap)
    options-modify-toolbar(
      :items="chips"
      :create-cb="handleCreate"
      :close-cb="handleClose"
      :active-cb="handleActive"
      :save-cb="handleSave"
      :save-disabled="!chips.length"
      :current-id="tmp.sources.current_id"
      )

    v-dialog(v-model="createDialog" max-width="420px")
        v-form(v-model="valid" ref="form" lazy-validation)
          v-card
            v-card-title
              h2 Create A New Preset
              h4 Also you can manually modify them later.
            v-card-text
              v-text-field(
                name="preset-id"
                label="Preset ID"
                v-model="presetID"
                :rules="presetIDRules"
                required
                )
              v-text-field(
                name="preset-name"
                label="Preset Name"
                v-model="presetName"
                :rules="presetNameRules"
                required
                )
              v-select(
                :items="chips"
                label="Inhert Preset"
                v-model="presetInherit"
                item-value="id"
                item-text="name"
                )
            v-card-actions
              v-spacer
              v-btn(flat @click="createDialog = false") Close
              v-btn(color="primary" flat @click="begainCreate") Okay


    v-layout(wrap column v-if="!tmp.sources.items.length" :class="$style.content")
      v-alert(type="error" :value="true" style="width: 100%;")
        span You have remove all presets, please keep one preset at least.

    v-layout(wrap :class="$style.content" v-else)
      v-flex(d-flex sm6 lg5 :class="$style.editorPart")
        base-code-editor(
          editorStyle="min-height: calc(100vh - 96px);"
          mode="application/json"
          :content="tmp.sources.editor_content"
          :compile-cb="handleRun"
          :restore-cb="handleRestore"
          @content-change="handleEditorChange"
          )

      v-flex(d-flex sm6 lg4 :class="$style.respondPart")
        v-layout(column style="width: 100%; height: 100%;")
          v-toolbar(dense)
            v-toolbar-title Text Query Result
          v-flex(:class="$style.responseArea")
            code {{ tmp.sources.current_response }}

      v-flex(d-flex sm12 lg3 :class="$style.viewPart")
        v-layout(column)
          v-toolbar(dense color="primary" dark)
            v-toolbar-title Test This Preset
          v-container
            base-translation(
              :api="tmp.sources.current_api"
              :result="result"
              :input="tmp.sources.current_input" 
              @input="handleInput"
              )
            v-flex {{ tmp.sources.query_detail }}
            v-flex(:class="transOverlay").overlay.overlay--absolute
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
      valid: true,
      presetID: '',
      presetIDRules: [
        v => !!v || 'Required!',
        v => /^(\d|_|[a-zA-Z])+$/.test(v) || 'Only uppercase and lowercase letters and numbers are supported'
      ],
      presetName: '',
      presetNameRules: [v => !!v || 'Required!'],
      presetInherit: '',
      createDialog: false
    }
  },
  created () {},
  computed: {
    reset () {
      return Object.keys(this.tmp.sources.current_api).length
    },
    transOverlay () {
      return !this.reset ? 'overlay--active' : ''
    },
    result () {
      return this.tmp.sources.current_result
    },
    chips () {
      return this.tmp.sources.items
    },
    ...mapState(['tmp', 'editorContent'])
  },
  methods: {
    begainCreate (ev) {
      if (this.$refs.form.validate()) {
        const [id, name] = [
          JSON.stringify(this.presetID),
          JSON.stringify(this.presetName)
        ]

        let base = `{\r  "id": ${id},\r  "name": ${name}\r}`
        if (this.presetInherit) {
          base = `[${JSON.stringify(this.presetInherit)}, ${base}]`
        }

        // console.log(base)
        this.$store.commit('createdNewPreset', base)
        this.$refs.form.reset()
        this.createDialog = false
      }
    },

    handleCreate (ev) {
      // console.log(ev)
      this.createDialog = true
    },
    handleClose (id) {
      this.$store.commit('removeCurrentPreset', id)
    },
    handleActive (id) {
      this.$store.commit('changeCurrentPreset', id)
      this.$store.commit('pushHistory', 'sources')
      this.$store.commit('tmpSourcesRestore')
    },
    handleSave () {
      this.$store.commit('saveSourcesPreset')
    },

    handleInput (text) {
      this.$store.commit('tmpSourceUpdate', { current_input: text })
    },
    handleRun (editor) {
      const preset = editor.getValue()

      try {
        this.$store.commit('compileCodes', preset)
        // this.$store.dispatch('tempRequest')
        // console.log(this.$store.state.tmp.sources.current_api)
      } catch (error) {
        // TODO: add error dialog
        console.log(error)
      }
    },
    handleRestore () {
      this.$store.commit('tmpSourcesRestore')
      // this.transOverlay = 'overlay--active'
    },
    handleEditorChange (content) {
      console.log(content)
      this.$store.commit('tmpSourceUpdate', { editor_content: content })
    }
  },
  watch: {
    createDialog (v) {
      if (!v) this.$refs.form.reset()
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
