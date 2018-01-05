<template lang="pug">
  v-layout(wrap column :class="$style.wrap")
    v-alert(
      style="margin: 0 0; width: 100%;"
      type="info" :value="true"
      )
      |{{ i('SETTING_INFO') }}

    v-flex(:class="$style.section")
      header
        v-icon(left) work
        span {{ i('SELECT_SERVICE_SOURCES') }}
      v-select(
        tags chips :label="i('ENABLE_NEEDED_SOURCES')"
        hide-details
        :items="allSourceIds"
        :value="visibleSourceIds"
        @input="sourcesVisibleChanges"
        )
        template(slot="selection" slot-scope="data")
          v-chip(
            small class="chip--select-multi"
            @input="data.parent.selectItem(data.item)"
            :selected="data.selected"
            :disabled="data.disabled"
            :key="JSON.stringify(data.item)"
            )
            //- v-avatar(class="accent") {{ data.item.slice(0, 1).toUpperCase() }}
            |{{ data.item }}

    v-flex(:class="$style.section")
      header
        v-icon(left) style
        span {{ i('CUSTOM_UI') }}
      v-layout(row)
        v-switch(
          hide-details color="primary" v-model="ui.fab"
          @change="settingChanges(['use_fab', ui.fab])"
          )
        span {{ i('PAGE_FLOAT_BUTTON') }}

      v-layout(row)
        v-switch(
          hide-details color="primary" v-model="ui.fap"
          @change="settingChanges(['use_fap', ui.fap])"
          )
        span {{ i('PAGE_FLOAT_PANEL') }}

      v-layout(row)
        v-switch(
          hide-details color="primary" v-model="ui.context"
          @change="settingChanges(['use_context_menu', ui.context])"
          )
        span {{ i('CONTEXT_MENU_ENTRY') }}
      v-radio-group(
        hide-details row v-if="ui.context"
        style="padding-top: 6px;" v-model="ui.context_way"
        @change="settingChanges(['context_menu_way', ui.context_way])"
        )
        v-radio(color="primary" :label="i('POPUP_PANEL')" value="popup")
        v-radio(color="primary" :label="i('FLOAT_PANEL')" value="float")

      v-layout(row)
        v-switch(
          hide-details color="primary" v-model="ui.browser_action_translate"
          @change="settingChanges(['browser_action_translate', ui.browser_action_translate])"
          )
        span {{ i('BROWSER_ACTION_TRANSLATE')}}

      v-layout(row)
        v-switch(
          hide-details color="primary" v-model="ui.selection_translate"
          @change="settingChanges(['selection_translate', ui.selection_translate])"
          )
        span {{ i('TRANSLATE_AFTER_SELECTED') }}

    v-flex(:class="$style.section")
      header
        v-icon(left) extension
        span {{ i('EXTENSION_MANAGEMENT') }}
      v-btn(block color="error" dark lazy @click.native="resetDialog = true")
        span {{ i('RESET') }}
      v-btn(block lazy @click.native="uninstallDialog = true")
        span {{ i('UNINSTALL') }}

    v-dialog(v-model="resetDialog" max-width="290")
      v-card
        v-card-title(class="headline") Reset The Extension?
        v-card-text
          span This operation will restore the extension's default data, if you want that, click "Okay" button.
        v-card-actions
          v-spacer
          v-btn(color="secondary" flat="flat" @click.native="resetDialog = false") Cancel
          v-btn(color="secondary" flat="flat" @click.native="resetExtension") Okay

    v-dialog(v-model="uninstallDialog" max-width="290")
      v-card
        v-card-title(class="headline") Uninstall The Extension (⊙_⊙)?
        v-card-text
          span You are attempting to uninstall the extension, it mean you will lost all of your data, if you sure that, click "Okay" button.
        v-card-actions
          v-spacer
          v-btn(color="secondary" flat="flat" @click.native="uninstallDialog = false") Cancel
          v-btn(color="secondary" flat="flat" @click.native="uninstallExtension") Okay
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { RESET_LOCAL_STORAGE, UNINSTALL_EXTENSION } from '@/types'

export default {
  name: 'PopupSetting',
  data () {
    return {
      resetDialog: false,
      uninstallDialog: false
    }
  },
  created () {
    // console.log(this.settings.use_fab)
    // this.apiSelected = this.visibleSourceIds
  },
  computed: {
    ui () {
      const {
        use_fab,
        use_fap,
        use_context_menu,
        context_menu_way,
        browser_action_translate,
        selection_translate
        } = this.settings

      return {
        fab: use_fab,
        fap: use_fap,
        context: use_context_menu,
        context_way: context_menu_way,
        browser_action_translate,
        selection_translate
      }
    },
    ...mapState(['sources', 'settings']),
    ...mapGetters(['currentSource', 'allSourceIds', 'visibleSourceIds'])
  },
  methods: {
    ...mapMutations(['sourcesVisibleChanges', 'settingChanges']),
    ...mapActions({
      resetExtension (dispatch) {
        dispatch(RESET_LOCAL_STORAGE)
        this.resetDialog = false
      },
      uninstallExtension (dispatch) {
        dispatch(UNINSTALL_EXTENSION)
        this.uninstallDialog = false
      }
    })
  }
}
</script>

<style lang="scss" module>
:global(.theme--light) .wrap {
  background-color: $color-background;
}

.section {
  margin: 12px 16px;
  :global {
    header {
      line-height: 2.75;
      .icon {
        margin-right: 8px;
      }
    }
  }
}
</style>
