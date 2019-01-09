import IconBase from '@/components/IconBase.vue';

class GlobalComponents {
  public install(Vue: any) {
    Vue.component('icon-base', IconBase);
  }
}

export default new GlobalComponents();
