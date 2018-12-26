import { VueConstructor } from 'vue';
import IconBase from '@/components/IconBase.vue';

class GlobalComponents {
  public install(Vue: VueConstructor) {
    Vue.component('icon-base', IconBase);
  }
}

export default new GlobalComponents();
