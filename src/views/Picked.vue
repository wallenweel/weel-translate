<template>
  <div class="view-picked">
    <mdc-drawer-list class="-list">
      <transition-group name="list">
      <mdc-drawer-item class="-item" v-for="(item, i) in items" :key="`${item.text}`"
        :to="{ name: 'translate', params: { text: item.text, source: item.source } }"
      >
        <div>
          <span class="-title">{{ item.title }}</span>
          <span class="-text">({{ item.text }})</span>
          <div class="-source">
            <span>{{ item.source.fromto[0] }}</span>><span>{{ item.source.fromto[1] }}</span>
            <span> ({{ item.source.name }})</span>
          </div>
          <span class="-excerpt">{{ item.excerpt }}</span><br />
        </div>

        <mdc-button class="-remove" @click.stop.prevent="handleRemove(i, items)">
          <icon-delete/>
        </mdc-button>
      </mdc-drawer-item>
      </transition-group>
    </mdc-drawer-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Watch, Provide } from 'vue-property-decorator';
import { namespace, Getter } from 'vuex-class';
import { ActionMethod, MutationMethod } from 'vuex';
import IconDelete from '@/components/icons/Delete.vue';
import debug from '@/functions/debug';

const __ = namespace('translation');

Component.registerHooks(['beforeRouteLeave']);

@Component({
  components: {
    IconDelete,
  },
})
export default class PickedView extends Vue {
  @Provide() private mdcDrawer: any = {};

  @__.State('picked') private items!: TranslationConfig['translation_picked'];
  @__.Mutation('text') private updateText!: MutationMethod;
  @__.Action('unpick') private remove!: ActionMethod;
  @__.Action('translate') private restoreTranslation!: ActionMethod;

  private handleRemove(index: number) {
    this.$nextTick(() => {
      this.remove(index);
    });
  }

  private beforeRouteLeave(to: any, from: any, next: () => {}) {
    next();
    this.$nextTick(() => {
      const { params: { text, source } } = to;
      if (!text) { return; }
      this.updateText(text);
      this.restoreTranslation({ text, source });
    });
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
    margin-left: auto;
  }

  .-list {
    .-item {
      height: auto;
      margin-bottom: 8px;
      line-height: 1.35;
      color: var(--mdc-theme-text-secondary-on-light);
      .-title, .-text {
        color: var(--mdc-theme-text-primary-on-light);
        font-size: 14px;
        font-weight: bold;
      }
      .-source {
        font-size: 10px;
      }
      .-excerpt {
        font-size: 12px;
      }
    }
  }
}

.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
