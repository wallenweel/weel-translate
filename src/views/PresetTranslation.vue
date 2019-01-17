<template>
  <div class="view-translation-preset">
    <code-editor class="-code"
      :code="code" :lineNumbers="false" :tabs="enabledSources"
      @select="handleSelect" @change="handleChange" @save="handleSave"
    />

    <section class="-test">
      <!-- <mdc-textfield class="-text" v-model="text" fullwidth label="Hint text" /> -->
      <translation-view class="-translation" />
      <!-- <code class="-response">{{preset}}</code> -->
      <code-editor class="-code" :readonly="true"
        :code="preset" :lineNumbers="false"
      />
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace, Getter } from 'vuex-class';
import CodeEditor from '@/components/CodeEditor.vue';
import { formatter } from '@/functions/preset';
import TranslationView from '@/views/Translation.vue';
import debug from '@/functions/debug';

const __ = namespace('translation');

@Component({
  components: {
    CodeEditor,
    TranslationView,
  },
})
export default class SourcePresetView extends Vue {
  @__.State private sources!: presetStringJson[];
  @__.State private enabledSources!: presetStringJson[];
  @__.Getter private preset!: SourcePreset;

  private code: object | string = { test: true, t: 0 };
  private text: string = '';

  private created() {
    this.code = formatter(this.sources[0])[1]!;
  }

  private handleSelect(idx: number) {
    this.code = formatter(this.sources[idx])[1]!;
  }

  private handleChange(code: string) {
    // debug.log(code);
  }

  private handleSave(code: string) {
    debug.log(code);
  }
}
</script>

<style lang="scss">
.view-translation-preset {
  display: flex;

  .-code {
    width: 100%;
  }
  .-test {
    min-width: 280px;
    max-width: 280px;
    width: 100%;
    flex-direction: column;
    display: flex;

    .-translation {
      --app-height: 340px;
      --app-toolbar-height: 0px;
      height: var(--app-height);
      border-bottom: solid 1px rgba(25, 25, 25, .25);
      flex-shrink: 0;
      overflow: auto;
    }
    .-response {
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
