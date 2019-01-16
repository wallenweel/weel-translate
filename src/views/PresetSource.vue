<template>
  <div class="view-source-preset">
    <code-editor
      :code="code" :lineNumbers="false"
      @change="handleChange" @save="handleSave"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import CodeEditor from '@/components/CodeEditor.vue';
import debug from '@/functions/debug';

@Component({
  components: {
    CodeEditor,
  },
})
export default class SourcePresetView extends Vue {
  private code: object = { "test": true, "t": 0 };

  private handleChange(code: string) {
    debug.log(code);
  }

  private handleSave(code: string) {
    debug.log(code);
  }
}
</script>

<style lang="scss">
</style>
