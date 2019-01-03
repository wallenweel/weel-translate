<template>
  <div class="view-picked">
    <mdc-layout-grid class="-banner">
      <mdc-text typo='overline' tag="span">{{ $t('__tip.picked_top') }}</mdc-text>
    </mdc-layout-grid>

    <mdc-drawer-list class="-list">
      <transition-group name="list">
      <mdc-drawer-item class="-item" v-for="item in items" :key="`${item.id}`"
        :to="{ name: 'translate', params: { text: item.text, source: item.source } }"
      >
        <div>
          <span class="-title">{{ item.title }}</span>
          <span class="-text">({{ item.text }})</span>
          <span class="-source">
            <span>{{ item.source.fromto.join(' > ') }}</span>
            <span> ({{ item.source.name }})</span>
          </span>
          <span class="-excerpt">{{ item.excerpt }}</span><br />
        </div>

        <mdc-button class="-remove" @click.stop.prevent="handleRemove(item.id)">
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

  private handleRemove(id: string) {
    this.$nextTick(() => {
      this.remove(id);
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
  .-banner {
    background-color: var(--mdc-theme-primary, #6200ee);
    color: var(--mdc-theme-text-primary-on-dark, #ffffff);
    padding: 0 16px 16px;
  }

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
        display: block;
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
