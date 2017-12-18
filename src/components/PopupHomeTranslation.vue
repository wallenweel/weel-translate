<template lang="pug">
  v-container
    v-layout(column wrap)
      v-card
        v-layout(row wrap :class="$style.languageToolbar")
          //- source language selection
          v-select(
            min-width=120
            label="Select"
            overflow hide-details
            auto dense
            :items="currentSource.languages.length ? currentSource.languages : languages"
            item-text="locale"
            item-value="code"
            v-model="srcLanguage"
            :class="$style.from"
            )
          //- a mini button to swap two languages
          v-btn(icon style="min-width: 32px;" @click="swapLanguages")
            v-icon(color="primary" small) swap_horiz
          //- aim language selection
          v-select(
            min-width=120
            label="Select"
            overflow hide-details
            auto dense
            :items="currentSource.languages.length ? currentSource.languages : languages"
            item-text="locale"
            item-value="code"
            v-model="aimLanguage"
            :class="$style.to"
            )

      v-card
        //- input of translating 
        v-text-field(
          textarea
          placeholder="something else ..."
          rows=3
          hide-details
          full-width
          v-model="content"
          )
        v-layout(
          row justify-space-around
          :class="$style.tools"
          )
          //- delete button
          v-btn(flat depressed @click="deleteContent")
            v-icon(color="blue-grey") delete
          //- translation button
          v-btn(
            fab dark medium color="primary"
            :class="$style.translate"
            @click="startTranslate"
            )
            v-icon(dark) done_all
          //- speak out content button
          v-btn(flat depressed)
            v-icon(color="blue-grey") volume_up
        
      v-flex(:class="$style.selection")
        v-btn(block medium dark color="accent" @click="nextServiceSource")
          //- |source&nbsp;:&nbsp;&nbsp;
          b(v-model="currentSource") {{ currentSource.name }}
          img(style="margin-left: 4px;" height=16 width=16 :src="currentSource.icon")

      v-flex(:class="$style.selection")
        v-card(:class="$style.result")
          v-layout(column wrap)
            v-flex
              v-btn(flat small icon)
                v-icon(color="blue-grey") volume_up
              span [ 'ɑːnsə ]
            v-flex
              v-btn(flat small icon)
                v-icon(color="blue-grey") content_copy
              span(:class="$style.translation") 答案
            v-divider
            v-card-text(class="body-2")
              div n. 工作；[物] 功；产品；操作；职业；行为；事业；工厂；著作；文学、音乐或艺术作品
              div vt. 使工作；操作；经营；使缓慢前进
              div vi. 工作；运作；起作用
              div n. （英、埃塞）沃克（人名）
</template>

<script>
import { mapState } from 'vuex'
import { REQUEST_TRANSLATION } from '@/types'

export default {
  name: 'PopupHomeTranslation',
  data () {
    return {
      srcLanguage: 'auto',
      aimLanguage: 'auto',
      languages: [],
      content: '',
      source: {}
    }
  },
  computed: {
    ...mapState(['currentSource'])
  },
  methods: {
    startTranslate () {
      this.$store.dispatch(REQUEST_TRANSLATION)
    },
    swapLanguages () {
      [ this.aimLanguage, this.srcLanguage ] = [ this.srcLanguage, this.aimLanguage ]
    },
    deleteContent () {
      this.content = ''
    },
    nextServiceSource () {
      this.$store.commit('nextServiceSource')
    }
  },
  watch: {
    srcLanguage (code) {
      console.log(code)
    },
    aimLanguage (code) {
      console.log(code)
    }
  }
}
</script>

<style lang="scss" module>
.languageToolbar {
  :global {
    .input-group__input {
      box-shadow: unset !important;
      justify-content: space-around;
    }
    .input-group__selections {
      user-select: none;
      width: 100% !important;
      // justify-content: end;
      &__comma {
        width: 0;
        white-space: nowrap;
        display: inline-table;

        &::after {
          content: "";
          background-image: linear-gradient(to left, white, transparent);
          height: 100%;
          width: 1em;
          right: 0;
          position: absolute;
          display: inline-block;
        }
      }
    }
    .input-group__details {
      display: none;
    }
  }
}

.from {
  :global {
    .input-group__selections__comma {
      margin-right: auto;
    }
  }
}

.to {
  :global {
    .input-group__selections__comma {
      margin-left: auto;
    }
  }
}

.tools {
  margin-top: -6px;
}

.translate {
  margin-top: -4px;
}

.selection {
  padding: 10px 16px 0;

  &:last-child {
    padding-bottom: 24px;
  }
}

.result {
  min-height: 120px;
  padding: 8px 6px;
}

.translation {
  font-weight: bold;
}
</style>


