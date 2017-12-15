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
            :items="currentLanguages.length ? currentLanguages : languages"
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
            :items="currentLanguages.length ? currentLanguages : languages"
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
          |source&nbsp;:&nbsp;&nbsp;
          b(v-model="source") {{ source.text }}
          img(style="margin-left: 4px;" height=16 width=16 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAAHnSURBVEhLtZU9S8NAGMeTilVBBMUWQXCx0DpZ5+qi7gqufgLBXb+IOghOWhVFXC2uLjo4iIWKgzoIHYQivoGk/i73JCVt3mjwB3+eu+ftklxyMf4bU2wozWYzjSYZjiFVU0cPqVTqB9s9lmWVUBm9s4AHfF/oFM1LenwoyqIT6RWJWggzKuXhkJxHT7o0PtTsSQsPnj0gKYO5MU1zQns01H9iLlEVWaiAFskbxKp4hfEyUnnByK26MFdsM+y4ffwjaBedoz5xB0NSSbfVMFesSzgQUntkGA7Nyrq1hvmBhJJDvzQN3VdRXTqo9z4x9ibTbIoNurc9wBq3fEQzMvVAbEOGgZDzTH3rCbDAvLpyB+ZlCXUgKaFQfyfpRkpsO7GOkBD6xboLvIp1yIvtloZYvQDP/5E7+7A9mumgTSZvyEdLEnaoiW1Bw0MSXZjvSygS0o91lYbaNQm1wD9LwNIp7qsa+aGRsyolNsy/MepY74Sg31GxxdDvqBhAm+hXZ2uY70iKTfthl8Vcsyd+h10FVYmZzNX+LDAcVnEH/C+YIt/Am/b4QFKBhbo5ruuYorQJh+QMOtOl0ZB7hXJSHh+K5tARakgvF3zql3mBVpgGfbDxvlga9KIcz3xcNcelfvq1xD/95BjGH64vwr9Y/F6UAAAAAElFTkSuQmCC")

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
import {
  GET_LANGUAGE_LIST
} from '@/types'

export default {
  name: 'PopupHomeTranslation',
  data () {
    return {
      srcLanguage: 'auto',
      aimLanguage: 'auto',
      // languages: [],
      languages: [{
        'code': 'auto',
        'name': 'Automatic',
        'locale': 'AUTOAUTO AUTO AUTO'
      }, {
        'code': 'en',
        'name': 'English',
        'locale': 'ENGLISH'
      }, {
        'code': 'zh',
        'name': 'Chinese',
        'locale': 'CHINESE'
      }],
      content: '',
      source: { text: 'Google', id: 'google' }
    }
  },
  created () {
    this.$store.dispatch(GET_LANGUAGE_LIST)
  },
  computed: {
    ...mapState(['currentLanguages'])
  },
  methods: {
    languageListGet () {
      // console.log(this)
      this.$store.dispatch('languageListGet')
    },
    startTranslate () {
      this.$store.dispatch('languageListGet')
    },
    swapLanguages () {
      [ this.aimLanguage, this.srcLanguage ] = [ this.srcLanguage, this.aimLanguage ]
    },
    deleteContent () {
      this.content = ''
    },
    nextServiceSource () {
      const sources = [
        { text: 'Google', id: 'google' },
        { text: 'YouDao', id: 'youdao' },
        { text: 'Baidu', id: 'baidu' }
      ]

      for (const source of sources) {
        if (this.source.id === source.id) {
          const [i, l] = [sources.indexOf(source), sources.length]

          if (i < l - 1) return (this.source = sources[i + 1])
          else return (this.source = sources[0])
        }
      }
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


