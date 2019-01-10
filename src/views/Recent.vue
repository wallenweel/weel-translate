<template>
  <div class="view-recent">
    <mdc-layout-grid class="-banner">
      <mdc-text typo='overline' tag="span">{{ $t('__tip.recent_top', [numbers]) }}</mdc-text>
    </mdc-layout-grid>

    <mdc-list class="-list" dense two-line interactive>
      <transition-group name="list">
      <mdc-list-item class="-item"
        v-for="(item, i) in items" :key="item.id"
        @click="$router.push({ name: 'translate', params: { text: item.text, source: item.source } })"
      >
        <span class="-text">{{ item.text }}</span>
        <span class="-source" slot="secondary">
          <i>{{ item.source.fromto.join(' > ') }}</i>
          <i>({{ item.source.name }})</i>
        </span>
        <b slot="end-detail">{{ items.length - i }}</b>
      </mdc-list-item>
      </transition-group>
    </mdc-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace, Getter } from 'vuex-class';

const __ = namespace('translation');

@Component
export default class RecentView extends Vue {
  @__.State('recent') private items!: TranslationConfig['translation_recent'];
  @__.State('recentNumbers') private numbers!: TranslationConfig['translation_recent'];
}
</script>

<style lang="scss">
@import '../assets/styles/global';

.view-recent {
  .-banner {
    @include view-top-tip;
  }

  .-list {
    .-item {
      height: auto;
      padding: 8px 16px;
    }
    .-text {
      font-size: 14px;
      font-weight: bold;
    }
    .mdc-list-item__secondary-text {
      &::before { display: none; }
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
