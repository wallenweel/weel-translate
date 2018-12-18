<template>
  <main class="popup-content">
    <scrollbar class="main-scrollbar" ref="scrollbar"
      @ps-y-reach-start="handleScrollReachStart"
      @ps-scroll-down="handleScrollDown"
    >
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </scrollbar>
  </main>
</template>

<script lang="ts">
import { Component, Model, Vue } from 'vue-property-decorator';

@Component
export default class PopupContent extends Vue {
  @Model('scroll', { type: Boolean })
  private isReachStart: boolean = true;

  private mounted() {
    if (this.$refs.scrollbar.$el.scrollTop > 0) {
      this.$emit('scroll', false);
    }
  }

  private handleScrollReachStart() {
    if (this.isReachStart) { return; }
    this.$emit('scroll', true);
  }

  private handleScrollDown(ev: any) {
    if (!this.isReachStart) { return; }
    this.$emit('scroll', false);
  }
}
</script>

<style lang="scss">
.main-scrollbar {
  height: calc(var(--app-height) - var(--app-toolbar-height));
  width: 100%;
}

.ps {
  $y-w: 4px;
  .ps__scrollbar-y-rail {
    background-color: var(--mdc-theme-text-secondary-on-dark, transparent) !important;
    width: $y-w !important;
    right: 2px !important;
    .ps__scrollbar-y {
      background-color: var(--mdc-theme-text-hint-on-light, transparent) !important;
      width: $y-w !important;
      right: 0 !important;
    }
  }
}
</style>
