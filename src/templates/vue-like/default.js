export default
`<parser>
  {
    "google|google_cn": {
      "phonetic_src": "sentences.$.src_translit",
      "phonetic_dest": "sentences.$.translit",
      "translation": "sentences(trans)",
      "explain": "dict(pos////terms)"
    }
  }
</parser>

<template id="default">
  <div>
    <div class="weel-fab" ref="fab" v-if="useFAB"
      @click.stop.prevent="handleFAB"
      @mouseup.prevent.stop="ev => ev.target.removeAttribute('data-mousedown')"
      @mousedown.prevent.stop="ev => ev.target.setAttribute('data-mousedown', true)"
    >
      <transition name="bounce">
        <button v-show="fabShow">
          <i class="weel-svg-icons -weel-translate -icon"></i>
        </button>
      </transition>
      <span class="-mask" v-if="loading"></span>
    </div>
    
    <div class="weel-fap" ref="fap" v-if="useFAP"
      @mouseup.prevent.stop="ev => ev.target.removeAttribute('data-mousedown')"
      @mousedown.prevent.stop="ev => ev.target.setAttribute('data-mousedown', true)"
    >
      <transition name="fade">
        <div v-show="fapShow">
          <input class="-copyTmp" :value="getResult.translation" ref="copyTmp" />

          <div class="-phonetic" v-show="getResult.phonetic_src">
            <button class="-js" @click="handleVoice('src')">
              <i class="weel-svg-icons -volume-high -icon"></i>
            </button>
            {{getResult.phonetic_src}}      
          </div>
          <div class="-phonetic" v-show="getResult.phonetic_dest">
            <button class="-js" @click="handleVoice('dest')">
              <i class="weel-svg-icons -volume-high -icon"></i>
            </button>
            {{getResult.phonetic_dest}}
          </div>
          <div class="-translation">
            <button class="-js -copy" @click="handleCopy">
              <i class="weel-svg-icons -content-copy -icon"></i>
            </button>
            {{getResult.translation}}
          </div>
          <div class="-explain" v-show="getResult.explain">
            <pre>{{getResult.explain}}</pre>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
({ mapState }) => ({})
</script>

<style scoped="data-weel-translate"></style>`
