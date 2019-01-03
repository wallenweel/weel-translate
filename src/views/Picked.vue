<template>
  <div class="view-picked">
    <mdc-list class="-list" two-line dense>
      <mdc-list-item class="-item" v-for="(item, i) in items" :key="i">
        <router-link :to="{ name: 'translate', params: { text: item.text, source: item.source } }">
          <span class="-title">{{ item.title }}</span>
          <!-- <span class="-source">{{ item.source.name }}</span> -->
          <span>({{ item.text }})</span>
        </router-link>

        <div slot="secondary" class="-detail">
          <div class="-source">
            <span>{{ item.source.fromto[0] }}</span>><span>{{ item.source.fromto[1] }}</span>
            <span> ({{ item.source.name }})</span>
          </div>
          <span class="-excerpt">{{ item.excerpt }}</span><br />
        </div>

        <mdc-button class="-remove" slot="end-detail" @click="handleRemove(i, items)">
          <icon-delete/>
        </mdc-button>
      </mdc-list-item>
    </mdc-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { namespace, Getter } from 'vuex-class';
import { ActionMethod } from 'vuex';
import IconDelete from '@/components/icons/Delete.vue';
import debug from '@/functions/debug';

const __ = namespace('translation');

Component.registerHooks([
  'beforeRouteLeave',
]);

@Component({
  components: {
    IconDelete,
  },
})
export default class PickedView extends Vue {
  @__.State('picked') private items!: TranslationConfig['translation_picked'];
  @__.Action('unpick') private remove!: ActionMethod;
  @__.Action('translate') private restoreTranslation!: ActionMethod;

  private created() {
    debug.log(this.items);
  }

  private handleRemove(index: number) {
    debug.log(index);
    this.remove(index);
  }

  private beforeRouteLeave(to: any, from: any, next: () => {}) {
    next();
    const { params: { text, source } } = to;
    this.restoreTranslation({ text, source });
  }
}
</script>

<style lang="scss">
.view-picked {
  button.-remove {
    $sz: 32px;
    border-radius: $sz;
    height: $sz;
    width: $sz;
    min-width: $sz;
    padding: 0;
  }

  .-list {
    .-item {
      margin-bottom: 8px;
      
      .mdc-list-item__secondary-text {
        &::before { display: none; }
      }
      .mdc-list-item__meta {
        margin-right: -8px;
      }
      .-title {
        font-weight: bold;
      }
      .-source {
        font-size: 12px;
        font-style: italic;
        opacity: .8;
      }
    }
  }
}
</style>
