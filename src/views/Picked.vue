<template>
  <div class="view-picked">
    <mdc-layout-grid class="-banner">
      <mdc-text typo='overline' tag="span">{{ $t('__tip.picked_top') }}</mdc-text>
    </mdc-layout-grid>

    <mdc-list class="-list" interactive dense>
      <transition-group name="list">
      <mdc-list-item class="-item"
        v-for="item in items" :key="`${item.id}`"
        @click="$router.push({ name: 'translate', params: { text: item.text, source: item.source } })"
      >
        <div>
          <span class="-text">{{ item.text }}</span>
          <span class="-source">
            <span>{{ item.source.fromto.join(' > ') }}</span>
            <span> ({{ item.source.name }})</span>
          </span>
          <span class="-title">{{ item.title }}</span>
          <!-- <span class="-excerpt">{{ item.excerpt }}</span><br /> -->
        </div>

        <mdc-button class="-remove" @click.stop.prevent="handleRemove(item.id)">
          <icon-delete/>
        </mdc-button>
      </mdc-list-item>
      </transition-group>
    </mdc-list>
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

@Component({
  components: {
    IconDelete,
  },
})
export default class PickedView extends Vue {
  @__.State('picked') private items!: TranslationConfig['translation_picked'];
  @__.Mutation('text') private updateText!: MutationMethod;
  @__.Action('unpick') private remove!: ActionMethod;
  @__.Action('translate') private restoreTranslation!: ActionMethod;

  private handleRemove(id: string) {
    this.$nextTick(() => {
      this.remove(id);
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
      line-height: 1.35;
      padding: 8px 16px;
      color: var(--mdc-theme-text-secondary-on-light);
      .-text {
        color: var(--mdc-theme-text-primary-on-light);
        font-size: 14px;
        font-weight: bold;
      }
      .-title {
        font-size: 12px;
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
